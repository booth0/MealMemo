// /server/controllers/submissionsController.js
import {
    getPendingSubmissions as getPendingSubmissionsModel,
    getSubmissionById as getSubmissionByIdModel,
    markSubmissionUnderReview,
    approveSubmission as approveSubmissionModel,
    rejectSubmission as rejectSubmissionModel
} from '../models/submissionsModel.js';


/**
 * Get all pending submissions (contributor only)
 * GET /api/submissions
 */
const getPendingSubmissions = async (req, res, next) => {
    try {
        const submissions = await getPendingSubmissionsModel();
        
        res.json({ submissions });
    } catch (error) {
        next(error);
    }
};

/**
 * Get submission by ID with full details (contributor only)
 * GET /api/submissions/:id
 */
const getSubmissionById = async (req, res, next) => {
    try {
        const submissionId = parseInt(req.params.id);
        const userId = req.user.user_id;
        
        const submission = await getSubmissionByIdModel(submissionId);
        
        if (!submission) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Submission not found'
            });
        }
        
        // Mark as under review if still pending
        if (submission.status === 'pending') {
            await markSubmissionUnderReview(submissionId, userId);
            submission.status = 'under_review';
        }
        
        res.json({ submission });
    } catch (error) {
        next(error);
    }
};

/**
 * Approve a submission (contributor only)
 * POST /api/submissions/:id/approve
 */
const approveSubmission = async (req, res, next) => {
    try {
        const submissionId = parseInt(req.params.id);
        const userId = req.user.user_id;
        const { notes } = req.body;
        
        const result = await approveSubmissionModel(submissionId, userId, notes);
        
        if (!result) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Submission not found'
            });
        }
        
        res.json({
            message: 'Recipe approved and added to Featured Recipes successfully',
            submission: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Reject a submission (contributor only)
 * POST /api/submissions/:id/reject
 */
const rejectSubmission = async (req, res, next) => {
    try {
        const submissionId = parseInt(req.params.id);
        const userId = req.user.user_id;
        const { notes } = req.body;
        
        if (!notes || notes.trim().length === 0) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Please provide a reason for rejection'
            });
        }
        
        const result = await rejectSubmissionModel(submissionId, userId, notes);
        
        if (!result) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Submission not found'
            });
        }
        
        res.json({
            message: 'Recipe rejected. The owner has been notified.',
            submission: result
        });
    } catch (error) {
        next(error);
    }
};


export {
    getPendingSubmissions,
    getSubmissionById,
    approveSubmission,
    rejectSubmission
};