import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again' });
    }

    try {
        // Decodes the token. Make sure your JWT_SECRET matches what you used to sign the token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // CRITICAL: This passes the ID to the controller
        req.body.userId = token_decode.id; 
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default authUser;