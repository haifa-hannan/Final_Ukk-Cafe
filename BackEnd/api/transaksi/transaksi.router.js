const express = require("express");
const router = express.Router();

const {
  controllerGetTransaksi,
//   controllerGetTransaksiById,
  controllerAddTransaksi,
  controllerUpdateTransaksi,
  controllerDeleteTransaksi,
  controllerFilterTransaksi,
  controllerFindTransaksi
} = require("./transaksi.controller");


const {AuthUser, AuthAdmin} = require("../../middleware/AuthUser");

router.get("/", AuthUser, controllerGetTransaksi);
// router.get("/:id", controllerGetTransaksiById);
router.post("/", AuthUser, controllerAddTransaksi);
router.put("/:id", AuthUser, controllerUpdateTransaksi)
router.delete("/:id", AuthUser, controllerDeleteTransaksi);
router.post("/date", AuthUser, controllerFilterTransaksi)
router.post("/find", AuthUser, controllerFindTransaksi)

module.exports = router;