export function optionalAuth(req, res, next) {
  const accessPassword = process.env.ACCESS_PASSWORD;
  
  if (!accessPassword) {
    return next();
  }

  const providedPassword = req.headers['x-access-password'];
  
  if (providedPassword === accessPassword) {
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized' });
}
