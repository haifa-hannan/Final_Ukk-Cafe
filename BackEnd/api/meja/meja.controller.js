const model = require('../../models/index')
const meja = model.meja

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.controllerGetMeja = async(request, response)=> {
    await meja.findAll({
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    })
    .then(result=> {
        response.json({
            data: result
        })
    }).catch(err=> {
        console.log(err)
    })
}

exports.controllerAddMeja = async(req, res)=> {
    const {nomor_meja } = req.body
    const data ={
        nomor_meja : nomor_meja
    }
    await meja.create(data)
    .then(result=> {
        res.json({
            data: data
        })
    }).catch(err=> {
        console.log(err)
    })
}

exports.controllerUpdateMeja= async(req, res)=> {
    const {nomor_meja} = req.body
    const data ={
        nomor_meja 
    }
    await meja.update(data, {
        where: {
            id: req.params.id
        }
    })
    .then(result=> {
        res.json({
            data: data
        })
    }).catch(err=> {
        console.log(err)
    })
}

exports.controllerDeleteMeja = async(req, res)=> {
    await meja.destroy({
        where: {
            id: req.params.id
        }
    })
    // await role.create(data)
    .then(result=> {
        res.json({
            message: "Data was successfully deleted"
        })
    }).catch(err=> {
        console.log(err)
    })
}