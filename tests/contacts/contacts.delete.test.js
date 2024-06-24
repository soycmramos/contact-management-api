import { randomUUID } from 'node:crypto'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import request from 'supertest'
import { assert } from 'chai'
import app from '../../src/app.js'
import pool from '../../src/database/pool.js'

const id = randomUUID()
const name = 'Anna Kendrick'
const phone = '9876543210'

describe('DELETE /contacts/:id', () => {
	it(`should fail with status ${StatusCodes.NOT_ACCEPTABLE} if the "Accept" header is not sent or is invalid`, async () => {
		try {
			await request(app)
				.delete(`/contacts/${id}`)
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
				.delete(`/contacts/${id}`)
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

	it(`should fail with status ${StatusCodes.NOT_FOUND} if the contact is not found`, async () => {
		try {
			await pool.query('DELETE FROM contacts')
			await request(app)
				.delete(`/contacts/${id}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.expect('Content-Type', /application\/json/)
				.expect(StatusCodes.NOT_FOUND)
				.expect(res => {
					assert.exists(res.body)
					assert.isObject(res.body)
					assert.hasAllKeys(res.body, ['meta', 'status', 'title', 'code', 'message', 'data'])
					assert.isObject(res.body.meta)
					assert.hasAllKeys(res.body.meta, ['_timestamp', '_uuid', '_path'])
					assert.strictEqual(res.body.status, 'failure')
					assert.strictEqual(res.body.title, ReasonPhrases.NOT_FOUND)
					assert.strictEqual(res.body.code, StatusCodes.NOT_FOUND)
					assert.isNull(res.body.data)
				})
		} catch (error) {
			throw Error(error)
		}
	})

	it(`should succeed with status ${StatusCodes.OK} if contact by ID was deleted`, async () => {
		try {
			await pool.query('DELETE FROM contacts')
			await pool.query('INSERT INTO contacts (id, name, phone) VALUES (?, ?, ?)', [id, name, phone])
			await request(app)
				.delete(`/contacts/${id}`)
				.set('Content-Type', 'application/json')
				.set('Accept', 'application/json')
				.expect('Content-Type', /application\/json/)
				.expect(StatusCodes.OK)
				.expect(res => {
					assert.exists(res.body)
					assert.isObject(res.body)
					assert.hasAllKeys(res.body, ['meta', 'status', 'title', 'code', 'message', 'data'])
					assert.isObject(res.body.meta)
					assert.hasAllKeys(res.body.meta, ['_timestamp', '_uuid', '_path'])
					assert.strictEqual(res.body.status, 'success')
					assert.strictEqual(res.body.title, ReasonPhrases.OK)
					assert.strictEqual(res.body.code, StatusCodes.OK)
					assert.isNull(res.body.data)
				})
		} catch (error) {
			throw Error(error)
		}
	})
})
