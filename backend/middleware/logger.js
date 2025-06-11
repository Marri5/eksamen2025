// Request logging middleware
const logger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;
  
  // Log request
  console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - ${ip}`);
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - ${statusCode} - ${duration}ms`);
  });
  
  next();
};

module.exports = logger; 