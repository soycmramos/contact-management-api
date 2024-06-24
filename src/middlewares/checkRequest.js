import { ReasonPhrases, StatusCodes } from 'http-status-codes'

const checkHeaders = (req, res, next) => {
	const { headers, meta } = req
	const accept = headers['accept']
	const contentType = headers['content-type']

	if (!accept || accept !== 'application/json') {
		return res
			.status(StatusCodes.NOT_ACCEPTABLE)
			.json({
				meta,
				status: 'failure',
				code: StatusCodes.NOT_ACCEPTABLE,
				title: ReasonPhrases.NOT_ACCEPTABLE,
				message: 'Media type required is not accetable',
				data: null
			})
	}

	if (!contentType || contentType !== 'application/json') {
		return res
			.status(StatusCodes.UNSUPPORTED_MEDIA_TYPE)
			.json({
				meta,
				status: 'failure',
				code: StatusCodes.UNSUPPORTED_MEDIA_TYPE,
				title: ReasonPhrases.UNSUPPORTED_MEDIA_TYPE,
				message: 'Media type submitted is not supported',
				data: null
			})
	}

	return next()
}

const checkBody = (req, res, next) => {
	const { body, meta } = req

	if (!Object.keys(body).length) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({
				meta,
				status: 'failure',
				code: StatusCodes.BAD_REQUEST,
				title: ReasonPhrases.BAD_REQUEST,
				message: 'Request body not found',
				data: null
			})

	}
	return next()
}

export { checkHeaders, checkBody }
