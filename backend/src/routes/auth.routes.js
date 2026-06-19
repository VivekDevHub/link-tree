import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller.js';
import validateRequest from '../middlewares/validateRequest.js';
import { loginValidation, registerValidation } from '../validators/auth.validators.js';

const router = Router();

router.post('/register', registerValidation, validateRequest, registerUser);
router.post('/login', loginValidation, validateRequest, loginUser);

export default router;