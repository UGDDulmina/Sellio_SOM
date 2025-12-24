const Product = require("../models/Product");
const Category = require("../models/Category");
const Brand = require("../models/Brand");

exports.create = async (req, res) => {
  try {
    const {
      name,
      sku,
      barcode = "",
      category,
      brand,
      sellingPrice,
      costPrice = 0,
      isWeight = false,
      stockQty = 0,
      imageBase64 = "",
    } = req.body;

    if (!name || !sku || !category || !brand || sellingPrice === undefined) {
      return res.status(400).json({ message: "name, sku, category, brand, sellingPrice required" });
    }

    const skuExists = await Product.findOne({ sku: sku.trim() });
    if (skuExists) return res.status(409).json({ message: "SKU already exists" });

    const [cat, br] = await Promise.all([Category.findById(category), Brand.findById(brand)]);
    if (!cat) return res.status(400).json({ message: "Invalid category" });
    if (!br) return res.status(400).json({ message: "Invalid brand" });

    const item = await Product.create({
      name: name.trim(),
      sku: sku.trim(),
      barcode: barcode.trim(),
      category,
      brand,
      sellingPrice: Number(sellingPrice),
      costPrice: Number(costPrice),
      isWeight: Boolean(isWeight),
      stockQty: Number(stockQty),
      imageBase64,
    });

    const populated = await Product.findById(item._id).populate("category").populate("brand");
    res.status(201).json(populated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { q = "", page = 1, limit = 10, category, brand } = req.query;

    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { sku: { $regex: q, $options: "i" } },
        { barcode: { $regex: q, $options: "i" } },
      ];
    }
    if (category) filter.category = category;
    if (brand) filter.brand = brand;

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      Product.find(filter)
        .populate("category")
        .populate("brand")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({ data, total, page: Number(page), limit: Number(limit) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const item = await Product.findById(id);
    if (!item) return res.status(404).json({ message: "Product not found" });

    if (body.sku && body.sku.trim() !== item.sku) {
      const skuExists = await Product.findOne({ sku: body.sku.trim(), _id: { $ne: id } });
      if (skuExists) return res.status(409).json({ message: "SKU already exists" });
      item.sku = body.sku.trim();
    }

    if (body.name !== undefined) item.name = body.name.trim();
    if (body.barcode !== undefined) item.barcode = body.barcode.trim();
    if (body.category !== undefined) item.category = body.category;
    if (body.brand !== undefined) item.brand = body.brand;
    if (body.sellingPrice !== undefined) item.sellingPrice = Number(body.sellingPrice);
    if (body.costPrice !== undefined) item.costPrice = Number(body.costPrice);
    if (body.isWeight !== undefined) item.isWeight = Boolean(body.isWeight);
    if (body.stockQty !== undefined) item.stockQty = Number(body.stockQty);
    if (body.imageBase64 !== undefined) item.imageBase64 = body.imageBase64;
    if (body.isActive !== undefined) item.isActive = body.isActive;

    await item.save();

    const populated = await Product.findById(id).populate("category").populate("brand");
    res.json(populated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Product.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
