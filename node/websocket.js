var ws = require("nodejs-websocket")
var connection = require('./routes/mysql')

// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
    console.log("New connection")
    var sql = "CREATE TABLE if not exists chat (id INT NOT NULL AUTO_INCREMENT, direction INT, chat_type INT,chat_content VARCHAR(255),create_time VARCHAR(255),PRIMARY KEY (id))";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });

    conn.sendText("连接成功!!!")
    conn.on("text", function (str) {
        console.log("Received "+str)
        try {
            var date = new Date().getTime()
            var message = JSON.parse(str)
            var addSql = 'insert into chat (direction,chat_type,chat_content,create_time) values(?,?,?,?)';
            var addSqlParams = [message.direction,message.contentType,message.chatContent,new Date(date).format('yyyy-MM-dd hh:mm:ss')];
            connection.query(addSql,addSqlParams, (err, result) => {
                if (err) {
                    console.log('[增加失败] - ', err.message);
                    conn.sendText('增加失败')
                    return;
                }
                console.log('--------------INSERT-------------');
                console.log('增加成功:', result);
            });

            setTimeout(function () {
                var date = new Date().getTime()
                connection.query('insert into chat (direction,chat_type,chat_content,create_time) values(?,?,?,?)',
                    [1,1,'你好！',new Date(date).format('yyyy-MM-dd hh:mm:ss')], (err, result) => {
                        if (err) {
                            console.log('[增加失败] - ', err.message);
                            return;
                        }
                        console.log('--------------INSERT-------------');
                        console.log('增加成功:', result);
                    });
                var obj ={
                    type:'message',
                    data:{
                        direction:1,
                        contentType:1,
                        chatContent:'你好'
                    }
                }
                console.log(JSON.stringify(obj))
                conn.sendText(JSON.stringify(obj))

            },1000)
        }catch (e) {

        }


    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
})

module.exports = server