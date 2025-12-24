const Customer = require("../models/Customer");

const mobileRegex = /^0\d{9}$/;

exports.create = async (req, res) => {
  try {
    const { name, mobile, username = "", nic = "", address = "" } = req.body;

    if (!name || !mobile) return res.status(400).json({ message: "name and mobile required" });
    if (!mobileRegex.test(mobile)) return res.status(400).json({ message: "Mobile must start with 0 and be 10 digits" });

    const exists = await Customer.findOne({ name: name.trim(), mobile: mobile.trim() });
    if (exists) return res.status(409).json({ message: "Customer already exists (name + mobile)" });

    const item = await Customer.create({
      name: name.trim(),
      mobile: mobile.trim(),
      username,
      nic,
      address,
    });

    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { q = "", page = 1, limit = 10 } = req.query;
    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { mobile: { $regex: q, $options: "i" } },
          ],
        }
      : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Customer.countDocuments(filter),
    ]);

    res.json({ data, total, page: Number(page), limit: Number(limit) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, username, nic, address, isActive } = req.body;

    const item = await Customer.findById(id);
    if (!item) return res.status(404).json({ message: "Customer not found" });

    const newName = name !== undefined ? name.trim() : item.name;
    const newMobile = mobile !== undefined ? mobile.trim() : item.mobile;

    if (mobile !== undefined && !mobileRegex.test(newMobile)) {
      return res.status(400).json({ message: "Mobile must start with 0 and be 10 digits" });
    }

    // check duplicate (name+mobile) excluding current id
    const dup = await Customer.findOne({ name: newName, mobile: newMobile, _id: { $ne: id } });
    if (dup) return res.status(409).json({ message: "Duplicate customer (name + mobile)" });

    item.name = newName;
    item.mobile = newMobile;
    if (username !== undefined) item.username = username;
    if (nic !== undefined) item.nic = nic;
    if (address !== undefined) item.address = address;
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
    const item = await Customer.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
