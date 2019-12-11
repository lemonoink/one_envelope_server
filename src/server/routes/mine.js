var express = require('express');
var router = express.Router();

const runSql = require('../mysql');
const { getToken, checkToken } = require('../src/token');

let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTU3NDkzNDk1NCwiZXhwIjoxNTc3NjEzMzU0fQ.PQu7Dzp4MsurerTMR-wYSITeWKxGoo_aH_002CeEzqg';
/**
 * 获取个人信息+写信数
 * GET
 * 接收参数:
 *      
 * 返回参数：
 */
router.get('/', function (req, res, next) {
    checkToken(token, (result) => {
        let uid = result.data.uid;
        if (result.status !== 0) {
            res.json(result);
        } else {
            runSql(`select user.*,count(pletter.Pid) as pidnum from user,pletter where user.uid =? and user.uid=pletter.uid`,
            [uid],(result1)=>{
                res.json(result1);
                }
            )
        }
    });
});
/**
 * 获取个人信息中分享数
 * GET
 * 接收参数:
 * 返回参数：
 */
router.get('/sharenum', function (req, res, next) {
    checkToken(token, (result) => {
        let uid = result.data.uid;
        if (result.status !== 0) {
            res.json(result);
        } else {
            runSql(`select count(pletter.isSend) as sharenum from user,pletter where user.uid =? and user.uid=pletter.uid and isSend=1`,
            [uid],(result1)=>{
                res.json(result1);
                }
            )
        }
    });
});
/**
 * 获取回收站信件
 * GET
 * 接收参数:
 *     
 * 返回参数：
 *      status: 0,
 *      message: 'OK',
 */
router.get('/recyclebin', function (req, res, next) {
    checkToken(token, (result) => {
        if (result.status !== 0) {
            res.json(result);
        } else {
            let uid = result.data.uid;
            runSql(`select * from pletter where isSend = ? and isDelete=? and touid=?`, [1,1,uid], (result1) => {
                console.log(result1);
                res.json(result1);
            });
        }
    });
});
/**
 * 彻底删除回收站信件
 * POST
 * 接收参数:
 *     pid：信件id
 * 返回参数：
 *      status: 0,
 *      message: 'OK',
 */
router.post('/recyclebin/deletebin', function (req, res, next) {
    let {pid} = req.body;
    checkToken(token, (result) => {
        if (result.status !== 0) {
            res.json(result);
        } else {
            let uid = result.data.uid;
            runSql(`delete from pletter where isSend = ? and isDelete=? and touid=? and pid=?`, [1,1,uid,pid], (result1) => {
                console.log(result1);
                res.json(result1);
            });
        }
    });
});
/**
 * 获取收藏信件
 * GET
 * 接收参数:
 *     
 * 返回参数：
 *      status: 0,
 *      message: 'OK',
 */
router.get('/favorite', function (req, res, next) {
    checkToken(token, (result) => {
        if (result.status !== 0) {
            res.json(result);
        } else {
            let uid = result.data.uid;
            runSql(`select * from pletter where isSend = ? and isCollection=? and touid=?`, [1,1,uid], (result1) => {
                console.log(result1);
                res.json(result1);
            });
        }
    });
});
/**
 * 取消信件收藏
 * GET
 * 接收参数:
 *     pid:信件id
 * 返回参数：
 *      status: 0,
 *      message: 'OK',
 */
router.post('/recall', function (req, res, next) {
    let {pid} = req.body;
    checkToken(token, (result) => {
        if (result.status !== 0) {
            res.json(result);
        } else {
            let uid = result.data.uid;
            runSql(`update pletter set isCollection=? where isSend=? and isCollection=? and touid=? and pid=?`,[0,1,,1,uid,pid],(result1) => {
                console.log(result1);
                res.json(result1);
            });
        }
    });
});
/**
 * 修改昵称
 * 请求方式：
 *      POST
 * 接收参数：
 *      uname：用户名
 * 返回参数：
 * 
 */
router.post('/changename', function (req, res, next) {
    let {uname}=req.body;
    checkToken(token, (result) => {
        let uid = result.data.uid;
        if (result.status !== 0) {
            res.json(result);
        } else {
            runSql(`update user set uname=? where uid=?`,[uname,uid],(result1)=>{
                res.json(result1);
            })
        }
    });
});
/**
 * 修改密码
 * 请求方式：
 *      POST
 * 接收参数：
 *      oldpwd：用户旧密码
 *      newpwd：用户新密码
 * 返回参数：
 *      
 */
router.post('/changepwd',function(req,res,next){
    let{oldpwd,newpwd} = req.body;
    checkToken(token,(result)=>{
        if(result.status != 0){
            res.json(result);
        }else{
            let uid = result.data.uid;
            runSql(`select upassword from user where uid=? and upassword=?`,[uid,oldpwd],(result1)=>{
                var data = result1.data;
                var arr = Object.getOwnPropertyNames(data);
                // console.log(arr.length);
                if(arr.length == 1){
                    res.json('旧密码不正确！')
                }else{
                    runSql(`update user set upassword=? where uid=?`,[newpwd,uid],(result2)=>{
                        res.json(result2);
                    })
                }
            })
        }
    })
})
/**
 * 获取通知
 * GET
 * 接收参数:
 *     
 * 返回参数：
 *      status: 0,
 *      message: 'OK',
 */
router.get('/notice', function (req, res, next) {
    checkToken(token, (result) => {
        if (result.status !== 0) {
            res.json(result);
        } else {
            // let uid = result.data.uid;
            runSql(`select * from notice`,[], (result1) => {
                console.log(result1);
                res.json(result1);
            });
        }
    });
});
module.exports = router;