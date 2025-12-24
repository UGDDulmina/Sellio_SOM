const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true }, // validate in controller
    username: { type: String, default: "" }, // email optional
    nic: { type: String, default: "" },      // optional
    address: { type: String, default: "" },  // optional
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

customerSchema.index({ name: 1, mobile: 1 }, { unique: true });

module.exports = mongoose.model("Customer", customerSchema);
