import { db } from '../db.js';
import { 
  calculateAllCommuteTimes, 
  calculateCommuteScore 
} from '../services/commuteService.js';

// Default workplace (Nagpur CBD)
const DEFAULT_WORKPLACE = {
  lat: 21.1458,
  lng: 79.0882
};

export const getProperties = async (req, res) => {
  try {
    const properties = db.prepare('SELECT * FROM properties WHERE is_published = 1 ORDER BY created_at DESC').all();
    
    // Parse JSON strings back to objects
    const formattedProperties = properties.map(prop => ({
      ...prop,
      amenities: JSON.parse(prop.amenities || '[]'),
      commute_times: JSON.parse(prop.commute_times || '{}')
    }));
    
    res.json(formattedProperties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    
    // Parse JSON strings back to objects
    const formattedProperty = {
      ...property,
      amenities: JSON.parse(property.amenities || '[]'),
      commute_times: JSON.parse(property.commute_times || '{}')
    };
    
    res.json(formattedProperty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProperty = async (req, res) => {
  try {
    const { 
      name, rent, lat, lng, bedrooms, bathrooms, sqft, amenities, available_from 
    } = req.body;

    // Validation
    if (!name || !rent || !lat || !lng || !bedrooms || !sqft) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Background calculation for commute (simulated)
    const commute_times = calculateAllCommuteTimes(lat, lng, DEFAULT_WORKPLACE.lat, DEFAULT_WORKPLACE.lng);
    const commute_score = calculateCommuteScore(commute_times.car);

    const stmt = db.prepare(`
      INSERT INTO properties (
        name, rent, lat, lng, bedrooms, bathrooms, sqft, amenities, 
        commute_times, commute_score, available_from
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name,
      parseFloat(rent),
      parseFloat(lat),
      parseFloat(lng),
      parseInt(bedrooms),
      parseInt(bathrooms || 1),
      parseInt(sqft),
      JSON.stringify(amenities || []),
      JSON.stringify(commute_times),
      commute_score,
      available_from || null
    );

    const newProperty = db.prepare('SELECT * FROM properties WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({
      ...newProperty,
      amenities: JSON.parse(newProperty.amenities),
      commute_times: JSON.parse(newProperty.commute_times)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFilteredProperties = async (req, res) => {
  try {
    const { 
      workplaceLat, 
      workplaceLng, 
      maxCommuteTime, 
      transportMode = 'car',
      minRent, 
      maxRent 
    } = req.query;

    let query = 'SELECT * FROM properties WHERE is_published = 1';
    const params = [];

    if (minRent) {
      query += ' AND rent >= ?';
      params.push(parseFloat(minRent));
    }
    if (maxRent) {
      query += ' AND rent <= ?';
      params.push(parseFloat(maxRent));
    }

    query += ' ORDER BY created_at DESC';
    
    let properties = db.prepare(query).all(...params);

    // Parse JSON strings and filter by commute time if coordinates provided
    properties = properties.map(prop => ({
      ...prop,
      amenities: JSON.parse(prop.amenities || '[]'),
      commute_times: JSON.parse(prop.commute_times || '{}')
    }));

    if (workplaceLat && workplaceLng && maxCommuteTime) {
      const wLat = parseFloat(workplaceLat);
      const wLng = parseFloat(workplaceLng);
      const maxTime = parseInt(maxCommuteTime);

      properties = properties.filter(prop => {
        const travelTimes = calculateAllCommuteTimes(prop.lat, prop.lng, wLat, wLng);
        return travelTimes[transportMode] <= maxTime;
      });
    }

    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM properties WHERE id = ?').run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPropertyHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = db.prepare('SELECT * FROM property_history WHERE property_id = ? ORDER BY created_at DESC').all(id);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
