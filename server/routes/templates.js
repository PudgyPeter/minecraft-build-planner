import express from 'express';
import { getTemplates, createTemplate, applyTemplate, deleteTemplate } from '../controllers/templateController.js';

const router = express.Router();

router.get('/', getTemplates);
router.post('/', createTemplate);
router.post('/:id/apply', applyTemplate);
router.delete('/:id', deleteTemplate);

export default router;
