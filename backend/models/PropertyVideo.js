const mongoose = require("mongoose");

const propertyVideoSchema = new mongoose.Schema({
  property_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  video_url: {
    type: String,
    required: true,
  },
  video_type: {
    type: String,
    required: true,
  },
});

const PropertyVideo = mongoose.model("PropertyVideo", propertyVideoSchema);
module.exports = PropertyVideo;
