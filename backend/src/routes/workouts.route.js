// routes/workout.routes.js
import express from 'express';
import multer from 'multer';
import { 
  getWorkouts, 
  getWorkoutById, 
  createWorkout, 
  updateWorkout, 
  deleteWorkout, 
  getWorkoutStats,
  uploadExerciseMedia  // Importar a nova função
} from '../controllers/workout.controller.js';
import { verifyAccessToken } from '../controllers/auth.controller.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Configuração do Multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Verificar tipos de arquivo permitidos
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
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado'), false);
    }
  }
});

// Validação mínima
const workoutValidation = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('exercises').isArray({ min: 1 }).withMessage('Pelo menos 1 exercício'),
  body('exercises.*.name').notEmpty(),
  body('exercises.*.duration').isInt({ min: 1 })
];

// Middleware para tratar erros do multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Arquivo muito grande. Tamanho máximo: 10MB'
      });
    }
  } else if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  next();
};

// Rota de upload de mídia para exercícios
router.post(
  '/upload-exercise-media', 
  verifyAccessToken,
  upload.single('media'),
  handleMulterError,
  uploadExerciseMedia
);

// Rotas de workout
router.get('/', verifyAccessToken, getWorkouts);
router.get('/stats', verifyAccessToken, getWorkoutStats);
router.get('/:publicId', verifyAccessToken, getWorkoutById);
router.post('/', verifyAccessToken, workoutValidation, createWorkout);
router.put('/:publicId', verifyAccessToken, workoutValidation, updateWorkout);
router.delete('/:publicId', verifyAccessToken, deleteWorkout);

export default router;