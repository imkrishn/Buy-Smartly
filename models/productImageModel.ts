import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  public_id: { type: String, required: true },
  url: { type: String, required: true },
  isSlider: { type: Boolean, default: false }
});

const Image = mongoose.models.Image || mongoose.model("Image", imageSchema);

export default Image;
