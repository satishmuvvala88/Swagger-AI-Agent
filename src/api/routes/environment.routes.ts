import { Router } from 'express';
import * as envController from '../controllers/environment.controller';

const router = Router();

router.post('/', envController.createEnvironment);
router.get('/spec/:specId', envController.listEnvironmentsForSpec);
router.get('/:envId', envController.getEnvironment);
router.put('/:envId', envController.updateEnvironment);
router.delete('/:envId', envController.deleteEnvironment);

export default router;
