const menuModel = require('../../models/index').menu
// const menu = model.menu
const Op = require('sequelize').Op

const upload = require('./upload.image').single(`image`)

const path = require('path')
const fs = require('fs')

// const multer = require('multer')
// const path = require('path')
const { error } = require('console')
const { request } = require('http')

// const storage = multer.diskStorage({
//     destination:(req, file, cb) => {
//         cb(null, './images')
//     },
//     filename: (req, file, cb) => {
//         cb(null, `cover-${Date.now()}${path.extname(file.originalname)}`)    
//     }
// })

// const upload = multer({
//     storage:storage,
//     fileFilter: (req, file, cb) => {
//         const acceptedType = [`image/jpg`, `image/jpeg`,`image/png`]
//         if (!acceptedType.includes(file.mimetype)) {
//             cb(null, false) /** refuse upload */
//             return cb(`Invalid file type (${file.mimetype})`)
//         }
//         const fileSize = req.headers[`content-length`]
//         const maxSize = (1 * 1024 * 1024) /** max: 1MB */
//         if(fileSize > maxSize){
//             cb(null, false) /** refuse upload */
//             return cb(`File size is too large`)
//         }
//         cb(null, true) /** accept upload */
//     }
// })

// app.use(multer({storage: storage, fileFilter: fileFilter}).single('image'));

exports.getAllMenu = async (req, res) => {
    await menuModel.findAll ({
        attributes: {
            exclude: ["createdAt", "updatedAt"],
        },
    })
    .then(result=>{
        res.json({
            data: result
        })
    })
    .catch(err => {
        console.log(err)
    })
}

exports.getMenuByID = async (req, res) => {
    await menuModel.findOne({
        where: {
            id: req.params.id
        },
        attributes: {
            exclude: ["createdAt", "updatedAt"],
        },
        include: [
            {
                model: model.menu,
                as: "id_menus",
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                }
            }
        ]
    })
    .then(result => {
        res.json({
            data: result
        })    
    })
    .catch(err => {
        console.log(err)
    })
}

exports.findMenu = async (req, res) => {
    let keys = req.body.keys

    let menu = await menuModel.findAll({
        where: {
            [Op.or]: [
                {name: {[Op.substring]: keys}},
                {jenis: {[Op.substring]: keys}},
            ]
        }
    })
    .then(result => {
        res.json({
            data: result
        })
    })
    .catch(err => {
        console.log(err)
    })
}

exports.addMenu = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.json({message: error})
        }
        if (!req.file){
            return res.json({message:`nothing to upload`})
        }
        if (req.file) {
            let {name, jenis, deskripsi, harga}= req.body
            let data = {
            name : name,
            jenis: jenis,
            deskripsi: deskripsi,
            image: req.file.filename,
            harga: harga
        }

        await menuModel
        .create(data)
        .then((result) => {
          res.json({
            data: data,
            message: `new menu has been inserted`
          });
        })
        .catch((err) => {
          console.log(err);
        });
      
    }
    })
}

exports.updateMenu = async (req, res) => {
    upload(req, res, async error => {
        if (error) {
            return res.json({message:error})
        }
        let id = req.params.id

        let {name, jenis, deskripsi, harga}= req.body
        let data = {
            name : name,
            jenis: jenis,
            deskripsi: deskripsi,
            image: req.file.filename,
            harga: harga
        }
        if (request.file){
            const sMenu = await menuModel.findOne({
                where: {id: id}
            })
            const oldFile = sMenu.image
            const pathImage = path.join(__dirname, '../images', oldFile)

            if (fs.existsSync(pathImage)){
                fs.unlink(pathImage, error =>
                    console.log(error))
            }
            menuModel.image = request.file.filename
        }
        await menuModel.update(data, {where: {id}})
        .then(result => {
            return res.json({
                success: true,
                message: `Data menu has been updated`
            })
        })
        .catch(error => {
            return res.json({
                // success: false,
                // message: error.message
            })
        })
    
    })
}

exports.deleteMenu = async (req, res) => {
    const id = req.params.id

    const sMenu = await menuModel.findOne({where: {id: id}})

    const oldFile = sMenu.image

    const pathImage = path.join(__dirname, `../images`, oldFile)
    
    if (fs.existsSync(pathImage)){
        fs.unlinkSync(pathImage, error => console.log(error))
    }

    menuModel.destroy({where: {id: id}})
    .then(result => {
        return res.json({
            success: true,
            message: `Data menu has been deleted`
        })
    })
    .catch(error => {
        return res.json({
            success: false,
            message: error.message
        })
    })



}


