const { request, response } = require("express");
const express = require("express");
const app = express();

const tipeModel = require(`../models/index`).tipe_kamar;
const Op = require(`sequelize`).Op;

const path = require(`path`);
const fs = require(`fs`);

const upload = require(`./uploadTipekamar`).single(`foto`);

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//mendaptkan semua data dalam tabel
exports.getAllType = async (request, response) => {
  try {
    let tipe = await tipeModel.findAll({
      order: [['createdAt', 'DESC']], // Ganti 'createdAt' dengan field yang sesuai
    });

    return response.json({
      success: true,
      data: tipe,
      message: `All room have been loaded in descending order`,
    });
  } catch (error) {
    console.error('Error fetching data: ', error);
    return response.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};


//mendaptkan salah satu data dalam tabel (where clause)
exports.findType = async (request, response) => {
  let keyword = request.body.keyword;

  let tipe = await tipeModel.findOne({
    where: {
      [Op.and]: [{ nama_tipe_kamar: { [Op.substring]: keyword } }],
    },
  });
  return response.json({
    success: true,
    data: tipe,
    message: `All Room have been loaded`,
  });
};

//menambah data
exports.addType = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }

    if (!request.file) {
      return response.json({ message: `Nothing to upload` });
    }

    let newType = {
      nama_tipe_kamar: request.body.nama_tipe_kamar,
      harga: request.body.harga,
      deskripsi: request.body.deskripsi,
      foto: request.file.filename,
    };

    console.log(newType);

    let tipe = await tipeModel.findAll({
      where: {
        [Op.and]: [
          { nama_tipe_kamar: newType.nama_tipe_kamar },
        ],
      },
      attributes: ["id", "nama_tipe_kamar", "harga", "deskripsi", "foto"],
    });
    if (tipe.length > 0) {
      return response.json({
        success: false,
        message: `Tipe kamar yang anda inputkan sudah ada`,
      });
    }
    tipeModel
      .create(newType)
      .then((result) => {
        return response.json({
          success: true,
          data: result,
          message: `New Type Room has been inserted`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

//mengupdate salah satu data
exports.updateType = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }

    let idType = request.params.id;

    let dataType = {
      nama_tipe_kamar: request.body.nama_tipe_kamar,
      harga: request.body.harga,
      deskripsi: request.body.deskripsi,
    };
    if (request.file && request.file.filename) {
      dataType.foto = request.file.filename;
    }

    if (request.file) {
      const selectedUser = await tipeModel.findOne({
        where: { id: idType },
      });

      const oldFotoUser = selectedUser.foto;

      const patchFoto = path.join(__dirname, `../foto_tipe_kamar`, oldFotoUser);

      if (fs.existsSync(patchFoto)) {
        fs.unlink(patchFoto, (error) => console.log(error));
      }
      dataType.foto = request.file.filename;
    }

    tipeModel
      .update(dataType, { where: { id: idType } })
      .then((result) => {
        return response.json({
          success: true,
          message: `Data room type has been update`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

//mengahapus salah satu data
exports.deleteType = (request, response) => {
  let idType = request.params.id;

  tipeModel
    .destroy({ where: { id: idType } })
    .then((result) => {
      return response.json({
        success: true,
        message: `data room type has ben delete`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};