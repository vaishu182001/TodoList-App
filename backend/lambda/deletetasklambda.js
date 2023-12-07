const mysql = require('mysql2/promise');
let connection;

exports.handler = async (event) => {
    const responseHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE'
    };
    if (!event.body || typeof event.body !== 'string') {
        return {
            statusCode: 400,
            headers: responseHeaders,
            body: JSON.stringify({ message: 'Invalid request body' }),
        };
    }
    
    try {
        const { taskid,username } = JSON.parse(event.body);

        if (!taskid) {
            return {
                statusCode: 400,
                headers: responseHeaders,
                body: JSON.stringify({ message: 'Invalid taskid' }),
            };
        }
         if(!connection){
            connection = await mysql.createConnection({
            host: 'restored.cvrwn2k5tfju.us-east-1.rds.amazonaws.com',
            user: 'admin',
            password: '84771188',
            database: 'Tododb',
        });
    }
        console.log("Connected to Database")
        const [result] = await connection.execute('DELETE FROM Tasks WHERE taskid = ? AND username=?', [taskid,username]);
        //connection.end();

        if (result.affectedRows === 1) {
            return {
                statusCode: 200,
                headers: responseHeaders,
                body: JSON.stringify({ message: 'Task deleted successfully' }),
            };
        } else {
            return {
                statusCode: 404,
                headers: responseHeaders,
                body: JSON.stringify({ message: 'Task not found or deletion not successful' }),
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: responseHeaders,
            body: JSON.stringify({ message: 'Error Connecting to Database' }),
        };
    }
};
