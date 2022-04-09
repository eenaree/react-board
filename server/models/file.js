const { DataTypes, Model } = require('sequelize');

class File extends Model {
  static init(sequelize) {
    return super.init(
      {
        fileUrl: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        modelName: 'File',
        tableName: 'files',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true,
      }
    );
  }

  static associate(db) {
    db.File.belongsTo(db.Post);
  }
}

module.exports = File;
