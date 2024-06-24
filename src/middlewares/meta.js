import { randomUUID } from 'node:crypto'

const meta = (req, res, next) => {
	req.meta = {
		_timestamp: Math.floor(Date.now() / 1000),
		_uuid: randomUUID(),
		_path: req.url
	}

	return next()
}

export default meta
