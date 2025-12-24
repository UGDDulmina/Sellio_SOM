const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true, unique: true },
    barcode: { type: String, trim: true, default: "" },

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },

    sellingPrice: { type: Number, required: true },
    costPrice: { type: Number, default: 0 },

    isWeight: { type: Boolean, default: false }, // if true -> sell by weight

    // For Phase 2 keep simple stock (Phase 4 will move to stock ledger + warehouse stock)
    stockQty: { type: Number, default: 0 },

    imageBase64: { type: String, default: "" }, // simple for now

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
