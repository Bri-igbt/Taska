export const authMiddleware = async (req, res, next) => {
    try {
        const { userId } = await req.auth();
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};