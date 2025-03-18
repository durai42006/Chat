import express from 'express';
import {test,registerUser,loginUser,getProfile,logoutUser} from '../controllers/authController.js';

const router = express.Router();

router.get('/', test);
router.post('/signup',registerUser)
router.post('/login',loginUser)
router.get('/profile',getProfile)
router.post('/logout', logoutUser);


export default router;
