let express = require('express');
let router = express.Router();
let {
    controllerGetUser,
    controllerGetUserById,
    controllerAddUser,
    controllerUpdateUser,
    controllerDeleteUser,
    controllerLoginUser
} = require('./user.controller');
const { AuthAdmin, AuthUser } = require('./../../middleware/AuthUser');


router.get('/',  AuthUser, AuthAdmin, controllerGetUser)
router.get('/:id', AuthUser, controllerGetUserById)
router.post('/', controllerAddUser)
router.put('/:id', AuthUser,  controllerUpdateUser)
router.delete('/:id', AuthUser,  controllerDeleteUser)
router.post('/login', controllerLoginUser)

module.exports = router