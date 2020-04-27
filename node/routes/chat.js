var express = require('express');
var router = express.Router();
var connection = require('./mysql')
/* 注册用户 */
router.post('/register', function(req, res, next) {
    var date = new Date().getTime()
    var sql = "CREATE TABLE if not exists user (id INT NOT NULL AUTO_INCREMENT, login_name VARCHAR(255), login_pass VARCHAR(255),create_time VARCHAR(255),PRIMARY KEY (id))";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
        connection.query('select * from user where login_name="'+req.body.loginName+'"', (err, result) => {
            if (err) {
                console.log('[查询失败] - ', err.message);
                res.send({"code":1,"msg":"失败"});
                return;
            }
            if (!result.length) {
                var addSql = 'insert into user(login_name,login_pass,create_time) values(?,?,?)';
                var addSqlParams = [req.body.loginName,req.body.loginPass,new Date(date).format('yyyy-MM-dd hh:mm:ss')];
                connection.query(addSql,addSqlParams, (err, result) => {
                    if (err) {
                        console.log('[增加失败] - ', err.message);
                        res.send({"code":1,"msg":"失败"});
                        return;
                    }
                    console.log('--------------INSERT-------------');
                    console.log('增加成功:', result);
                    res.send({"code":0,"msg":"注册成功"});
                });
            } else {
                res.send({"code":4,"msg":"用户已存在"});
            }
        });

    });

});
/* 注册用户 */
router.post('/login', function(req, res, next) {
    connection.query('select * from user where login_name="'+req.body.loginName+'"', (err, result) => {
        if (err) {
            console.log('[查询失败] - ', err.message);
            res.send({"code":1,"msg":"失败"});
            return;
        }
        if (!result.length) {
            res.send({"code":3,"msg":"用户不存在"});
        } else {
            if (req.body.loginPass !== result[0].login_pass) {
                res.send({"code":4,"msg":"密码不正确"});
            } else {
                console.log('查询成功:', result);
                res.send({"code":0,"data":result[0],"msg":"成功"});
            }
        }
    });

});

module.exports = router;
/** 增加日期格式化方法 **/
Date.prototype.format = function(format) {
    console.log(RegExp.$1)
    var o = {
        "M+": this.getMonth() + 1,
        //month
        "d+": this.getDate(),
        //day
        "h+": this.getHours(),
        //hour
        "m+": this.getMinutes(),
        //minute
        "s+": this.getSeconds(),
        //second
        "q+": Math.floor((this.getMonth() + 3) / 3),
        //quarter
        "S": this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }
};
