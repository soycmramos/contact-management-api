import { randomUUID } from 'node:crypto'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import request from 'supertest'
import { assert } from 'chai'
import app from '../../src/app.js'
import pool from '../../src/database/pool.js'

const id = randomUUID()
const name = 'Anna Kendrick'
const phone = '9876543210'

describe('GET /contacts', () => {
	it(`should fail with status ${StatusCodes.NOT_FOUND} and an empty list if there are no contacts`, async () => {
		try {
			await pool.query('DELETE FROM contacts')
			await request(app)
				.get('/contacts')
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
					assert.isArray(res.body.data)
					assert.isEmpty(res.body.data)
				})
		} catch (error) {
			throw Error(error)
		}
	})

	it(`should succeed with status ${StatusCodes.OK} and a list of at least one contact`, async () => {
		try {
			await pool.query('DELETE FROM contacts')
			await pool.query('INSERT INTO contacts (id, phone, name) VALUES (?, ?, ?)', [id, phone, name])
			await request(app)
				.get('/contacts')
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
					assert.isArray(res.body.data)
					assert.isNotEmpty(res.body.data)
				})
		} catch (error) {
			throw Error(error)
		}
	})
})

describe('GET /contacts/:id', () => {
	it(`should fail with status ${StatusCodes.NOT_FOUND} if the contact does not exist`, async () => {
		try {
			await pool.query('DELETE FROM contacts')
			await request(app)
				.get(`/contacts/${id}`)
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

	it(`should succeed with status ${StatusCodes.OK} and the contact requested by ID `, async () => {
		try {
			await pool.query('DELETE FROM contacts')
			await pool.query('INSERT INTO contacts (id, phone, name) VALUES (?, ?, ?)', [id, phone, name])
			await request(app)
				.get(`/contacts/${id}`)
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
					assert.isObject(res.body.data)
					assert.hasAllKeys(res.body.data, ['id', 'name', 'phone', 'createdAt'])
				})
		} catch (error) {
			throw Error(error)
		}
	})
})
