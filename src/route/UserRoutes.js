const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')

const UserController = require('../controller/UserController')

router.post("/", UserController.create)
router.put("/:id", UserController.update)
router.delete("/:id", UserController.delete)
router.get("/:id", UserController.show)
router.get("/", UserController.getAll)

module.exports = router;