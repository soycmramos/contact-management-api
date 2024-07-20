import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import pool from '../../database/pool.js'

const getAllContacts = async (req, res) => {
	const { meta } = req
	try {
		const [contacts] = await pool.query('SELECT * FROM contacts')

		if (!contacts.length) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({
					meta,
					status: 'failure',
					title: ReasonPhrases.NOT_FOUND,
					code: StatusCodes.NOT_FOUND,
					message: 'There is no contacts yet',
					data: [],
				})
		}

		return res
			.status(StatusCodes.OK)
			.json({
				meta,
				status: 'success',
				title: ReasonPhrases.OK,
				code: StatusCodes.OK,
				message: 'Contacts found successfully',
				data: contacts,
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

export default getAllContacts
