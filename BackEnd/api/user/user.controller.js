const model = require('./../../models/index')
const users = model.user

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.controllerGetUser = async(req, res)=> {
    await users.findAll({
        attributes: {
            exclude: ["createdAt", "updatedAt"],
        },
        // include: [
        //     {
        //         model: model.role,
        //         as: "role_user",
        //         // attributes: {
        //         //     exclude: ["createdAt", "updatedAt"],
        //         // }
        //         attributes: ["name"]
        //     }
        // ]
    })
    .then(result=> {
        res.json({
            data: result
        })
    })
    .catch(err=> {
        console.log(err)
    })
}

exports.controllerGetUserById = async(req, res)=> {
    await users.findOne({
        where: {
            id: req.params.id
        },
        attributes: {
            exclude: ["createdAt", "updatedAt"],
        },
        // include: [
        //     {
        //         model: model.role,
        //         as: "role_user",
        //         attributes: {
        //             exclude: ["createdAt", "updatedAt"],
        //         }
        //     }
        // ]
    })
    .then(result=> {
        res.json({
            data: result
        })
    })
    .catch(err=> {
        console.log(err)
    })
}

exports.controllerAddUser = async(req, res)=> {
    const {name, role, username, password}= req.body
    const salts = await bcrypt.genSalt()
    const hashs = await bcrypt.hash(password, salts)
    const data = {
        name : name,
        role: role,
        username: username,
        password: hashs
    }
    await users.create(data)
    .then(result=> {
        res.json({
            data: data
        })
    })
    .catch(err=> {
        console.log(err)
    })
}

exports.controllerUpdateUser = async(req, res)=> {
    const {name, role, username, password}= req.body
    const salts = await bcrypt.genSalt()
    const hashs = await bcrypt.hash(password, salts)
    const data = {
        name : name,
        role: role,
        username: username,
        password: hashs
    }
    await users.update(data, {
        where: {
            id: req.params.id
        }
    })
    .then(result=> {
        res.json({
            data: data
        })
    })
    .catch(err=> {
        console.log(err)
    })
}

exports.controllerDeleteUser = async(req, res)=> {
    await users.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(result=> {
        res.json({
            message: "data was deleted successfully"
        })
    })
    .catch(err=> {
        console.log(err)
    })
}

exports.controllerLoginUser= async(req, res)=> {
    try {
        const user = await users.findOne({
            where: {
                username: req.body.username,
                role: req.body.role
            }
        })
        const match = await bcrypt.compare(req.body.password, user.password)
        if(!match) res.json({message: "wrong password"})
        const username = user.username
        const role = user.role
        const password = user.password
        const signs = jwt.sign({username, role, password}, process.env.TOKEN)
        const data_log = await users.findOne({
            where: {
                username: username,
                role: role
            },
            attributes: {
                exclude: ['createdAt, updatedAt']
            }
        })
        res.json({
            data: data_log,
            token: signs
        })
    } catch (error) {
        // res.json({
        //     message: "username not found",
        // })
        res.json({message: error.message})
    }
}