const router = require("express").Router();
const c = require("../controllers/customerController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.post("/", authorize("admin", "manager", "cashier"), c.create);
router.get("/", authorize("admin", "manager", "cashier"), c.list);
router.put("/:id", authorize("admin", "manager"), c.update);
router.delete("/:id", authorize("admin"), c.remove);

module.exports = router;
