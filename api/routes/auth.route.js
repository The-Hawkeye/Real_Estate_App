import express from  'express';
import { signIn, signup ,signInWithGoogle} from '../controllers/auth.controller.js';
const router = express.Router();


router.post("/signup", signup );
router.post("/signin", signIn);
router.post("/google", signInWithGoogle)
export default router;