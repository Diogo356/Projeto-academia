// controllers/workout.controller.js
import Workout from '../models/Workout.model.js';
import { validationResult } from 'express-validator';
import cloudinary from '../config/cloudinary.js';

const uploadExerciseMediaToCloudinary = async (fileBuffer, originalName) => {
  // Determina o tipo de recurso baseado na extensão do arquivo
  const extension = originalName.split('.').pop().toLowerCase();
  const isVideo = ['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(extension);
  const isGif = extension === 'gif';
  
  const resourceType = isVideo ? 'video' : (isGif ? 'image' : 'image');
  
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'exercise-media',
        resource_type: resourceType,
        // Configurações para vídeos
        ...(isVideo && {
          format: 'mp4',
          transformation: [
            { width: 640, height: 360, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'mp4' }
          ]
        }),
        // Configurações para GIFs
        ...(isGif && {
          format: 'gif',
          transformation: [
            { width: 400, height: 400, crop: 'limit' },
            { quality: 'auto' }
          ]
        }),
        // Configurações para imagens
        ...(!isVideo && !isGif && {
          format: 'webp',
          transformation: [
            { width: 400, height: 400, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'webp' }
          ]
        })
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// POST /api/workouts/upload-exercise-media - Upload de GIF/Video para exercícios
export const uploadExerciseMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo enviado'
      });
    }

    // Verificar tamanho do arquivo (limite de 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'Arquivo muito grande. Tamanho máximo: 10MB'
      });
    }

    // Verificar tipo de arquivo
    const allowedTypes = [
      'image/gif',
      'video/mp4',
      'video/mov',
      'video/avi',
      'video/webm',
      'video/quicktime',
      'image/webp',
      'image/jpeg',
      'image/png'
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de arquivo não suportado. Use GIF, MP4, MOV, AVI, WebM, WebP, JPEG ou PNG'
      });
    }

    // Fazer upload para o Cloudinary
    const uploadResult = await uploadExerciseMediaToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    // Retornar URL do arquivo
    res.json({
      success: true,
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        resourceType: uploadResult.resource_type,
        format: uploadResult.format,
        duration: uploadResult.duration, // Para vídeos
        width: uploadResult.width,
        height: uploadResult.height
      }
    });

  } catch (error) {
    console.error('Erro no upload de mídia:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor durante o upload'
    });
  }
};

















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

    // Processar exercícios para garantir que tenham os campos necessários
    const processedExercises = exercises.map((exercise, index) => ({
      ...exercise,
      id: exercise.id || index + 1,
      duration: exercise.duration || 60,
      type: exercise.type || 'strength',
      // Se não tiver video, usar um placeholder ou null
      video: exercise.video || null,
      tips: exercise.tips || [],
      completed: false
    }));

    const workout = new Workout({
      name,
      description: description || '',
      exercises: processedExercises,
      companyPublicId,
      createdByPublicId: userPublicId
    });

    await workout.save();

    console.log('Treino salvo com sucesso:', workout);

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
    if (exercises !== undefined) {
      // Processar exercícios para garantir estrutura consistente
      workout.exercises = exercises.map((exercise, index) => ({
        ...exercise,
        id: exercise.id || index + 1,
        duration: exercise.duration || 60,
        type: exercise.type || 'strength',
        video: exercise.video || null,
        tips: exercise.tips || [],
        completed: exercise.completed || false
      }));
    }

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