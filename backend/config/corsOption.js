const allowOrigins = require('./allowOrigins');

const corsOptions = {
  orign: (origin, cb) => {
    if (allowOrigins.indexOf(origin) !== -1 || !origin) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
}

module.exports = corsOptions