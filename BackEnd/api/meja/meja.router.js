let express = require('express');
let router = express.Router();
let {
    controllerGetMeja,
    controllerAddMeja,
    controllerDeleteMeja,
    controllerUpdateMeja
} = require('../meja/meja.controller');
const {AuthUser, AuthAdmin} = require('../../middleware/AuthUser');

router.get('/', AuthUser, controllerGetMeja)
router.post('/',AuthUser, controllerAddMeja)
router.delete('/:id', AuthUser, controllerDeleteMeja)
router.put('/:id', AuthUser, controllerUpdateMeja)

module.exports = router;