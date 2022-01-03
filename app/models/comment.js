module.exports = (sequelize, Sequelize) => {
    const Comments = sequelize.define("ntl_comments", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        comment: {
            type: Sequelize.TEXT
        },
        status: {
            type: Sequelize.BOOLEAN,
            allowNull: false, 
            defaultValue: false
        },
        deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false, defaultValue: false
        },
        createdAt: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        updatedAt: {
            type: 'TIMESTAMP',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        }
    });

    return Comments;
};









