const corsOptions = {
  origin: `http://${process.env.FRONTEND_HOST || '10.12.91.103'}:${process.env.FRONTEND_PORT || '3000'}`, // Frontend server
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions; 