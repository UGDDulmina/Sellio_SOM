const Category = require("../models/Category");

exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Category name required" });

    const exists = await Category.findOne({ name: name.trim() });
    if (exists) return res.status(409).json({ message: "Category already exists" });

    const item = await Category.create({ name: name.trim(), description: description || "" });
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { q = "", page = 1, limit = 10 } = req.query;
    const filter = q ? { name: { $regex: q, $options: "i" } } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      Category.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Category.countDocuments(filter),
    ]);

    res.json({ data, total, page: Number(page), limit: Number(limit) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const item = await Category.findById(id);
    if (!item) return res.status(404).json({ message: "Category not found" });

    if (name && name.trim() !== item.name) {
      const exists = await Category.findOne({ name: name.trim() });
      if (exists) return res.status(409).json({ message: "Category name already used" });
      item.name = name.trim();
    }

    if (description !== undefined) item.description = description;
    if (isActive !== undefined) item.isActive = isActive;

    await item.save();
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Category.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
