const pemesananModel = require(`../models/index`).pemesanan;
const detailsOfPemesananModel = require(`../models/index`).detail_pemesanan;
const userModel = require(`../models/index`).user;
const roomModel = require(`../models/index`).kamar;

const Op = require(`sequelize`).Op;
// const date = require(`date-and-time`);
const Sequelize = require("sequelize");
const sequelize = new Sequelize("wikuhotel", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

//tambah data
exports.addPemesanan = async (request, response) => {
  let nomor_kamar = request.body.nomor_kamar;
  let room = await roomModel.findOne({
    where: {
      [Op.and]: [{ nomor_kamar: { [Op.substring]: nomor_kamar } }],
    },
    attributes: ["id", "nomor_kamar", "tipeKamarId", "createdAt", "updatedAt"],
  });

  let nama_user = request.body.nama_user;
  let userId = await userModel.findOne({
    where: {
      [Op.and]: [{ nama_user: { [Op.substring]: nama_user } }],
    },
  });

  if (room === null) {
    return response.json({
      success: false,
      message: `Kamar yang anda inputkan tidak ada`,
    });
  } else if (userId === null) {
    return response.json({
      success: false,
      message: `User yang anda inputkan tidak ada`,
    });
  } else {
    let newData = {
      nomor_pemesanan: request.body.nomor_pemesanan,
      nama_pemesan: request.body.nama_pemesan,
      email_pemesan: request.body.email_pemesan,
      tgl_pemesanan: Date.now(),
      tgl_check_in: request.body.check_in,
      tgl_check_out: request.body.check_out,
      nama_tamu: request.body.nama_tamu,
      jumlah_kamar: 1, // Hanya satu jumlah kamar yang diizinkan
      tipeKamarId: room.tipeKamarId,
      status_pemesanan: request.body.status,
      userId: userId.id,
    };
    console.log(newData);
    let roomCheck = await sequelize.query(
      `SELECT * FROM detail_pemesanans WHERE kamarId = ${room.id} AND tgl_akses >= "${request.body.check_in}" AND tgl_akses <= "${request.body.check_out}" ;`
    );

    if (roomCheck[0].length === 0) {
      const tglCheckIn = new Date(request.body.check_in);
      const tglCheckOut = new Date(request.body.check_out);
      const diffTime = Math.abs(tglCheckOut - tglCheckIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      pemesananModel
        .create(newData)
        .then((result) => {
          let pemesananID = result.id;
          let detailsOfPemesanan = request.body.details_of_pemesanan;
          let detailData = [];

          for (let i = 0; i < diffDays; i++) {
            let newDetail = {
              pemesananId: pemesananID,
              kamarId: room.id,
              tgl_akses: new Date(
                tglCheckIn.getTime() + i * 24 * 60 * 60 * 1000
              ),
              harga: detailsOfPemesanan[0].harga,
            };
            detailData.push(newDetail);
          }

          detailsOfPemesananModel
            .bulkCreate(detailData)
            .then((result) => {
              return response.json({
                success: true,
                message: `New transaction has been inserted`,
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
    } else {
      return response.json({
        success: false,
        message: `Kamar yang anda pesan sudah di booking`,
      });
    }
  }
};

//update data
exports.updatePemesanan = async (request, response) => {
  let nomor_kamar = request.body.nomor_kamar;
  let room = await roomModel.findOne({
    where: {
      [Op.and]: [{ nomor_kamar: { [Op.substring]: nomor_kamar } }],
    },
    attributes: ["id", "nomor_kamar", "tipeKamarId", "createdAt", "updatedAt"],
  });

  let nama_user = request.body.nama_user;
  let userId = await userModel.findOne({
    where: {
      [Op.and]: [{ nama_user: { [Op.substring]: nama_user } }],
    },
  });

  let newData = {
    nomor_pemesanan: request.body.nomor_pemesanan,
    nama_pemesan: request.body.nama_pemesan,
    email_pemesan: request.body.email_pemesan,
    tgl_pemesanan: request.body.tgl_pemesanan,
    tgl_check_in: request.body.check_in,
    tgl_check_out: request.body.check_out,
    nama_tamu: request.body.nama_tamu,
    jumlah_kamar: 1, // Hanya satu jumlah kamar yang diizinkan
    tipeKamarId: room.tipeKamarId,
    status_pemesanan: request.body.status,
    userId: userId.id,
  };

  let pemesananID = request.params.id;

  try {
    const existingPemesanan = await pemesananModel.findByPk(pemesananID);

    if (!existingPemesanan) {
      return response.json({
        success: false,
        message: `Pemesanan dengan ID ${pemesananID} tidak ditemukan`,
      });
    }

    let roomCheck = await sequelize.query(
      `SELECT * FROM detail_pemesanans WHERE kamarId = ${room.id} AND tgl_akses >= "${request.body.check_in}" AND tgl_akses <= "${request.body.check_out}" ;`
    );

    if (roomCheck[0].length === 0) {
      const tglCheckIn = new Date(request.body.check_in);
      const tglCheckOut = new Date(request.body.check_out);
      const diffTime = Math.abs(tglCheckOut - tglCheckIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      await existingPemesanan.update(newData);

      await detailsOfPemesananModel.destroy({
        where: { pemesananId: pemesananID },
      });

      let detailsOfPemesanan = [];

      for (let i = 0; i < diffDays; i++) {
        let newDetail = {
          pemesananId: pemesananID,
          kamarId: room.id,
          tgl_akses: new Date(tglCheckIn.getTime() + i * 24 * 60 * 60 * 1000),
          harga: request.body.harga, // Ubah ini dengan logika perhitungan harga yang sesuai
        };
        detailsOfPemesanan.push(newDetail);
      }

      await detailsOfPemesananModel.bulkCreate(detailsOfPemesanan);

      return response.json({
        success: true,
        message: `Pemesanan dengan ID ${pemesananID} berhasil diperbarui`,
      });
    } else {
      return response.json({
        success: false,
        message: `Kamar yang anda pesanan sudah di booking`,
      });
    }
  } catch (error) {
    return response.json({
      success: false,
      message: error.message,
    });
  }
};

//delete data
exports.deletePemesanan = async (request, response) => {
  let pemesananID = request.params.id;

  detailsOfPemesananModel
    .destroy({
      where: { id: pemesananID },
    })
    .then((result) => {
      pemesananModel
        .destroy({ where: { id: pemesananID } })
        .then((result) => {
          return response.json({
            success: true,
            message: `Transaction has been deleted`,
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
};

//mendapatkan semua data
exports.getAllPemesanan = async (request, response) => {
  const result = await pemesananModel.findAll();

  response.json({
    success: true,
    data: result[0],
    message: `All Transaction have been loaded`,
  });
};

//mendapatkan salah satu data
exports.find = async (request, response) => {
  let status = request.body.status;

  const result = await pemesananModel.findAll({
    where: {
      [Op.and]: [{ status_pemesanan: status }],
    },
  });

  return response.json({
    success: true,
    data: result,
    message: `Transaction have been loaded`,
  });
};
