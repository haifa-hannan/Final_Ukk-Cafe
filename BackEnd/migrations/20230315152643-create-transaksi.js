'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaksi', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tanggal_transaksi: {
        type: Sequelize.DATE
      },
      id_user: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id"
        }
      },
      id_meja: {
        type: Sequelize.INTEGER,
        references: {
          model: "meja",
          key: "id"
        }
      },
      nama_pelanggan: {
        type: Sequelize.STRING
      },
      status_pembayaran: {
        type: Sequelize.ENUM,
        values: ['sudah bayar', 'belum bayar']
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transaksi');
  }
};