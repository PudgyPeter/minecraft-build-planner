import express from 'express';
import { getMaterials, createMaterial, updateMaterial, deleteMaterial, bulkCreateMaterials } from '../controllers/materialController.js';

const router = express.Router();

router.get('/projects/:id/materials', getMaterials);
router.post('/', createMaterial);
router.post('/bulk', bulkCreateMaterials);
router.patch('/:id', updateMaterial);
router.delete('/:id', deleteMaterial);

export default router;
