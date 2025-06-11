import jwt from 'jsonwebtoken';

// Secret key should be stored in an environment variable for security
const JWT_SECRET = process.env.JWT_SECRET;

// Authentication Middleware
export const authenticate = async (req, res, next) => {
    
  // Check for the token in Authorization header (Bearer token)
  const tokenFromHeader = req.headers['authorization']?.split(' ')[1];

  // Check for the token in cookies
  const tokenFromCookie = req.cookies?.auth_token;

  // Use token from the Authorization header if available, otherwise from the cookies
  const token = tokenFromHeader || tokenFromCookie;

  // If no token is provided, respond with an Unauthorized error
  if (!token) {
    return res.status(401).json({ message: 'No token provided, access denied.' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the user data to the request object for use in route handlers
    req.user = decoded;
    console.log("g");
    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails, send Unauthorized error
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
