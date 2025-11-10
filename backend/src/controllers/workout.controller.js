// controllers/workout.controller.js
import Workout from '../models/Workout.model.js';
import { validationResult } from 'express-validator';

export const getWorkouts = async (req, res) => {
  try {
    const { companyPublicId } = req.user;
    const { page = 1, limit = 10, search } = req.query;

    const filter = { companyPublicId, isActive: true };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'exercises.name': { $regex: search, $options: 'i' } }
      ];
    }

    const workouts = await Workout.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('publicId name description exercises totalDuration createdAt');

    const total = await Workout.countDocuments(filter);

    res.json({
      workouts,
      totalPages: Math.ceil(total / limit),
      currentPage: +page,
      total
    });

  } catch (error) {
    console.error('Erro ao buscar treinos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getWorkoutById = async (req, res) => {
  try {
    const { companyPublicId } = req.user;
    const { publicId } = req.params;

    const workout = await Workout.findOne({ publicId, companyPublicId, isActive: true })
      .select('-__v');

    if (!workout) return res.status(404).json({ message: 'Treino não encontrado' });

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const createWorkout = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Dados inválidos', errors: errors.array() });
  }

  try {
    const { companyPublicId, publicId: userPublicId } = req.user;
    const { name, description, exercises } = req.body;

    const workout = new Workout({
      name,
      description: description || '',
      exercises,
      companyPublicId,
      createdByPublicId: userPublicId
    });

    await workout.save();

    res.status(201).json({
      message: 'Treino criado com sucesso!',
      workout: {
        publicId: workout.publicId,
        name: workout.name,
        totalDuration: workout.totalDuration,
        exercisesCount: workout.exercises.length
      }
    });
  } catch (error) {
    console.error('Erro ao criar treino:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const updateWorkout = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Dados inválidos', errors: errors.array() });
  }

  try {
    const { companyPublicId } = req.user;
    const { publicId } = req.params;
    const { name, description, exercises } = req.body;

    const workout = await Workout.findOne({ publicId, companyPublicId });
    if (!workout) return res.status(404).json({ message: 'Treino não encontrado' });

    if (name !== undefined) workout.name = name;
    if (description !== undefined) workout.description = description;
    if (exercises !== undefined) workout.exercises = exercises;

    workout.updatedAt = new Date();
    await workout.save();

    res.json({
      message: 'Treino atualizado com sucesso!',
      workout: {
        publicId: workout.publicId,
        name: workout.name,
        totalDuration: workout.totalDuration,
        exercisesCount: workout.exercises.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    const { companyPublicId } = req.user;
    const { publicId } = req.params;

    const workout = await Workout.findOne({ publicId, companyPublicId });
    if (!workout) return res.status(404).json({ message: 'Treino não encontrado' });

    workout.isActive = false;
    await workout.save();

    res.json({ message: 'Treino deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getWorkoutStats = async (req, res) => {
  try {
    const { companyPublicId } = req.user;

    const stats = await Workout.aggregate([
      { $match: { companyPublicId, isActive: true } },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          totalExercises: { $sum: { $size: '$exercises' } },
          totalDuration: { $sum: '$totalDuration' },
          avgExercises: { $avg: { $size: '$exercises' } }
        }
      }
    ]);

    res.json(stats[0] || { totalWorkouts: 0, totalExercises: 0, totalDuration: 0, avgExercises: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};