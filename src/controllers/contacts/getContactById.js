import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import pool from './../../database/pool.js'

const getContactById = async (req, res) => {
	const { params: { id }, meta } = req

	try {
		const [contact] = await pool.query('SELECT * FROM contacts WHERE id = ?', id)

		if (!contact) {
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

		return res
			.status(StatusCodes.OK)
			.json({
				meta,
				status: 'success',
				title: ReasonPhrases.OK,
				code: StatusCodes.OK,
				message: 'Contact found',
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

export default getContactById
