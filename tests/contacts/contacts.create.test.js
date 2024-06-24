import { randomUUID } from 'node:crypto'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import request from 'supertest'
import { assert } from 'chai'
import app from '../../src/app.js'
import pool from '../../src/database/pool.js'

const id = randomUUID()
const name = 'Anna Kendrick'
const phone = '9876543210'

describe('PUT /contacts', () => {
	it(`should fail with status ${StatusCodes.NOT_ACCEPTABLE} if the "Accept" header is not sent or is invalid`, async () => {
		try {
			await request(app)
				.put('/contacts')
				.set('Content-Type', 'application/json')
				.set('Accept', 'xxx/xxx')
				.send(JSON.stringify({ id, name, phone }))
				.expect('Content-Type', /application\/json/)
				.expect(StatusCodes.NOT_ACCEPTABLE)
				.expect(res => {
					assert.exists(res.body)
					assert.isObject(res.body)
					assert.hasAllKeys(res.body, ['meta', 'status', 'title', 'code', 'message', 'data'])
					assert.isObject(res.body.meta)
					assert.hasAllKeys(res.body.meta, ['_timestamp', '_uuid', '_path'])
					assert.strictEqual(res.body.status, 'failure')
					assert.strictEqual(res.body.title, ReasonPhrases.NOT_ACCEPTABLE)
					assert.strictEqual(res.body.code, StatusCodes.NOT_ACCEPTABLE)
					assert.isNull(res.body.data)
				})
		} catch (error) {
			throw Error(error)
		}
	})

	it(`should fail with status ${StatusCodes.UNSUPPORTED_MEDIA_TYPE} if the "Content-Type" header is not sent or is invalid`, async () => {
		try {
			await request(app)
				.put('/contacts')
				.set('Content-Type', 'xxx/xxx')
				.set('Accept', 'application/json')
				.send(JSON.stringify({ id, name, phone }))
				.expect('Content-Type', /application\/json/)
				.expect(StatusCodes.UNSUPPORTED_MEDIA_TYPE)
				.expect(res => {
					assert.exists(res.body)
					assert.isObject(res.body)
					assert.hasAllKeys(res.body, ['meta', 'status', 'title', 'code', 'message', 'data'])
					assert.isObject(res.body.meta)
					assert.hasAllKeys(res.body.meta, ['_timestamp', '_uuid', '_path'])
					assert.strictEqual(res.body.status, 'failure')
					assert.strictEqual(res.body.title, ReasonPhrases.UNSUPPORTED_MEDIA_TYPE)
					assert.strictEqual(res.body.code, StatusCodes.UNSUPPORTED_MEDIA_TYPE)
					assert.isNull(res.body.data)
				})
		} catch (error) {
			throw Error(error)
		}
	})

	it(`should fail with status ${StatusCodes.BAD_REQUEST} if the request body is not sent or is invalid`, async () => {
		try {
			await request(app)
				.put('/contacts')
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.send(JSON.stringify({}))
				.expect('Content-Type', /application\/json/)
				.expect(StatusCodes.BAD_REQUEST)
				.expect(res => {
					assert.exists(res.body)
					assert.isObject(res.body)
					assert.hasAllKeys(res.body, ['meta', 'status', 'title', 'code', 'message', 'data'])
					assert.isObject(res.body.meta)
					assert.hasAllKeys(res.body.meta, ['_timestamp', '_uuid', '_path'])
					assert.strictEqual(res.body.status, 'failure')
					assert.strictEqual(res.body.title, ReasonPhrases.BAD_REQUEST)
					assert.strictEqual(res.body.code, StatusCodes.BAD_REQUEST)
					assert.isNull(res.body.data)
				})
		} catch (error) {
			throw Error(error)
		}
	})

	it(`should fail with status ${StatusCodes.BAD_REQUEST} if any required field is not submitted or empty`, async () => {
		try {
			await request(app)
				.put('/contacts')
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.send(JSON.stringify({ name, phone: '' }))
				.expect('Content-Type', /application\/json/)
				.expect(StatusCodes.BAD_REQUEST)
				.expect(res => {
					assert.exists(res.body)
					assert.isObject(res.body)
					assert.hasAllKeys(res.body, ['meta', 'status', 'title', 'code', 'message', 'data'])
					assert.isObject(res.body.meta)
					assert.hasAllKeys(res.body.meta, ['_timestamp', '_uuid', '_path'])
					assert.strictEqual(res.body.status, 'failure')
					assert.strictEqual(res.body.title, ReasonPhrases.BAD_REQUEST)
					assert.strictEqual(res.body.code, StatusCodes.BAD_REQUEST)
					assert.isNull(res.body.data)
				})
		} catch (error) {
			throw Error(error)
		}
	})

	it(`Should succeed with code ${StatusCodes.CREATED} if a new contact is created`, async () => {
		try {
			await pool.query('DELETE FROM contacts')
			await pool.query('INSERT INTO contacts (id, phone, name) VALUES (?, ?, ?)', [id, phone, name])
			await request(app)
				.put('/contacts')
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.send(JSON.stringify({ id, name, phone }))
				.expect('Content-Type', /application\/json/)
				.expect(StatusCodes.CREATED)
				.expect(res => {
					assert.exists(res.body)
					assert.isObject(res.body)
					assert.hasAllKeys(res.body, ['meta', 'status', 'title', 'code', 'message', 'data'])
					assert.isObject(res.body.meta)
					assert.hasAllKeys(res.body.meta, ['_timestamp', '_uuid', '_path'])
					assert.strictEqual(res.body.status, 'success')
					assert.strictEqual(res.body.title, ReasonPhrases.CREATED)
					assert.strictEqual(res.body.code, StatusCodes.CREATED)
					assert.isObject(res.body.data)
					assert.hasAllKeys(res.body.data, ['id', 'name', 'phone', 'createdAt'])
				})
		} catch (error) {
			throw Error(error)
		}
	})
})
