const pemesananModel = require(`../models/index`).pemesanan;
const detailsOfPemesananModel = require(`../models/index`).detail_pemesanan;
const userModel = require(`../models/index`).user;
const roomModel = require(`../models/index`).kamar;
const tipeKamarModel = require(`../models/index`).tipe_kamar;
const moment = require(`moment`);
const randomstring = require("randomstring");
const Op = require(`sequelize`).Op;
const Sequelize = require("sequelize");
const sequelize = new Sequelize("wikuhotel", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

exports.addPemesanan = async (request, response) => {
  let nama_user = request.body.nama_user;
  let userId = await userModel.findOne({
    where: {
      [Op.and]: [{ nama_user: nama_user }],
    },
  });
  if (userId === null) {
    return response.status(400).json({
      success: false,
      message: `User yang anda inputkan tidak ada`,
    });
  } else {
    //tanggal pemesanan sesuai tanggal hari ini + random string
    let date = moment();
    let tgl_pemesanan = date.format("YYYY-MM-DD");

    // Generate a random string (7 characters in this case)
    const random = randomstring.generate(7);

    // Combine timestamp and random string to create nomorPem
    let nomorPem = `${Date.now()}_${random}`;

    let check_in = request.body.tgl_check_in;
    let check_out = request.body.tgl_check_out;
    const date1 = moment(check_in);
    const date2 = moment(check_out);

    if (date2.isBefore(date1)) {
      return response.status(400).json({
        success: false,
        message: "masukkan tanggal yang benar",
      });
    }
    let tipe_kamar = request.body.tipe_kamar;

    let tipeRoomCheck = await tipeKamarModel.findOne({
      where: {
        [Op.and]: [{ nama_tipe_kamar: tipe_kamar }],
      },
      attributes: [
        "id",
        "nama_tipe_kamar",
        "harga",
        "deskripsi",
        "foto",
        "createdAt",
        "updatedAt",
      ],
    });
    // console.log(tipeRoomCheck);
    if (tipeRoomCheck === null) {
      return response.status(400).json({
        success: false,
        message: `Tidak ada tipe kamar dengan nama itu`,
      });
    }
    //mendapatkan kamar yang available di antara tanggal check in dan check out sesuai dengan tipe yang diinput user
    const result = await sequelize.query(
      `SELECT tipe_kamars.nama_tipe_kamar, kamars.nomor_kamar FROM kamars LEFT JOIN tipe_kamars ON kamars.tipeKamarId = tipe_kamars.id LEFT JOIN detail_pemesanans ON detail_pemesanans.kamarId = kamars.id WHERE kamars.id NOT IN (SELECT kamarId from detail_pemesanans WHERE tgl_akses BETWEEN '${check_in}' AND '${check_out}') AND tipe_kamars.nama_tipe_kamar ='${tipe_kamar}' GROUP BY kamars.nomor_kamar`
    );
    //cek apakah ada
    if (result[0].length === 0) {
      return response.status(400).json({
        success: false,
        message: `Kamar sejumlah yang anda minta dengan tipe itu dan di tanggal itu sudah terbooking`,
      });
    }

    //masukkan nomor kamar ke dalam array
    const array = [];
    for (let index = 0; index < result[0].length; index++) {
      array.push(result[0][index].nomor_kamar);
    }

    //validasi agar input jumlah kamar tidak lebih dari kamar yang tersedia
    if (result[0].length < request.body.jumlah_kamar) {
      return response.status(400).json({
        success: false,
        message: `hanya ada ${result[0].length} kamar tersedia`,
      });
    }

    //mencari random index dengan jumlah sesuai input jumlah kamar
    let randomIndex = [];
    for (let index = 0; index < request.body.jumlah_kamar; index++) {
      randomIndex.push(Math.floor(Math.random() * array.length));
    }

    //isi data random elemnt dengan isi dari array dengan index random dari random index
    let randomElement = [];
    for (let index = 0; index < randomIndex.length; index++) {
      randomElement.push(Number(array[index]));
    }

    // console.log("random index", randomIndex);
    // console.log("random", randomElement);

    //isi roomId dengan data kamar hasil randoman
    let roomId = [];
    for (let index = 0; index < randomElement.length; index++) {
      roomId.push(
        await roomModel.findOne({
          where: {
            [Op.and]: [{ nomor_kamar: randomElement[index] }],
          },
          attributes: [
            "id",
            "nomor_kamar",
            "tipeKamarId",
            "createdAt",
            "updatedAt",
          ],
        })
      );
    }

    // console.log("roomid", roomId);

    //dapatkan harga dari id_tipe_kamar dikali dengan inputan jumlah kamar
    let roomPrice = 0;
    let cariTipe = await tipeKamarModel.findOne({
      where: {
        [Op.and]: [{ id: roomId[0].tipeKamarId }],
      },
      attributes: [
        "id",
        "nama_tipe_kamar",
        "harga",
        "deskripsi",
        "foto",
        "createdAt",
        "updatedAt",
      ],
    });
    roomPrice = cariTipe.harga * request.body.jumlah_kamar;

    let newData = {
      nomor_pemesanan: nomorPem,
      nama_pemesan: request.body.nama_pemesan,
      email_pemesan: request.body.email_pemesan,
      tgl_pemesanan: tgl_pemesanan,
      tgl_check_in: check_in,
      tgl_check_out: check_out,
      nama_tamu: request.body.nama_tamu,
      jumlah_kamar: request.body.jumlah_kamar,
      tipeKamarId: cariTipe.id,
      status_pemesanan: "baru",
      userId: userId.id,
    };

    //menetukan harga dengan cara mengali selisih tanggal check in dan check out dengan harga tipe kamar
    const startDate = moment(newData.tgl_check_in);
    const endDate = moment(newData.tgl_check_out);
    const duration = moment.duration(endDate.diff(startDate));
    const nights = duration.asDays();
    const harga = nights * roomPrice;

    //cek jika ada inputan kosong
    for (const [key, value] of Object.entries(newData)) {
      if (!value || value === "") {
        console.log(`Error: ${key} is empty`);
        return response
          .status(400)
          .json({ error: `${key} kosong mohon di isi` });
      }
    }

    pemesananModel.create(newData).then((result) => {
      let pemesananID = result.id;
      let tgl1 = new Date(result.tgl_check_in);
      let tgl2 = new Date(result.tgl_check_out);
      let checkIn = moment(tgl1).format("YYYY-MM-DD");
      let checkOut = moment(tgl2).format("YYYY-MM-DD");

      let newDetails = [];

      // Loop through the dates between check-in and check-out
      for (
        let m = moment(checkIn, "YYYY-MM-DD");
        m.isBefore(checkOut);
        m.add(1, "days")
      ) {
        let date = m.format("YYYY-MM-DD");

        // Loop through roomId array and create new detail for each roomId
        for (let index = 0; index < roomId.length; index++) {
          newDetails.push({
            pemesananId: pemesananID,
            kamarId: roomId[index].id,
            tgl_akses: date,
            harga: harga,
          });
        }
      }

      // Create new details in a single bulk create operation
      detailsOfPemesananModel.bulkCreate(newDetails).then(async (resultss) => {
        let getData = await sequelize.query(
          `SELECT  pemesanans.id, pemesanans.nomor_pemesanan, pemesanans.nama_pemesan,pemesanans.email_pemesan,pemesanans.tgl_pemesanan,pemesanans.tgl_check_in,pemesanans.tgl_check_out,detail_pemesanans.harga,pemesanans.nama_tamu,pemesanans.jumlah_kamar,pemesanans.status_pemesanan, users.nama_user, tipe_kamars.nama_tipe_kamar,tipe_kamars.harga as harga_tipe_kamar, kamars.nomor_kamar FROM pemesanans JOIN tipe_kamars ON tipe_kamars.id = pemesanans.tipeKamarId JOIN users ON users.id=pemesanans.userId JOIN detail_pemesanans ON detail_pemesanans.pemesananId=pemesanans.id JOIN kamars ON kamars.id=detail_pemesanans.kamarId WHERE pemesanans.id=${pemesananID} GROUP BY kamars.id`
        );

        // Send the response after all the processing is complete
        return response.json({
          success: true,
          message: `New transactions have been inserted`,
          data: getData[0],
        });
      });
    });
  }
};

//delete data
// exports.deletePemesanan = async (request, response) => {
//   let pemesananID = request.params.id;
//   let getId = await pemesananModel.findAll({
//     where: {
//       [Op.and]: [{ id: pemesananID }],
//     },
//   });
//   if (getId.length === 0) {
//     return response.json({
//       success: false,
//       message: "Transaksi dengan id tersebut tidak ada",
//     });
//   }

//   detailsOfPemesananModel
//     .destroy({
//       where: { pemesananId: pemesananID },
//     })
//     .then((result) => {
//       pemesananModel
//         .destroy({ where: { id: pemesananID } })
//         .then((result) => {
//           return response.json({
//             success: true,
//             message: `Transaction has been deleted`,
//           });
//         })
//         .catch((error) => {
//           return response.json({
//             success: false,
//             message: error.message,
//           });
//         });
//     })
//     .catch((error) => {
//       return response.json({
//         success: false,
//         message: error.message,
//       });
//     });
// };

exports.getByUser = async (request, response) => {
  let userId = request.params.id;

  const result = await pemesananModel.findAll({
    where: {
      userId: userId,
    },
    include: {
      model: tipeKamarModel,
      attributes: ["nama_tipe_kamar"],
    },
    order: [["createdAt", "DESC"]],
  });
  if (result.length === 0) {
    return response.json({
      success: true,
      data: [],
      message: "Data tidak ditemukan",
    });
  }

  response.json({
    success: true,
    data: result,
    message: `All Transaction have been loaded...`,
  });
};

exports.getById = async (request, response) => {
  let pesanId = request.params.id;

  let result = await sequelize.query(
    `SELECT pemesanan.id, pemesanan.nomor_pemesanan, pemesanan.nama_pemesan, pemesanan.email_pemesan, pemesanan.tgl_pemesanan, pemesanan.tgl_check_in, pemesanan.tgl_check_out, pemesanan.nama_tamu, pemesanan.jumlah_kamar, pemesanan.tipeKamarId, tipe_kamar.nama_tipe_kamar, tipe_kamar.harga, detail_pemesanan.kamarId, kamar.nomor_kamar, user.id AS userId, user.nama_user FROM pemesanans AS pemesanan LEFT OUTER JOIN tipe_kamars AS tipe_kamar ON pemesanan.tipeKamarId = tipe_kamar.id LEFT OUTER JOIN users AS user ON pemesanan.userId = user.id LEFT OUTER JOIN detail_pemesanans AS detail_pemesanan ON pemesanan.id = detail_pemesanan.pemesananId JOIN kamars AS kamar ON kamar.id = detail_pemesanan.kamarId WHERE pemesanan.id = ${pesanId} ORDER BY pemesanan.createdAt DESC;`
  );

  if (result.length === 0) {
    return response.json({
      success: true,
      data: [],
      message: "Data tidak ditemukan",
    });
  }

  let responseData;
  responseData = {
    pemesanan: result[0][0], // Memilih elemen pertama dari array
    nomor_kamar: result[0].map(item => item.nomor_kamar)
  };

  response.json({
    success: true,
    data: responseData,
    message: "Transaction data loaded successfully...",
  });
};

exports.getAllPemesanan = async (request, response) => {
  const result = await pemesananModel.findAll({
    include: [
      {
        model: tipeKamarModel,
        attributes: ["nama_tipe_kamar","harga"],
      },
      {
        model: userModel,
        attributes: ["nama_user"]
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  if (result.length === 0) {
    return response.json({
      success: true,
      data: [],
      message: "Data tidak ditemukan",
    });
  }

  response.json({
    success: true,
    data: result,
    message: `All Transaction have been loaded...`,
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

exports.updateStatusBooking = async (request, response) => {
  let newData = {
    status_pemesanan: request.body.status_pemesanan,
  };

  let pemesananID = request.params.id;
  let getId = await pemesananModel.findAll({
    where: {
      [Op.and]: [{ id: pemesananID }],
    },
  });

  if (getId.length === 0) {
    return response.json({
      success: false,
      message: "Transaksi dengan id tersebut tidak ada",
    });
  }

  // Periksa apakah tgl_check_out melewati tanggal hari ini
  if (moment(getId[0].tgl_check_out).isBefore(moment(), "day")) {
    newData.status_pemesanan = "check_out";
  }

  pemesananModel
    .update(newData, { where: { id: pemesananID } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Status pemesanan berhasil diperbarui`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

exports.findDatatgl = async (request, response) => {
  const { tgl_check_in } = request.query;

  const parsedDate = new Date(tgl_check_in);
  try {
    const pemesanans = await pemesananModel.findAll({
      where: {
        tgl_check_in: parsedDate,
      },
      include: [
        {
          model: userModel,
          attributes: ["nama_user"],
        },
        {
          model: tipeModel,
          attributes: ["nama_tipe_kamar"],
        },
      ],
    });

    if (pemesanans.length === 0) {
      return response.status(404).json({
        success: false,
        message: `No bookings found for the specified date.`,
      });
    }

    return response.status(200).json({
      success: true,
      data: pemesanans,
      message: `Bookings for the specified date have been loaded`,
    });
  } catch (error) {
    response.status(500).json({ error: "Internal server error" });
  }
};
