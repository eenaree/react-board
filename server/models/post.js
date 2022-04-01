const { DataTypes, Model } = require('sequelize');

class Post extends Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        contents: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        fileUrl: {
          type: DataTypes.STRING,
        },
        views: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: 'Post',
        tableName: 'posts',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true,
        paranoid: true,
      }
    );
  }

  static associate(db) {
    db.Post.belongsTo(db.User);
  }
}

module.exports = Post;
