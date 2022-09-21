import {Router} from 'express';

//Controller
import { uploadRouter } from './routes/upload'
import { downloadRouter } from './routes/download'


const router: Router = Router();

router.use('/upload', uploadRouter)
router.use('/download', downloadRouter)

export {router}; 