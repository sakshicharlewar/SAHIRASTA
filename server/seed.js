import { db, initDb } from './src/db.js';
import { calculateAllCommuteTimes, calculateCommuteScore } from './src/services/commuteService.js';

// Center point: Nagpur CBD (Sitabuldi)
const CBD = { lat: 21.1458, lng: 79.0882 };

const areas = [
  { name: 'Dharampeth', lat: 21.1417, lng: 79.0644, baseRent: 15000 },
  { name: 'Ramdaspeth', lat: 21.1384, lng: 79.0792, baseRent: 18000 },
  { name: 'Hingna', lat: 21.1095, lng: 78.9669, baseRent: 8000 },
  { name: 'Wardhaman Nagar', lat: 21.1550, lng: 79.1308, baseRent: 12000 },
  { name: 'Manish Nagar', lat: 21.0892, lng: 79.0766, baseRent: 14000 },
  { name: 'Besur', lat: 21.0745, lng: 79.1030, baseRent: 10000 },
  { name: 'Civil Lines', lat: 21.1537, lng: 79.0768, baseRent: 20000 },
  { name: 'Bajaj Nagar', lat: 21.1278, lng: 79.0664, baseRent: 16000 },
  { name: 'Dighori', lat: 21.1110, lng: 79.1360, baseRent: 9000 }
];

const amenitiesList = [
  'Parking', 'Power Backup', 'Security', 'Gym', 'Clubhouse', 
  'Swimming Pool', 'Balcony', 'Modular Kitchen', 'Lift'
];

function generateProperties(count = 50) {
  const properties = [];
  for (let i = 0; i < count; i++) {
    const area = areas[Math.floor(Math.random() * areas.length)];
    // Add some randomness to coordinates within ~2km
    const lat = area.lat + (Math.random() - 0.5) * 0.02;
    const lng = area.lng + (Math.random() - 0.5) * 0.02;
    
    const rent = Math.floor(area.baseRent * (0.8 + Math.random() * 0.4));
    const bedrooms = Math.floor(Math.random() * 3) + 1;
    const bathrooms = Math.max(1, bedrooms - (Math.random() > 0.8 ? 1 : 0));
    const sqft = bedrooms * 500 + Math.floor(Math.random() * 300);
    
    const selectedAmenities = amenitiesList.filter(() => Math.random() > 0.5);
    
    const commute_times = calculateAllCommuteTimes(lat, lng, CBD.lat, CBD.lng);
    const commute_score = calculateCommuteScore(commute_times.car);

    properties.push({
      name: `${bedrooms} BHK Apartment in ${area.name}`,
      rent,
      city: 'Nagpur',
      state: 'Maharashtra',
      lat,
      lng,
      bedrooms,
      bathrooms,
      sqft,
      amenities: JSON.stringify(selectedAmenities),
      commute_times: JSON.stringify(commute_times),
      commute_score,
      available_from: new Date().toISOString().split('T')[0],
      is_published: 1
    });
  }
  return properties;
}

async function seed() {
  try {
    // Ensure tables exist
    initDb();

    console.log('Seeding database...');
    
    // Clear existing data
    db.prepare('DELETE FROM properties').run();
    db.prepare('DELETE FROM workplaces').run();

    const insertStmt = db.prepare(`
      INSERT INTO properties (
        name, rent, city, state, lat, lng, bedrooms, bathrooms, sqft, 
        amenities, commute_times, commute_score, available_from, is_published
      ) VALUES (
        @name, @rent, @city, @state, @lat, @lng, @bedrooms, @bathrooms, @sqft, 
        @amenities, @commute_times, @commute_score, @available_from, @is_published
      )
    `);

    const properties = generateProperties(50);
    
    const insertMany = db.transaction((props) => {
      for (const prop of props) insertStmt.run(prop);
    });

    insertMany(properties);

    // Seed property history for some properties
    const propertyIds = db.prepare('SELECT id FROM properties').all();
    const historyStmt = db.prepare(`
      INSERT INTO property_history (property_id, tenant_name, tenant_contact, feedback, stay_duration, rating)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    propertyIds.forEach((p, idx) => {
      if (idx % 3 === 0) {
        historyStmt.run(p.id, 'Rahul Sharma', '+91 98765 43210', 'Great owner, very responsive to repair requests. The locality is peaceful.', '18 Months', 5);
        historyStmt.run(p.id, 'Anjali Verma', '+91 87654 32109', 'Lived here for 2 years. Loved the balcony view, but parking is a bit tight.', '24 Months', 4);
      }
    });

    // Insert Nagpur CBD as a workplace
    db.prepare(`
      INSERT INTO workplaces (name, lat, lng, city, state)
      VALUES (?, ?, ?, ?, ?)
    `).run('Sitabuldi CBD', CBD.lat, CBD.lng, 'Nagpur', 'Maharashtra');

    console.log(`Successfully seeded 50 properties, history, and 1 workplace for Nagpur.`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    db.close();
  }
}

seed();
