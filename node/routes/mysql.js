var mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // 用户名
    password: '123456', // 密码
    port: '3306',
    database: 'chat' // 数据库名称
});
connection.connect((err, result) => {
    if (err) {
        console.log("连接失败");
        return;
    }
    console.log("连接成功");
});

module.exports = connection