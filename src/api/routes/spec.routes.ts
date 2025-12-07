import { Router } from 'express';
import * as specController from '../controllers/spec.controller';
import { validateImportBody, validateValidateBody } from '../validators/spec.validator';

const router = Router();

router.post('/import', validateImportBody, specController.importSpec);
router.post('/validate', validateValidateBody, specController.validateSpec);
router.get('/:specId', specController.getSpec);
router.get('/:specId/operations', specController.getOperations);

export default router;
