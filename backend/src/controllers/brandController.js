const Brand = require("../models/Brand");

exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Brand name required" });

    const exists = await Brand.findOne({ name: name.trim() });
    if (exists) return res.status(409).json({ message: "Brand already exists" });

    const item = await Brand.create({ name: name.trim(), description: description || "" });
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
      Brand.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Brand.countDocuments(filter),
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

    const item = await Brand.findById(id);
    if (!item) return res.status(404).json({ message: "Brand not found" });

    if (name && name.trim() !== item.name) {
      const exists = await Brand.findOne({ name: name.trim() });
      if (exists) return res.status(409).json({ message: "Brand name already used" });
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
    const item = await Brand.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: "Brand not found" });
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
