// backend/src/config/jwt.config.ts
export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  signOptions: { 
    expiresIn: process.env.JWT_EXPIRES_IN 
  },
};