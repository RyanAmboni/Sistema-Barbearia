const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, appointmentController.create);
router.get("/", auth, appointmentController.listForUser);
router.get("/all", auth, appointmentController.listAll);
router.delete("/:id", auth, appointmentController.cancel);

module.exports = router;
