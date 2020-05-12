var express = require('express');
var router = express.Router();
const path = require('path');

const runSql = require('../mysql');
const { getToken, checkToken } = require('../src/token');
const { getTimestamp_13 } = require('../src/timer');
const getRandom = require('../src/user/verification');
var multiparty = require('multiparty');
var fs = require('fs');

/**
 * 展示公开写信件list
 * GET
 * 接收参数:
 */
router.get('/getOlist', function (req, res, next) {
    let token = req.header('token');
    checkToken(token, (result) => {
        if (result.status !== 0) {
            res.json(result);
        } else {
            runSql(`select user.Uname,user.Uimage,open.* from open,user where user.uid=open.uid`, [], (result1) => {
                res.json(result1);
            });
        }
    });
});



/**
 * 展示公开写信件内容
 * GET
 * 接收参数:
 *      oid:信件id
 */
router.get('/getOletter', function (req, res, next) {
    let{oid} = req.query;
    let token = req.header('token');
    checkToken(token, (result) => {
        if (result.status !== 0) {
            res.json(result);
        } else {
            runSql(`select paper.ppimage,open.* from open,paper where open.ppid=paper.ppid and open.oid=?`, [oid], (result1) => {
                res.json(result1);
            });
        }
    });
});
// /**
//  * 删除写的信件
//  * POST
//  * 接收参数:
//  *   pid：信件id
//  */
// router.post('/getletter/pdelete', function (req, res, next) {
//     //http://localhost:8000/v1/private/getletter/pdelete
//     let {pid} = req.body;
//     let token = req.header('token');
//     checkToken(token, (result) => {
//         if (result.status !== 0) {
//             res.json(result);
//         } else {
//             // console.log(result);
//             let uid = result.data.uid;
//             runSql(`select isDelete from pletter where uid=? and pid=?`,[uid,pid],(result1) =>{
//                 if(result1.data[0].isDelete == 0){
//                     runSql(`update pletter set isDelete=? where uid=? and pid=? `, [1,uid,pid], (result2) => {
//                             res.json(result2);
//                     })
//                 }
//             });
//         }
//     });
// });

/**
 * 书写公开写信件内容
 * POST
 * 接收参数:
 *      Otitle:信件标题
 *      Ocontent：信件内容
 *      Oday:创建日期
 *      ppid:背景id
 */
router.post('/writeOpen', function (req, res, next) {
    let {Otitle, Ocontent,Oday,ppid} = req.body;
    let token = req.header('token');
    checkToken(token, (result) => {
        if(result.status != 0){
            res.json(result);
        }else{
            let uid = result.data.uid;
            runSql(`insert into open(Otitle, Ocontent,Oday,Uid,ppid,number) values (?,?,?,?,?,?)`,[Otitle,Ocontent,Oday,uid,ppid,0],(result1) =>{
                res.json(result1)
            });
        }
    });
});
module.exports = router;
