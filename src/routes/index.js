import { Router } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import contactsRoutes from './contacts/index.js'

const notFound = Router()
const health = Router()

health.head('/', (req, res) => res.sendStatus(StatusCodes.NO_CONTENT))

notFound.all('*', (req, res) => {
	const { meta } = req
	return res
		.status(StatusCodes.NOT_FOUND)
		.json({
			meta,
			status: 'failure',
			title: ReasonPhrases.NOT_FOUND,
			code: StatusCodes.NOT_FOUND,
			message: 'Path not found',
			data: null
		})
})

export { health, notFound, contactsRoutes }
