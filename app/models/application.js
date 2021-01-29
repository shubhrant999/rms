module.exports = (sequelize, Sequelize) => {
    const Application = sequelize.define("ntl_applications", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        applicant_id: {
            type: Sequelize.INTEGER
        },
        vacancy_id: {
            type: Sequelize.INTEGER
        },      
        location_id: {
            type: Sequelize.INTEGER
        },
        city_id: {
            type: Sequelize.INTEGER
        },
        user_current_location: {
            type: Sequelize.STRING
        },
        user_preferred_location: {
            type: Sequelize.STRING
        },
        apply_date: {
            type: Sequelize.DATEONLY,
            defaultValue: Sequelize.NOW
        },
        int_schedule_date: {
            type: Sequelize.DATEONLY
        },
        int_schedule_time: {
            type: Sequelize.STRING
        },
        current_stage:{
            type: Sequelize.INTEGER
        },
        appr_reject: {
            type: Sequelize.ENUM('0','1', '2','5'),
            comment: "0=pending,1=approved,2=reject,5=hold"
        },
        appr_rejc_label: {
            type: Sequelize.ENUM('1', '2', '3'),
            comment: "1=round1,2=round2,3=round3"
        },
        onboarding_req_send: {
            type: Sequelize.ENUM('0', '1', '2'),
            comment: "0= No action taken, 1= onboarding Req Sent, 2= On Boarded"
        },
        f2f_generate_time: {
            type: Sequelize.DATE
        },
        f2f_address: {
            type: Sequelize.STRING
        },
        req_documents: {
            type: Sequelize.STRING
        },
        onboard_documents: {
            type: Sequelize.STRING
        },
        select_generate_time: {
            type: Sequelize.DATE
        },
        ip_address: {
            type: Sequelize.STRING
        },
        gen_new_link: {
            type: Sequelize.INTEGER
        },
        team_id: {
            type: Sequelize.STRING
        },
        team_iCalUId: {
            type: Sequelize.STRING
        },
        team_link: {
            type: Sequelize.TEXT
        },
        team_send_date: {
            type: Sequelize.DATE
        },
        meeting_type: {
            type: Sequelize.BOOLEAN
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
    return Application;
};


