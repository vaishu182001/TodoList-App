const mysql = require('mysql2/promise');
let connection;

exports.handler = async (event) => {
    const responseHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
    };

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers: responseHeaders,
            body: JSON.stringify({ message: 'Invalid HTTP method' }),
        };
    }

    const username = event.queryStringParameters.username;

    try {
        if(!connection){
            connection = await mysql.createConnection({
            host: 'restored.cvrwn2k5tfju.us-east-1.rds.amazonaws.com',
            user: 'admin',
            password: '84771188',
            database: 'Tododb',
        });
    }

        console.log('Connected to Database');

        const [rows] = await connection.query('SELECT Taskname, TaskDesp, progress,taskstatus,taskdate,taskid FROM Tasks WHERE username = ? ', [username]);

        return {
            statusCode: 200,
            headers: responseHeaders,
            body: JSON.stringify(rows),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: responseHeaders,
            body: JSON.stringify({ message: 'Error connecting to the database' }),
        };
    }
};
