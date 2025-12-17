import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {}, minimize: false } // critical: minimize:false keeps empty objects
}, { minimize: false }); // Ensure the schema itself allows empty objects

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;