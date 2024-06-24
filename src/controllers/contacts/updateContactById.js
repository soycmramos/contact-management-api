import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import pool from './../../database/pool.js'

const updateContactById = async (req, res) => {
	const { params: { id }, body, meta } = req
	const { name, phone } = body

	let data = [id, name, phone]

	if (data.some(x => typeof x === 'string' && !x.trim())) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({
				meta,
				status: 'failure',
				title: ReasonPhrases.BAD_REQUEST,
				code: StatusCodes.BAD_REQUEST,
				message: 'Invalid empty value',
				data: null
			})
	}

	data = data.map(x => x && x.trim())

	try {
		const { affectedRows } = await pool.query('UPDATE contacts SET name = IFNULL(?, name), phone = IFNULL(?, phone) WHERE id = ?', [name, phone, id])

		if (!Boolean(affectedRows)) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({
					meta,
					status: 'failure',
					title: ReasonPhrases.NOT_FOUND,
					code: StatusCodes.NOT_FOUND,
					message: 'Contact not found',
					data: null
				})
		}

		const [contact] = await pool.query('SELECT * FROM contacts WHERE id = ?', id)

		return res
			.status(StatusCodes.OK)
			.json({
				meta,
				status: 'success',
				title: ReasonPhrases.OK,
				code: StatusCodes.OK,
				message: 'Contact updated',
				data: contact,
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

export default updateContactById
