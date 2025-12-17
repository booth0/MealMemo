import { 
    getAllUsers as getAllUsersModel,
    getUserByEmail, 
    updateUserRole as updateUserRoleModel 
} from '../models/usersModel.js';


const getAllUsers = async (req, res, next) => {
    try {
        let users;

        users = await getAllUsersModel();

        res.json({ users });
    } catch (error) {
        next(error);
    }
};

const searchUserByEmail = async (req, res, next) => {
    try {
        let user;
        const email = req.query.email;

        user = await getUserByEmail(email);

        res.json({ user });
    } catch (error) {
        next(error);
    }
};


const updateUserRole = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        const { role } = req.body;

        // Validate role
        if (!['user', 'contributor', 'admin'].includes(role)) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Invalid role selected'
            });
        }

        // Prevent admin from changing their own role
        if (userId === req.user.user_id) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You cannot change your own role'
            });
        }

        const updatedUser = await updateUserRoleModel(userId, role);

        if (!updatedUser) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'User not found'
            });
        }
        
        res.json({
            message: 'Role updated successfully',
            user: updatedUser
        });
    } catch (error) {
        next(error);
    }
};

export {
    getAllUsers,
    searchUserByEmail,
    updateUserRole
};