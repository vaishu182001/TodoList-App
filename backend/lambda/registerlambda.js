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
          body: JSON.stringify({ message: 'Invalid request body' }),
      };
  }
  const requestBody = JSON.parse(event.body);
  const { username, name, dob, email, password } = requestBody;

  try {
       if(!connection){
          connection = await mysql.createConnection({
          host: 'restored.cvrwn2k5tfju.us-east-1.rds.amazonaws.com',
          user: 'admin',
          password: '84771188',
          database: 'Tododb',
      });
    }
      console.log("Connected to Database");

      // Check if the username already exists in the database
    const [existingUser] = await connection.query('SELECT * FROM Users WHERE username = ?', [username]);

    if (existingUser.length > 0) {
      return {
        statusCode: 409, // Conflict status code for username conflict
        headers: responseHeaders,
        body: JSON.stringify({ message: 'Username already exists' }),
      };
    }

     // Check if the email already exists in the database
     const [existingEmail] = await connection.query('SELECT * FROM Users WHERE email = ?', [email]);

     if (existingEmail.length > 0) {
         return {
             statusCode: 409, // Conflict status code for email conflict
             headers: responseHeaders,
             body: JSON.stringify({ message: 'Email already exists' }),
         };
     }

      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

      const [result] = await connection.query('INSERT INTO Users (username, name, dob, email, password) VALUES (?, ?, ?, ?, ?)', [username, name, dob, email, hashedPassword]);

      if (result.affectedRows === 1) {
          return {
              statusCode: 200,
              headers: responseHeaders,
              body: JSON.stringify({ message: 'Registration successful' }),
          };
      } else {
          return {
              statusCode: 401,
              headers: responseHeaders,
              body: JSON.stringify({ message: 'Registration failed, Could Not Insert Data ' }),
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
