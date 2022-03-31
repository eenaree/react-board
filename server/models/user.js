const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        nickname: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true,
      }
    );
  }

  static associate(db) {}

  async getHashedPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async getPasswordComparedResult(password) {
    return await bcrypt.compare(password, this.password);
  }
}

module.exports = User;
