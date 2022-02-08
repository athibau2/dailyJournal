const expect = require('chai').expect
const app = require('../api/server')
const request = require('supertest')

describe('server', () => {

    describe('accounts', () => {

        it('can create an account', () => {
            return request(app)
                .post('/accounts')
                .send({
                    firstName: 'Andrew',
                    lastName: 'Thibaudeau',
                    email: 'a.thibs98@gmail.com',
                    password: 'a-password'
                })
                .expect(201)
        }),
        it('fails to create an account', () => {
            return request(app)
                .post('/accounts')
                .send({})
                .expect(400)
        }),
        it('can delete an account', () => {
            return request(app)
                .delete('/accounts/{userId}')
                .expect(204)
        }),
        it('fails to delete an account', () => {
            return request(app)
                .delete('/accounts/{userId}')
                .expect(204)
        }),
        it('can log a user in', () => {
            return request(app)
                .put('/accounts/{userId}/login')
                .send({
                    password: "a-password"
                })
                .expect(200)
        }),
        it('fails to log a user in', () => {
            return request(app)
                .put('/accounts/{userId}/login')
                .send({})
                .expect(400)
        }),
        it('can log a user out', () => {
            return request(app)
                .put('/accounts/{userId}/logout')
                .expect(200)
        }),
        it('can update a user\'s password', () => {
            return request(app)
                .put('/accounts/{userId}/settings')
                .send({
                    password: "new-password"
                })
                .expect(200)
        })
    }),

    describe('entries', () => {

        it('can submit a new entry', () => {
            return request(app)
                .post('/entries')
                .send({
                    text: "Become advanced in web development",
                    date: "2022-01-01T00:00:00.000Z"
                })
                .expect(201)
        }),
        it('fails to submit a new entry', () => {
            return request(app)
                .post('/entries')
                .send({
                    promptId: "ae5df8n432",
                    entryId: "001",
                    text: "",
                    date: "2022-01-01T00:00:00.000Z"
                })
                .expect(400)
        }),
        it('can delete an entry', () => {
            return request(app)
                .delete('/entries/{entryId}')
                .expect(204)
        }),
        it('fails to delete an entry', () => {
            return request(app)
                .delete('/entries/{entryId}')
                .expect(204)
        }),
        it('can update an entry', () => {
            return request(app)
                .put('/entries/{entryId}')
                .send({
                    text: "Have developed 3 personal project websites so that I can show employers my work."
                })
                .expect(200)
        }),
        it('can sort entries by topic', () => {
            return request(app)
                .get('/entries/?topic=future_goals')
                .expect('Content-Type', /json/)
                .expect(200)
        }),
        it('can sort entries by week', () => {
            return request(app)
                .get('/entries/?week=2022-01-01T00:00:00.000Z')
                .expect('Content-Type', /json/)
                .expect(200)
        }),
        it('can sort entries by month', () => {
            return request(app)
                .get('/entries/?month=2022-01-01T00:00:00.000Z')
                .expect('Content-Type', /json/)
                .expect(200)
        }),
        it('can sort entries by year', () => {
            return request(app)
                .get('/entries/?year=2022-01-01T00:00:00.000Z')
                .expect('Content-Type', /json/)
                .expect(200)
        })
    })
})
