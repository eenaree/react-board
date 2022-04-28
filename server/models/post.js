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
    db.Post.belongsToMany(db.User, {
      through: 'post_recommendation',
      as: 'recommenders',
    });
    db.Post.hasMany(db.Comment);
    // db.Post.belongsToMany(db.Comment, { through: 'post_comments' });
    db.Post.hasMany(db.File);
  }
}

module.exports = Post;
