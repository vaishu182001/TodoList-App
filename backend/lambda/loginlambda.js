const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
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
            body: JSON.stringify({ message: 'Invalid request body' })
        };
    }
    const requestBody = JSON.parse(event.body);
    const { username, password } = requestBody;
    try {
        if(!connection){
           connection = await mysql.createConnection({
            host: 'restored.cvrwn2k5tfju.us-east-1.rds.amazonaws.com',
            user: 'admin',
            password: '84771188',
            database: 'Tododb'
        });
    }
        console.log('Connected to Database');
        const [rows] = await connection.query('SELECT * FROM Users WHERE username = ? ', [username]);
        if (rows.length === 1) {
            const storedPasswordHash = rows[0].password;
            const isPasswordValid = await bcrypt.compare(password, storedPasswordHash);
            if (isPasswordValid) {
                return {
                    statusCode: 200,
                    headers: responseHeaders,
                    body: JSON.stringify({ message: 'Login successful', username: username })
                };
            }
        }
        return {
            statusCode: 401,
            headers: responseHeaders,
            body: JSON.stringify({ message: 'Invalid credentials' })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: responseHeaders,
            body: JSON.stringify({ message: 'Error Connecting to Database' })
        };
    }
};