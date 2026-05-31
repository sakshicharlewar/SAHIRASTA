import express from 'express';
import { 
  getProperties, 
  createProperty, 
  getFilteredProperties, 
  getPropertyById,
  getPropertyHistory,
  deleteProperty
} from '../controllers/propertyController.js';

const router = express.Router();

router.get('/', getProperties);
router.post('/', createProperty);
router.get('/filtered', getFilteredProperties);
router.get('/:id', getPropertyById);
router.get('/:id/history', getPropertyHistory);
router.delete('/:id', deleteProperty);

export default router;
