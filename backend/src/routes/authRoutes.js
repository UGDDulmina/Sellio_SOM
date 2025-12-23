const router = require("express").Router();
const auth = require("../controllers/authController");

// For Phase 1, keep register open. Later restrict to admin only.
router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/refresh", auth.refresh);
router.post("/logout", auth.logout);

module.exports = router;
