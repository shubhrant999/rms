module.exports = (sequelize, Sequelize) => {
    const Applicant = sequelize.define("ntl_applicant", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        aadhaar: {
            type: Sequelize.STRING
        },
        gender: {
            type: Sequelize.STRING
        },
        dob: {
            type: Sequelize.DATEONLY
        },
        address: {
            type: Sequelize.TEXT
        },
        city: {
            type: Sequelize.STRING
        },
        state: {
            type: Sequelize.STRING
        },
        country: {
            type: Sequelize.STRING
        },
        preferred_location: {
            type: Sequelize.STRING
        },
        qualification: {
            type: Sequelize.STRING
        },
        total_experience: {
            type: Sequelize.INTEGER
        },
        relavent_experience: {
            type: Sequelize.INTEGER
        },
        resume: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.BOOLEAN
        },
        deleted: {
            type: Sequelize.BOOLEAN
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
    return Applicant;
};
