
const exam_detail = (sequelize, Sequelize) => {
    const exam_detail = sequelize.define('ntl_exam_detail', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        candidate_id: {
            type: Sequelize.INTEGER
        },
        appl_id: {
            type: Sequelize.INTEGER
        },
        exam_url: {
            type: Sequelize.TEXT
        },
        token: {
            type: Sequelize.STRING
        },
        start_time: {
            type: Sequelize.DATE
        },
        quest_start_time: {
            type: Sequelize.DATE
        },
        quest_end_time: {
            type: Sequelize.DATE
        },
        tracker_time: {
            type: Sequelize.DATE
        },
        ip_address: {
            type: Sequelize.STRING
        },
        questions_val: {
            type: Sequelize.TEXT
        },
        current_ques_id: {
            type: Sequelize.INTEGER
        },
        current_type_id: {
            type: Sequelize.INTEGER
        },
        passing_percentage: {
            type: Sequelize.INTEGER
        },
        total_score: {
            type: Sequelize.FLOAT(10, 2)
        },	
        competncy_wise_Score: {
            type: Sequelize.JSON  
        },
        regenerate_status: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        link_status: {
            type: Sequelize.ENUM('0', '1'),
            comment: "0=link disabled,1=link valid"
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
    return exam_detail;
}

const exam_log = (sequelize, Sequelize) => {
    const exam_log = sequelize.define('ntl_exam_log', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        erroe_message: {
            type: Sequelize.TEXT
        },
        token: {
            type: Sequelize.STRING
        },
        ip_address: {
            type: Sequelize.STRING
        },       
        cookie: {
            type: Sequelize.STRING
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
    return exam_log;
}

const exam_answer_sheet = (sequelize, Sequelize) => {
    const exam_answer_sheet = sequelize.define('ntl_exam_answer_sheet', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        question_id: {
            type: Sequelize.INTEGER
        },
        answer: {
            type: Sequelize.STRING
        },
        answer_wtg: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.ENUM('0', '1', '2'),
            comment: "0=attempted,1=not attempted,2=mark for review"
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
    return exam_answer_sheet;
}



const exam_temp_questions = (sequelize, Sequelize) => {
    const exam_temp_questions = sequelize.define('ntl_exam_temp_questions', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        exam_id: {
            type: Sequelize.INTEGER
        },
        qid: {
            type: Sequelize.INTEGER
        },
        opt: {
            type: Sequelize.STRING
        },
        stat: {
            type: Sequelize.INTEGER
        },
        qtype: {
            type: Sequelize.INTEGER
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
    return exam_temp_questions;
}


module.exports = { exam_detail, exam_log, exam_answer_sheet, exam_temp_questions }

