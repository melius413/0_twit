const mysql = require('mysql2/promise');
const connect = mysql.createPool({
	// host: "localhost",
	host: "db.melius413.gabia.io",
	// port: 3307,
	port: 3306,
	// user: "root",
	user: "melius413",
	password: process.env.dbpass,
	// database: 'twit',
	// database: 'twit',
	connectionLimit: 10,
	waitForConnections: true
});

module.exports = { connect };