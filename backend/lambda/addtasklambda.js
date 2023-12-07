const mysql = require('mysql2/promise');
let connection;

exports.handler = async (event) => {
    const responseHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
    };

    if (!event.body || typeof event.body !== 'string') {
        return {
            statusCode: 400,
            headers: responseHeaders,
            body: JSON.stringify({ message: 'Invalid request body' }),
        };
    }

    const requestBody = JSON.parse(event.body);
    const { username, task } = requestBody;

    try {
        if(!connection){
            connection = await mysql.createConnection({
            host: 'restored.cvrwn2k5tfju.us-east-1.rds.amazonaws.com',
            user: 'admin',
            password: '84771188',
            database:'Tododb',
        });
    }

        console.log('Connected to Database');

        // Check if a task with the same name already exists
        const [existingTask] = await connection.query('SELECT * FROM Tasks WHERE Taskname = ? AND username = ?',
            [task.name, username]);

        if (existingTask.length > 0) {
            // Task with the same name already exists, you can choose to return an error message or modify the existing task
            return {
                statusCode: 409,
                headers: responseHeaders,
                body: JSON.stringify({ message: 'Task with the same name already exists' }),
            };
        }

        const [result] = await connection.query('INSERT INTO Tasks (Taskname, TaskDesp, progress, taskstatus, taskdate, username) VALUES (?, ?, ?, ?, ?, ?)',
            [task.name, task.description, 0, task.status, task.date, username]);

        if (result.affectedRows === 1) {
            return {
                statusCode: 200,
                headers: responseHeaders,
                body: JSON.stringify({ message: 'Task added successfully' }),
            };
        } else {
            return {
                statusCode: 401,
                headers: responseHeaders,
                body: JSON.stringify({ message: 'Failed to add the task, could not insert data' }),
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: responseHeaders,
            body: JSON.stringify({ message: 'Error connecting to the database' }),
        };
    }
};
