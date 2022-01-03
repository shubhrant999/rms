
const question = (sequelize, Sequelize) => {
    const question = sequelize.define('ntl_questions', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        enabler: {
            type: Sequelize.STRING
        },
        scenario: {
            type: Sequelize.STRING
        },
        competency_cat: {
            type: Sequelize.STRING
        },
        question: {
            type: Sequelize.TEXT
        },
        option1: {
            type: Sequelize.TEXT
        },
        option2: {
            type: Sequelize.TEXT
        },
        option3: {
            type: Sequelize.TEXT
        },
        option4: {
            type: Sequelize.TEXT
        },
        opt1wtg: {
            type: Sequelize.INTEGER
        },
        opt2wtg: {
            type: Sequelize.INTEGER
        },
        opt3wtg: {
            type: Sequelize.INTEGER
        },
        opt4wtg: {
            type: Sequelize.INTEGER
        },
        answer: {
            type: Sequelize.ENUM('1', '2','3','4'),
            comment: "1=Option 1, 2=Option 2, 3=Option 3, 4=Option 4"
        },
        language: {
            type: Sequelize.STRING
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
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
    });
    return question;
}

const competency = (sequelize, Sequelize) => {
    const competency = sequelize.define('ntl_competencies', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.TEXT
        },
        quest_count: {
            type: Sequelize.INTEGER
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
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
    });
    return competency;
}

const question_type = (sequelize, Sequelize) => {
    const question_type = sequelize.define('ntl_question_types', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        question_type: {
            type: Sequelize.STRING
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
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
    });
    return question_type;
}

module.exports = { question , question_type, competency }

