const { DataTypes, Model } = require('sequelize');

class Comment extends Model {
  static init(sequelize) {
    return super.init(
      {
        comment: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Comment',
        tableName: 'comments',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true,
        paranoid: true,
      }
    );
  }

  static associate(db) {
    db.Comment.belongsToMany(db.Post, { through: 'post_comments' });
    db.Comment.belongsTo(db.User);
    db.Comment.belongsToMany(db.Comment, {
      through: 'reply_comments',
      as: 'replies',
      foreignKey: 'replyId',
    });
    db.Comment.belongsToMany(db.Comment, {
      through: 'reply_comments',
      as: 'originalComments',
      foreignKey: 'originalCommentId',
    });
  }
}

module.exports = Comment;
