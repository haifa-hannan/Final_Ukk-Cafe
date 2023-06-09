'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user,{
        foreignKey: "id_user",
        as: "user"
      })

      this.belongsTo(models.meja,{
        foreignKey: "id_meja",
        as: "meja"
      })

      this.hasMany(models.detail_transaksi, {
        foreignKey:"id_transaksi",
        as: "detail_transaksi"
      })
    }
  }
  transaksi.init({
    tanggal_transaksi: DataTypes.DATE,
    id_user: DataTypes.INTEGER,
    id_meja: DataTypes.INTEGER,
    nama_pelanggan: DataTypes.STRING,
    status_pembayaran: DataTypes.ENUM('sudah bayar', 'belum bayar')
  }, {
    sequelize,
    modelName: 'transaksi',
    tableName: 'transaksi'
  });
  return transaksi;
};