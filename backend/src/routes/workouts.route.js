// routes/workout.routes.js
import express from 'express';
import { 
  getWorkouts, getWorkoutById, createWorkout, 
  updateWorkout, deleteWorkout, getWorkoutStats 
} from '../controllers/workout.controller.js';
import { verifyAccessToken } from '../controllers/auth.controller.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validação mínima
const workoutValidation = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('exercises').isArray({ min: 1 }).withMessage('Pelo menos 1 exercício'),
  body('exercises.*.name').notEmpty(),
  body('exercises.*.duration').isInt({ min: 1 })
];

router.get('/', verifyAccessToken, getWorkouts);
router.get('/stats', verifyAccessToken, getWorkoutStats);
router.get('/:publicId', verifyAccessToken, getWorkoutById);
router.post('/', verifyAccessToken, workoutValidation, createWorkout);
router.put('/:publicId', verifyAccessToken, workoutValidation, updateWorkout);
router.delete('/:publicId', verifyAccessToken, deleteWorkout);

export default router;