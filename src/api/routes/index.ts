import { Router } from 'express';
import specRoutes from './spec.routes';
import environmentRoutes from './environment.routes';

const router = Router();

router.use('/spec', specRoutes);
router.use('/environment', environmentRoutes);

export default router;
