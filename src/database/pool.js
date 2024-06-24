import mariadb from 'mariadb'
import { config } from 'dotenv'

config()

const pool = mariadb.createPool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
})

try {
	await pool.getConnection()
	console.info('DB is connected!')
} catch (error) {
	console.error(JSON.stringify(error, null, 2))
}

export default pool
