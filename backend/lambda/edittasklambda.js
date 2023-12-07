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
  const { username, taskid,taskName, taskDesp, progress,taskstatus } = requestBody;

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

    const [result] = await connection.execute('UPDATE Tasks SET  progress = ?,taskstatus=? ,TaskDesp=?  WHERE taskid = ? AND username = ?', [progress ,taskstatus,taskDesp,taskid, username]);

    if (result.affectedRows === 1) {
      return {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify({ message: 'Task Edited' }),
      };
    } else {
      return {
        statusCode: 404,
        headers: responseHeaders,
        body: JSON.stringify({ message: 'Task not found or edit not successful' }),
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
