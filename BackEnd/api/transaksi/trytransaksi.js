const app = require("../routes/transaksi.route")
const moment = require("moment")
/** load model for `transaksi` table */
const transaksiModel = require(`../models/index`).transaksi
/** load model for `details_transaksi` table */
const detailTransaksiModel = require(`../models/index`).detail_transaksi
const menuModel = require(`../models/index`).menu
const mejaModel = require(`../models/index`).meja

/** load Operator from Sequelize */
const Op = require(`sequelize`).Op

//get all data
exports.addTransaksi = async (request, response) => {

    try {
        const { id_meja, nama_pelanggan, detail_transaksi, id_user, tgl_transaksi } = request.body;
        const status = "belum_bayar";


        const checkMeja = await mejaModel.findOne({
            where: { id_meja: id_meja, status: "tersedia" },
        });

        if (!checkMeja) {
            return response.status(404).json({
                success: false,
                message: "Meja is not available",
            });
        } else {
            const updateStatusMeja = await mejaModel.update(
                { status: "tidak_tersedia" },
                {
                    where: { id_meja: id_meja },
                }
            );
        }
        const totalPrice = await Promise.all(
            detail_transaksi.map(async (detail) => {
                const menu = await menuModel.findOne({
                    where: { id_menu: detail.id_menu },
                });
                return menu.harga * detail.qty;
            })
        ).then((prices) => prices.reduce((sum, price) => sum + price, 0));

        const transaksi = await transaksiModel.create(
            {
                id_user,
                id_meja,
                nama_pelanggan,
                tgl_transaksi: moment().format("YYYY-MM-DD"),
                status,
                total: totalPrice,
                detail_transaksi: detail_transaksi.map((detail) => ({ ...detail })),
            },
            {
                include: {
                    model: detailTransaksiModel,
                    as: "detail_transaksi",
                },
            }
        );

        response.status(201).json({
            success: true,
            data: transaksi,
            message: "Transaksi has been added",
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

/** create function for update transaksi */
exports.updateTransaksi = async (request, response) => {
    /** prepare data for transaksi's table */
    let newData = {
        tgl_transaksi: moment().format("YYYY-MM-DD"),
        id_user: request.body.id_user,
        id_meja: request.body.id_meja,
        nama_pelanggan: request.body.nama_pelanggan,
        status: request.body.status
    }
    /** prepare parameter transaksi ID */
    let idTransaksi = request.params.id_transaksi
    /** execute for inserting to transaksi's table */
    transaksiModel.update(newData, { where: { id_transaksi: idTransaksi } })
        .then(async result => {
            /** delete all detailTransaksi based on idTransaksi */
            await detailTransaksiModel.destroy(
                { where: { id_transaksi: idTransaksi } }
            )
            /** store details of transaksi from request
            * (type: array object)
            * 
            */
            let detailTransaksi = request.body.detail_transaksi
            /** insert idTransaksi to each item of detailTransaksi
            */
            for (let i = 0; i < detailTransaksi.length; i++) {
                detailTransaksi[i].id_transaksi = idTransaksi
            }
            /** re-insert all data of detailTransaksi */
            detailTransaksiModel.bulkCreate(detailTransaksi)
                .then(result => {
                    return response.json({
                        success: true,
                        message: `Transaction has been
    updated`
                    })
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message
                    })
                })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** create function for delete transaksi's data */
exports.deleteTransaksi = async (request, response) => {
    /** prepare idTransaksi that as paramter to delete */
    let idTransaksi = request.params.id
    /** delete detailTransaksi using model */
    detailTransaksiModel.destroy(
        { where: { id_transaksi: idTransaksi } }
    )
        .then(result => {
            /** delete transaksis data using model */
            transaksiModel.destroy({ where: { id_transaksi: idTransaksi } })
                .then(result => {
                    return response.json({
                        success: true,
                        message: `Transaksi's has deleted`
                    })
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message
                    })
                })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** create function for get all transaksi data */
exports.getTransaksi = async (request, response) => {
    let data = await transaksiModel.findAll(
        {
            include: [
                `user`, `meja`,
                {
                    model: detailTransaksiModel,
                    as: `detail_transaksi`,
                    include: ["menu"]
                }
            ]
        }
    )
    return response.json({
        success: true,
        data: data,
        message: `All transaction book have been loaded`
    })
}

// create function for filter
exports.filterTransaksi = async (request, response) => {
    let start = request.body.start;
    let end = request.body.end;

    let data = await transaksiModel.findAll({
        include: [
            "user",
            "meja",
            {
                model: detailTransaksiModel,
                as: "detail_transaksi",
                include: ["menu"],
            },
        ],
        where: {
            tgl_transaksi: {
                [Op.between]: [start, end],
            },
        },
    })
    .then((result) => { // jika berhasil
        if (result.length === 0) { // jika data tidak ditemukan
          response.status(404).json({ // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
            status: "error",
            message: "data tidak ditemukan",
          });
        } else { // jika data ditemukan
          response.status(200).json({ // mengembalikan response dengan status code 200 dan pesan data ditemukan
            status: "success",
            message: "data ditemukan",
            data: result,
          });
        }
      })
      .catch((error) => { // jika gagal
        response.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
          status: "error",
          message: error.message,
        });
      });
}

//kasir
exports.findTransaksi = async (request, response) => {
    let keyword = request.body.keyword
    let sequelize = require(`sequelize`);
    let Op = sequelize.Op

    let data = await transaksiModel.findAll({
        include: [
            "user",
            "meja",
            {
                model: detailTransaksiModel,
                as: "detail_transaksi",
                include: ["menu"],
            },
        ],
        where: {
            [Op.or]: {
                // tgl_transaksi: { [Op.like] : `%${keyword}%` }
                id_user: { [Op.like]: `%${keyword}%` },
                nama_pelanggan: { [Op.like]: `%${keyword}%` },
                status: { [Op.like]: `%${keyword}%` }
            }
        }
    })
    .then((result) => { // jika berhasil
        if (result.length === 0) { // jika data tidak ditemukan
          response.status(404).json({ // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
            status: "error",
            message: "data tidak ditemukan",
          });
        } else { // jika data ditemukan
          response.status(200).json({ // mengembalikan response dengan status code 200 dan pesan data ditemukan
            status: "success",
            message: "data ditemukan",
            data: result,
          });
        }
      })
      .catch((error) => { // jika gagal
        response.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
          status: "error",
          message: error.message,
        });
      });
}

exports.createPayment = async (request, response) => {
    let idTransaksi = request.params.id_transaksi;

    transaksiModel
        .findOne({ where: { id_transaksi: idTransaksi } })
        .then(async (transaksi) => {
            if (!transaksi) {
                return response.json({
                    success: false,
                    message: "Transaction not found",
                });
            }

            let idMeja = transaksi.id_meja
            mejaModel
                .update({ status: "tersedia" }, { where: { id_meja: idMeja } })
                .then(async (result) => {
                    transaksiModel
                        .update({ status: "lunas" }, { where: { id_transaksi: idTransaksi } })
                        .then((result) => {
                            return response.json({
                                success: true,
                                message: "Payment success and table/transaction status updated",
                            });
                        })
                        .catch((error) => {
                            return response.json({
                                success: false,
                                message: error.message,
                            });
                        });
                })
                .catch((error) => {
                    return response.json({
                        success: false,
                        message: error.message,
                    });
                });
        })
        .catch((error) => {
            return response.json({
                success: false,
                message: error.message,
            });
        });
}