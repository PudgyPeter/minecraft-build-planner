import express from 'express';
import { getProjects, createProject, deleteProject, duplicateProject } from '../controllers/projectController.js';

const router = express.Router();

router.get('/', getProjects);
router.post('/', createProject);
router.delete('/:id', deleteProject);
router.post('/:id/duplicate', duplicateProject);

export default router;
