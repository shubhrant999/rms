const db = require("../models");
const Vacancy = db.vacancy;
const Application = db.application;
const Exam = db.exam_detail;
const Exam_log = db.exam_log;
const Competency = db.competency;
const Question = db.question;
const Exam_temp_questions = db.exam_temp_questions;
const Exam_answer_sheet = db.exam_answer_sheet;


var moment = require('moment');
moment.tz.setDefault('Asia/Kolkata');
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const helper = require("../helper");



module.exports = {
    show_exam : function (req, res) {
        ap_exam_hiring(req, res);
    },
    ajax_hiring_questions,
    hiring_question_submit,
    hiring_thankyou,
    time_hiring_check
}

function sort_by_key(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function check_hiring_link_validity(req, data) {
    if (data.token) {
        if (data) {
            var result = {};
            status = data.link_status;
            questions_val = data.questions_val;
            start_time = data.start_time;
            valid_time = moment(start_time).utcOffset('+0530').add(24, 'hours').format('YYYY-MM-DD HH:mm:ss');            
            current_time = moment().format('YYYY-MM-DD HH:mm:ss');
            exam_id = data.id;
            cookie_log = req.cookies.local_strg ? req.cookies.local_strg : '';    
            job_exam_log_data = {
                cookie : cookie_log, 
                token : data.token, 
                exam_id : exam_id,
                ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress
            }   
                    
            if (moment(current_time).isAfter(valid_time)){
                job_exam_log_data.erroe_message = 'Your exam link time has been expired';
                Exam_log.create(job_exam_log_data);
                result.response = false;
                result.error_message = 'Your exam link time has been expired';
                return result;  
            }
            if (!status) {
                job_exam_log_data.erroe_message = 'Your exam submitted';
                Exam_log.create(job_exam_log_data);
                result.response = false;
                result.error_message = 'Your exam has been already submitted. Your link has been disabled now.';
                return result;  
            }
            result.response= true;
            return result;
        }else{
            job_exam_log_data.erroe_message = 'Token not vaid';
            Exam_log.create(job_exam_log_data);
            result.response = false;
            result.error_message = 'Your link has been disabled';
            return result;             
        }
    }else{
        result.response = false;
        return result;
    }
}

function ap_exam_hiring(req,res) {
    var token = req.params.token;  
    if(token){
        Exam.findOne({
            include: [
                {
                    model: Application,
                    attributes: ['vacancy_id'],
                    required: true,                        
                    include:{
                        model: Vacancy,
                        attributes: ['id','category_name'],                            
                        required: true
                    }                        
                }
            ],
            where: { token: token } 
        })
        .then(examData => {
             
            if (examData) {                                
                const exam_id = examData.id;
                req.session.exam_id = exam_id; 
                job_role = examData.ntl_application.ntl_vacancy_category.category_name;
                vacancy_id = examData.ntl_application.ntl_vacancy_category.id;
                link_status = examData.link_status;                 
               
                var viewData = {
                    exam_id: exam_id,
                    token: token,
                    role_type: job_role,                    
                    exam_page: examData.current_ques_id ? 'next' : 'start'
                }; 
                               
                var checkRes = check_hiring_link_validity(req, examData);
                if (checkRes.response == true){
                    var changeData = {
                        tracker_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                    };
                    Exam.update(changeData, { where: { token: token } });
                    
                    if (!examData.questions_val){
                        let questids = {}; 
                        Competency.findAll({

                        })
                        .then(async competency_data => { 
                            if(competency_data){  
                                new_ques_type = {};
                                insert_temp = {};
                                return  await Promise.all( 
                                    competency_data.map(async (compt) => {  
                                        var ques_type = { 
                                            type_id: compt.id, 
                                            name: compt.name
                                        }
                                        new_ques_type[compt.id] = ques_type; 

                                        await Question.findAll({
                                            where: { status: 0, competency_cat: compt.id, vacancy_id: vacancy_id },
                                            order: Sequelize.literal('rand() ASC'),
                                            limit: compt.quest_count
                                        })
                                        .then(questions => {
                                            
                                            let obj = {};
                                            questions.forEach(quest_data => {
                                                let compt_id = compt.id;
                                                let question_id = quest_data.id;   
                                                var qdata = {         
                                                            qid: question_id, 
                                                            option_selected : '', 
                                                            submit_type : 0,
                                                            ques_type: compt_id                  
                                                };
                                                obj[quest_data.id] = qdata;  
                                                questids[compt_id] = obj;

                                                temp_question_data = {
                                                    exam_id : exam_id,
                                                    qid: question_id, 
                                                    opt : '',
                                                    stat: 0,
                                                    qtype: compt_id
                                                }
                                                insert_temp[question_id] = temp_question_data;                                                
                                            }); 
                                        })
                                        .catch(err => console.log(err));                                            
                                    })
                                )
                                .then(() => {          
                                    var questions_val = {
                                        quest_ids: questids,
                                        ques_type : new_ques_type,
                                        parent_id :  0
                                    }       
                                    
                                    var insert = [];
                                    for (var i in insert_temp)
                                        insert.push(insert_temp[i]);
                                        
                                    sort_by_key(insert, 'qtype');

                                    // console.log(insert_temp);
                                    // console.log(insert);
                                    Exam_temp_questions.bulkCreate(insert);

                                    questions_val = JSON.stringify(questions_val); 
                                    var upData = {
                                        questions_val: questions_val,
                                    };
                                    Exam.update(upData, { where: { id: exam_id } }); 
                                }).catch(function () {
                                    console.log("Promise Rejected3");
                                });
                            }
                        }).catch(function () {
                            console.log("Promise Rejected2");
                        });
                    }else{
                        viewData.req_type = 'load';
                        // viewData.error_msg = 'Question val is not empty';
                    }                    
                }else{                         
                    viewData.error_msg = checkRes.error_message;                    
                }

                viewData.req_type = examData.current_ques_id ? 'load' : 'ajax';
                res.render('frontend/exam/exam_info', { viewData : viewData });
                res.end();
            }else{
                viewData = {
                    req_type : 'ajax',
                    error_msg : 'Your link has been disabled'
                }
                res.render('frontend/exam/exam_info', { viewData: viewData });
                res.end();
            }
        }).catch(function () {
            viewData = {
                req_type : 'ajax',
                error_msg : 'Your link has been disabled'
            }
            res.render('frontend/exam/exam_info', { viewData: viewData });            
            res.end();
        });
            
    }  

}

async function get_user_qusetion(req, data = false) {
    exam_id = req.session.exam_id;    
    temp_id = data.temp_id ? data.temp_id : '';
    new_ques = data.obj ? data.obj: '';
    stat = (data.stat!=="") ? data.stat : '';
    type_id = data.type_id ? data.type_id : '';
    option = (data.option !== "") ? data.option : '';
    ques_id = data.ques_id ? data.ques_id : '';
    parent_id = data.case4_parent_id ? data.case4_parent_id : '';  

    const finaldata = await Exam.findOne({
        where: { id: exam_id}
    })
    .then(async exam_result => {
        ques_id = ques_id ? ques_id : exam_result.current_ques_id;
        questions_val = exam_result.questions_val ? JSON.parse(exam_result.questions_val):'';

        current_ques = await Question.findOne({
            where: {
                id: ques_id
            }
        }).then(current_ques_result => {
            return current_ques_result;
        }).catch(function () {
            console.log("Promise Rejected11");
        });
        current_ques_type = current_ques.competency_cat;

        if (questions_val && current_ques_type && ques_id) {
            if ( (option!== '') && (stat != 3) && (stat!== '') ){
                stat = 1;
            }
            questions_val.quest_ids[current_ques_type][ques_id].submit_type = stat;
        }
        ques_arr = questions_val;        
        questionId = (new_ques) ? new_ques.qid: '';
        if(!questionId) {
            questionId = ques_id;
        }
        current_temp_data = await Exam_temp_questions.findOne({
            where: { qid: questionId, exam_id: exam_id }
        }).then(result => {
            return result;
        }).catch(function () {
            console.log("Promise Rejected5");
        });
        
        quest_start_time = (exam_result.quest_start_time && exam_result.quest_start_time != '0000-00-00 00:00:00') ? exam_result.quest_start_time : moment().format('YYYY-MM-DD HH:mm:ss');
        updata = {
            current_ques_id: questionId,
            quest_start_time: quest_start_time,
            questions_val: JSON.stringify(questions_val)
        }
        Exam.update(updata, { where: { id: exam_id } });
        updata_temp = {
            opt : option,
            stat : stat
        }   
        Exam_temp_questions.update(updata_temp, { where: { id: temp_id } });

        prev_ques = await Exam_temp_questions.findOne({
            where: {
                id: {
                    [Op.lt]: current_temp_data.id
                },
                exam_id: exam_id
            }
        }).then(prev_ques_result => {            
            return prev_ques_result;
        }).catch(function () {
            console.log("Promise Rejected6");
        });
        
        prev_ques = prev_ques ? { qid: prev_ques.qid, opt: prev_ques.opt, stat: prev_ques.stat } : '';
        next_ques = await Exam_temp_questions.findOne({
            where: {
                id: {
                    [Op.gt]: current_temp_data.id
                },
                qid: {
                    [Op.ne]: questionId
                },
                exam_id: exam_id
            }
        }).then(next_ques_result => {
            return next_ques_result;
        }).catch(function () {
            console.log("Promise Rejected7");
        });
        next_ques = next_ques ? { qid: next_ques.qid, opt: next_ques.opt, stat: next_ques.stat } : '';
        curnt_ques = await Exam_temp_questions.findOne({
            where: {
                id: current_temp_data.id,
                exam_id: exam_id
            }
        }).then(curnt_ques_result => {
            return curnt_ques_result;
        });
        curnt_ques = curnt_ques ? { qid: curnt_ques.qid, opt: curnt_ques.opt, stat: curnt_ques.stat} : '';

        ques = await Question.findOne({
            where: {
                id: questionId
            }
        }).then(ques_result => {
            return ques_result;
        }).catch(function () {
            console.log("Promise Rejected8");
        });
        ques_array = {};
        if(ques) {
            option1 = ques.option1 ? { key: 'option1', val: ques.option1 } : '';
            option2 = ques.option2 ? { key: 'option2', val: ques.option2 } : '';
            option3 = ques.option3 ? { key: 'option3', val: ques.option3 } : '';
            option4 = ques.option4 ? { key: 'option4', val: ques.option4 } : '';
            ques_array = {
                quest_id : ques.id,
                title   : ques.question,                
                options : {
                    option1,
                    option2,
                    option3,
                    option4
                }
            }
        }        
        t_arr = {};
        case_q_count = [];
        temp_ques_data = await Exam_temp_questions.findAll({ where: { exam_id: exam_id }, raw: true})
        .then(result =>{
            return result;
        }).catch(function () {
            console.log("Promise Rejected9");
        });
       
        if(temp_ques_data){
            temp_ques_data.forEach(tdata => {
                case_q_count.push(tdata);
                t_arr[tdata.qid] = tdata;
            });
        }
        key = questionId.toString();
        thisdata = {
            quest_id: questionId,     
            question_num :  (Object.keys(t_arr).indexOf(key) + 1),
            case_q_count: case_q_count,
            question: ques_array,
            ques_type: ques_arr.ques_type ? ques_arr.ques_type : '',
            ques_count: t_arr ? Object.keys(t_arr).length : 0,
            curnt: curnt_ques,
            next: next_ques,
            prev: prev_ques,
            curr_type_id: ques.question_type ? ques.question_type : '',
            quesArr: t_arr,
            questions_val: questions_val, 
            temp_id: current_temp_data.id ? current_temp_data.id : '',
            view: ( (curnt_ques.stat !== '') && (curnt_ques.stat==3)) ? 1 : 0
        };
        return thisdata;
    }).catch(err => console.log(err));
    return finaldata;
}

async function ajax_hiring_questions(req, res){
    var isAjaxRequest = req.xhr;
    if(req.body.ajax_req){        
        option  = req.body.option ? req.body.option : '';
        obj     = req.body.obj ? JSON.parse(req.body.obj) : '';
        stat    = req.body.stat ? req.body.stat : '';
        type_id = req.body.type_id ? req.body.type_id : '';
        ques_id = req.body.ques_id ? req.body.ques_id : '';
        temp_id = req.body.temp_id ? req.body.temp_id: '';
        exam_id = req.session.exam_id;       

        ques = await Question.findOne({
            where: {
                id: obj.qid
            }
        }).then(ques_result => {
            return ques_result;
        }).catch(function () {
            console.log("Promise Rejected8");
        });        

        type_id = ques ? ques.question_type : type_id;   
        data = {
            temp_id: temp_id,
            ques_id: ques_id,
            type_id: type_id,
            stat: stat,
            obj: obj,
            option: option,
            case4_parent_id: req.session.parent_id
        }
        var data = await get_user_qusetion(req, data);          
        res.render('frontend/exam/ajax_hiring_questions', { data: data });        
    }else{
        req_type = req.body.type;
        token = req.body.token;    
        Exam.findOne({
            where: { token: token }
        })
        .then(async exam_result => { 
                
            question_vals = JSON.parse(exam_result.questions_val);
            
            var whr = { exam_id: exam_result.id }
            if (exam_result.current_ques_id) { whr.qid = exam_result.current_ques_id }

            exam_temp_data = await Exam_temp_questions.findOne({ where: whr })
            .then(result => {
                return result;
            }).catch(function () {
                console.log("Promise Rejected11");
            });      
            temp_id = '';
            temp_qid = '';
            temp_qtype = '';
            if (exam_temp_data){
                temp_id = exam_temp_data.id ? exam_temp_data.id : '';
                temp_qid = exam_temp_data.qid ? exam_temp_data.qid : '';
                temp_qtype = exam_temp_data.qtype ? exam_temp_data.qtype : '';
            }
            
            if (question_vals) {            
                quest_idn = question_vals.quest_ids; //pr($quest_idn); die;
                ques_type = question_vals.ques_type;
                parent_id = question_vals.parent_id;   
                req.session.quest_ids = quest_idn;
                req.session.ques_type = ques_type;
                req.session.case4_parent_id = parent_id;           
            }            
            let first = Object.keys(quest_idn)[0];
            let firstKey = Object.keys(quest_idn[first])[0];
            init_question = quest_idn[first][firstKey];
            quesArr_ques_id = init_question.qid ? init_question.qid : '';
            quesArr_type_id = init_question.ques_type ? init_question.ques_type : '';            
            ques_id = (exam_result.current_ques_id && req_type == 'load') ? exam_result.current_ques_id : temp_qid;
            type_id = (exam_result.current_type_id && req_type == 'load') ? exam_result.current_type_id : temp_qtype;
            obj = init_question ? init_question : '';
            stat = init_question.submit_type ? init_question.submit_type : 0;
            option = init_question.option_selected ? init_question.option_selected : '';
            data = { 
                temp_id : temp_id, 
                ques_id : ques_id,
                type_id : type_id, 
                stat : stat, 
                obj : obj,
                option : option,
                case4_parent_id: parent_id
            }
        
            var data = await get_user_qusetion(req, data); // get ques data                      
            start_time = exam_result.start_time ? moment(exam_result.start_time).utcOffset('+0530').format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss');
            exam_start_time = (exam_result.quest_start_time) ? moment(exam_result.quest_start_time).utcOffset('+0530').format('YYYY-MM-DD HH:mm:ss') : '';
            time_taking = constants.EXAM_TIME;
            time_take_per = 100;
            if (exam_start_time) {
                exam_end_time = ((exam_result.quest_end_time) && (exam_result.quest_end_time != '0000-00-00 00:00:00')) ? moment(exam_result.quest_end_time).utcOffset('+0530').format('YYYY-MM-DD HH:mm:ss') : '';
                start_time = moment(exam_start_time).utcOffset('+0530').add(constants.EXAM_TIME, 'minutes').format('YYYY-MM-DD HH:mm:ss');
                from_time = moment(start_time);
                to_time = moment(exam_start_time);
                time_taking = exam_end_time ? from_time.diff(to_time, 'seconds') : constants.EXAM_TIME;          
                time_take_per = time_taking !== '' ? Math.round((time_taking * 100) / constants.EXAM_TIME) : 100;
                time_take_per = ((time_taking !== '') && (time_take_per == '')) ? 1 : time_take_per;
            }
            data.status =1;
            data.time_taking = time_taking;
            data.time_take_per = time_take_per;
            res.render('frontend/exam/ajax_hiring_questions', { data: data });            
        }).catch(err => console.log(err));
    }
}

async function submit_assesment(req, res) {
    if(req.session.exam_id){
        exam_id = req.session.exam_id;

        /* last answer submission start here when submit button clicked. */
        if (req.body.temp_id){
            var last_ques_option = req.body.option;
            var last_ques_temp_id = req.body.temp_id;
            updata_temp = {
                opt: last_ques_option,
                stat: last_ques_option ? constants.ATTEMPTED : constants.NOT_ATTEMPTED
            }
            await Exam_temp_questions.update(updata_temp, { where: { id: last_ques_temp_id } });
        }
        /* last answer submission end here */
        
        
        exam_temp_ques_arr = await Exam_temp_questions.findAll({ 
            attributes: ['qid','opt','stat'],
            raw: true,
            where: { exam_id :exam_id} })
            .then(result => {
                return result;
            }).catch(function () {
                console.log("Promise Rejected21");
            });  

        var qids = exam_temp_ques_arr.map(x => x.qid);
        var arr_col_res = await helper.array_column(exam_temp_ques_arr, 'qid');
        var ques_arr = await helper.array_combine(arr_col_res, exam_temp_ques_arr);

        questions = await Question.findAll({
            raw: true,
            where: {
                id: { [Op.in]: qids }
            }
        })
        .then(question_result => {
            return question_result;
        }).catch(function () {
            console.log("Promise Rejected22");
        }); 

        questions_existing = await Exam_answer_sheet.findOne({ where: {exam_id:exam_id}})
        .then(questions_existing_result => {
            return questions_existing_result;
        }).catch(function () {
            console.log("Promise Rejected23");
        }); 
        
        compt_score = {};
        if (questions && !questions_existing){
            questions.forEach(async q_data =>{
                quest_id = q_data.id;
                option = ques_arr[quest_id].opt;
                stat = ques_arr[quest_id].stat;
                answer = '';
                answer_wtg = 0;
                if (option == 'option1') {
                    answer = q_data.option1;
                    answer_wtg = q_data.opt1wtg;
                }
                if (option == 'option2') {
                    answer = q_data.option2;
                    answer_wtg = q_data.opt2wtg;
                }
                if (option == 'option3') {
                    answer = q_data.option3;
                    answer_wtg = q_data.opt3wtg;
                }
                if (option == 'option4') {
                    answer = q_data.option4;
                    answer_wtg = q_data.opt4wtg;
                }

                postdata = {
                    exam_id : exam_id,
                    question_id : quest_id, 
                    answer : answer, 
                    answer_wtg : answer_wtg, 
                    status : stat                    
                }
                
                if (compt_score[q_data.competency_cat]){
                    compt_score[q_data.competency_cat] = {
                        ques_count: compt_score[q_data.competency_cat].ques_count + 1,
                        answer_wtg: compt_score[q_data.competency_cat].answer_wtg + answer_wtg                        
                    }
                }else{
                    compt_score[q_data.competency_cat] = {
                        ques_count : 1,
                        answer_wtg: answer_wtg                        
                    }
                }
                compt_score[q_data.competency_cat].perc = Math.round((compt_score[q_data.competency_cat].answer_wtg * 100) / (compt_score[q_data.competency_cat].ques_count * constants.MAX_WEIGHTAGE))
                await Exam_answer_sheet.create(postdata);
            });
            
            await Exam_temp_questions.destroy({
                where: { exam_id : exam_id }
            });
                
            updata_exam = {
                quest_end_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                current_ques_id: '',
                status: 0
            }
            await Exam.update(updata_exam, { where: { id: exam_id } });    
            result = await Exam_answer_sheet.findOne({ 
                attributes: [
                    'id', 
                    [Sequelize.fn('sum', Sequelize.col('answer_wtg')), 'total_wtg'],
                    [Sequelize.fn('count', Sequelize.col('id')), 'tot_ques']
                ],
                where: { exam_id: exam_id },
                raw: true
            }).then(examresult => {
                return examresult;
            }).catch(function () {
                console.log("Promise Rejected25");
            }); 

            if (result.id) {
                total_wtg = result.total_wtg;
                total_score_percent = (result.tot_ques) ? Math.round((total_wtg * 100) / (result.tot_ques * constants.MAX_WEIGHTAGE)) : 0;        

                updateData = {        
                    total_score: total_score_percent,           
                    competncy_wise_Score : compt_score
                }
                await Exam.update(updateData, { where: { id: exam_id } }); 
            }
            response = {
                status: 2, redirect_url: 'hiring-assement-thanks'
            }            
        }else{
            response = {
                status: 0, msg: 'Some error has been occurred.'
            }
        }
    } else {
        response = {
            status: 0, msg:'No Exam exists'
        }
    }
    res.send(response);     
}

async function hiring_question_submit(req, res) {
    if (req.method == 'POST') {
        await submit_assesment(req,res);
    }
}

function hiring_thankyou(req,res) {
    res.render('frontend/exam/thank_you');
    res.end();
}

async function check_time_limit(exam_id) {
    var exam = await Exam.findOne({ where: { id: exam_id }, raw: true })
        .then(examdata => {            
            return examdata;
        })
        .catch(function (err) {
            console.log(err);
        });   
    
    exam_start_time = ((exam.quest_start_time) && (exam.quest_start_time != '0000-00-00 00:00:00')) ? exam.quest_start_time : '';
    var result = {};
    if (exam_start_time) {
        start_time = moment(exam_start_time).utcOffset('+0530').add(constants.EXAM_TIME, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        new_time = moment().format('YYYY-MM-DD HH:mm:ss');
        if (moment(new_time).isAfter(start_time)) {
            result.response = false; 
        } else {
            result.response = true;
        }
    } else {
        result.response = false;
    }
    return result;
}

async function time_hiring_check(req, res) {
    exam_id = req.session.exam_id;
    if(exam_id){
        var exam = Exam.findOne({ where: { id: exam_id } })
            .then(examdata => {
                return examdata;
            })
            .catch(function (err) {
                console.log("time_hiring_check error 1");
                console.log(err);
            }); 
        
        exam_start_time = ((exam.quest_start_time) && (exam.quest_start_time != '0000-00-00 00:00:00')) ? exam.quest_start_time : '';
        time_taking = 1500;
        time_take_per = 100;
        if (exam_start_time) {
            exam_end_time = ((exam.quest_end_time) && (exam.quest_end_time != '0000-00-00 00:00:00')) ? moment(exam.quest_end_time).utcOffset('+0530').format('YYYY-MM-DD HH:mm:ss') : '';
            start_time = moment(exam_start_time).utcOffset('+0530').add(constants.EXAM_TIME, 'minutes').format('YYYY-MM-DD HH:mm:ss');
            from_time = moment(start_time);
            to_time = moment(exam_start_time);
            time_taking = exam_end_time ? from_time.diff(to_time, 'seconds') : 1500;
            time_take_per = time_taking !== '' ? Math.round((time_taking * 100) / 1500) : 100;
            time_take_per = ((time_taking !== '') && (time_take_per == '')) ? 1 : time_take_per;
        }
        var check_time = await check_time_limit(exam_id);
        if (!check_time.response) {
            quest_start_time = (exam.quest_start_time && exam.quest_start_time != '0000-00-00 00:00:00') ? exam.quest_start_time : '';

            if (quest_start_time) {
                changeData = {
                    video_end_time: moment().format('YYYY-MM-DD HH:mm:ss')
                }
                Exam.update(changeData, { where: { id: exam_id } });
            }
            resArr = quest_start_time ? { status: 2, redirect_url: 'hiring-assement-thanks' } : { status: 1 };
            req.session.exam_hiring_submit = 1;
            res.send(resArr);
            res.end();
        } else {
            req.session.exam_id = exam_id;
            updateData = {
                quest_end_time: moment().format('YYYY-MM-DD HH:mm:ss')
            }
            Exam.update(updateData, { where: { id: exam_id } });

            response = {
                status: 1,
                time_taking: time_taking,
                time_take_per: time_take_per
            }
            res.send(response);
            res.end();
        }
    }   
}


