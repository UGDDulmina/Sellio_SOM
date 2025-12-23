const router = require("express").Router();
const { protect, authorize } = require("../middleware/auth");

router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

router.get("/admin-only", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Welcome Admin ✅" });
});

module.exports = router;
