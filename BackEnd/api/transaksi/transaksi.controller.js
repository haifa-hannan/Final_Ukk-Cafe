const transaksiModel = require('../../models/index').transaksi
const moment = require('moment')
// const { default: AsyncQueue } = require('sequelize/types/dialects/mssql/async-queue')
const detailModel = require('../../models/index').detail_transaksi
const userModel = require('../../models/index').user
const mejaModel = require('../../models/index').meja
const menuModel = require('../../models/index').menu


const Op = require('sequelize').Op

exports.controllerGetTransaksi = async (req, res) => {
    let data = await transaksiModel.findAll({
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        },
        include: [
            {
                model: userModel,
                as: "user",
                attributes:{
                    exclude: ["createdAt", "updatedAt"]
                }
            },
            {
                model: mejaModel,
                as: "meja",
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            }
        ]
    })
    .then(result => {
        res.json({
            data: result,
            message: 'All transactions has been loaded'
        })
    })
    .catch(error => {
        return res.json({
            success: false,
            message: error.message
        })
    })
}



exports.controllerAddTransaksi = async (req, res) => {
    let data = {
        tanggal_transaksi: moment().format('YYYY-MM-DD'),
        id_user: req.body.id_user,
        id_meja: req.body.id_meja,
        nama_pelanggan: req.body.nama_pelanggan,
        status_pembayaran: req.body.status_pembayaran
    }
    await transaksiModel.create(data)
    .then(result => {
        let transaksiID = result.id
        let detail =req.body.detail_transaksi
        //let id_transaksi = result.req.body.id_transaksi
        // let detail = result.req.body.detail_transaksi

        for (let i = 0; i < detail.length; i++) {
            detail[i].id_transaksi = transaksiID
        }
        detailModel.bulkCreate(detail)
        .then(result => {
            return res.json({
                success: true,
                message:'new transaksi has been inserted successfully'
            })
        })
        .catch(error => {
            return res.json({
                success: false,
                message: error.message
            })
        })
    })
    .catch(error => {
        return res.json({
            success: false,
            message: error.message
        })
    })
}
exports.controllerUpdateTransaksi = async (req,res) => {
    let data = {
        tanggal_transaksi: moment().format('YYYY-MM-DD'),
        id_user: req.body.id_user,
        id_meja: req.body.id_meja,
        nama_pelanggan: req.body.nama_pelanggan,
        status_pembayaran: req.body.status_pembayaran
    }
    let transaksiID = req.params.id

    transaksiModel.update(data,{where: {id: transaksiID}})
    .then(async result => {
        await detailModel.destroy({where: {id_transaksi: transaksiID}})
        let detail = req.body.detail_transaksi

        for (let i = 0; i <detail.length; i++) {
            detail[i].id_transaksi = transaksiID
        }

        detailModel.bulkCreate(detail)
        .then(result => {
            return res.json({
                success: true,
                message: 'Transaksi has been updated'
            })
        })
        .catch(error => {
            return res.json({
                success: false,
                message: error.message
            })
        })
    })
    .catch(error => {
        return res.json({
            success: false,
            message: error.message
        })
    })
}
exports. controllerDeleteTransaksi = async (req, res) => {
    let transaksiID = req.params.id

    detailModel.destroy({where: {id: transaksiID}}
        
        )
        .then(result => {
            transaksiModel.destroy({where: {id: transaksiID}})
            .then(result=> {
                return res.json({
                    success: true,
                    message: 'Transaksi deleted successfully'
                })
            })
            .catch(error => {
                return res.json({
                    success: false,
                    message: error.message
                })
            })
        })
}

exports.controllerFilterTransaksi= async (req, res) => {
    let start = req.body.start
    let end = req.body.end

    let data = await transaksiModel.findAll({
        include: [
            "user", "meja",
            {
                model: detailModel,
                as: "detail_transaksi",
                include: [ "menu"],
            },
        ],
        where: {
            tanggal_transaksi: {
                [Op.between]:[start, end],
            }
        }
    })
    return res.json(data)
}


exports.controllerFindTransaksi = async (req, res) => {
    let keyword = req.body.keyword
    let sequelize = require('sequelize')
    let Op = sequelize.Op

    let data = await transaksiModel.findAll({
        include: [
            "user", "meja",
            {
                model: detailModel,
                as: "detail_transaksi",
                include: ["menu"],
            }
        ],
        where: {
            [Op.or] : {
                id_user: {[Op.like] : `%${keyword}%`},
                nama_pelanggan: {[Op.like] : `%${keyword}%`},
                status_pembayaran: {[Op.like] : `%${keyword}%`} 
            }
        }
    })
    return res.json(data)
}

