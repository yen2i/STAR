const mongoose = require('mongoose');

module.exports = (req, res, next) => {
    req.user = { id: new mongoose.Types.ObjectId() };
    next();
  };