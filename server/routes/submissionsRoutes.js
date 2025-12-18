// server/routes/submissionsRoutes.js
import { Router } from 'express';
import {
  getPendingSubmissions,
  getSubmissionById,
  approveSubmission,
  rejectSubmission
} from '../controllers/submissionsController.js';
import { requireAuth, requireContributor } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth); 

// All routes require contributor role
router.use(requireContributor);

// GET /api/submissions - Get all pending submissions
router.get('/', getPendingSubmissions);

// GET /api/submissions/:id - Get specific submission details
router.get('/:id', getSubmissionById);

// POST /api/submissions/:id/approve - Approve submission
router.post('/:id/approve', approveSubmission);

// POST /api/submissions/:id/reject - Reject submission
router.post('/:id/reject', rejectSubmission);

export default router;