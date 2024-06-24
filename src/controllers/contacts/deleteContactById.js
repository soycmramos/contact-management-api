import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import pool from '../../database/pool.js'

const deleteContactById = async (req, res) => {
	const { params: { id }, meta } = req

	try {
		const { affectedRows } = await pool.query('DELETE FROM contacts WHERE id = ?', id)

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

		return res
			.status(StatusCodes.OK)
			.json({
				meta,
				status: 'success',
				title: ReasonPhrases.OK,
				code: StatusCodes.OK,
				message: 'Contact deleted successfully',
				data: null
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

export default deleteContactById
