import { randomUUID } from 'node:crypto'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import pool from '../../database/pool.js'

const createContact = async (req, res) => {
	const { body, meta } = req
	const { name, phone } = body
	const id = randomUUID()

	let data = [id, name, phone]

	if (data.some(x => !Boolean(x) || !x.trim())) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({
				meta,
				status: 'failure',
				title: ReasonPhrases.BAD_REQUEST,
				code: StatusCodes.BAD_REQUEST,
				message: 'All parameters are required',
				data: null,
			})
	}

	data = data.map(x => x.trim())

	try {
		await pool.query('INSERT INTO contacts (id, name, phone) VALUES (?, ?, ?)', [id, name, phone])
		const [createdContact] = await pool.query('SELECT * FROM contacts WHERE id = ?', id)
		return res
			.status(StatusCodes.CREATED)
			.json({
				meta,
				status: 'success',
				title: ReasonPhrases.CREATED,
				code: StatusCodes.CREATED,
				message: 'Contact created successfully',
				data: createdContact
			})
	} catch (e) {
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({
				meta,
				status: 'failure',
				title: ReasonPhrases.INTERNAL_SERVER_ERROR,
				code: StatusCodes.INTERNAL_SERVER_ERROR,
				message: 'Something went wrong',
				data: null,
			})
	}
}

export default createContact
