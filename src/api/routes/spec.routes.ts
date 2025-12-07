import { Router } from 'express';
import * as specController from '../controllers/spec.controller';

const router = Router();

router.post('/import', specController.importSpec);
router.post('/validate', specController.validateSpec);
router.get('/:specId', specController.getSpec);
router.get('/:specId/operations', specController.getOperations);

export default router;
