const expect = require('chai').expect
const app = require('../api/server')
const request = require('supertest')

describe('server', () => {

    describe('accounts', () => {
        it('can create an account', () => {
            // The supertest request function returns a promise.
            // Remember that one way to run asynchronous tests
            // is to return a promise.
            return request(app)
                .post('/accounts')
                .send({
                    firstName: 'Andrew',
                    lastName: 'Thibaudeau',
                    email: 'a.thibs98@gmail.com',
                    password: 'a-password'
                })
                .expect(201)
                .catch(err => done(err))
        }),
        it('can delete an account', () => {
            return request(app)
                .delete('/accounts/{userId}')
                .expect(204)
                .catch(err => done(err))
        }),
        it('can log a user in', () => {
            return request(app)
                .put('/accounts/{userId}/login')
                .send({
                    password: "a-password"
                })
                .expect(200)
                .catch(err => done(err))
        }),
        it('can log a user out', () => {
            return request(app)
                .put('/accounts/{userId}/logout')
                .expect(200)
                .catch(err => done(err))
        }),
        it('can update a user\'s password', () => {
            return request(app)
                .put('/accounts/{userId}/settings')
                .send({
                    password: "new-password"
                })
                .expect(200)
                .catch(err => done(err))
        })
    })

    describe('entries', () => {

        it('can submit a new entry', () => {
            return request(app)
                .post('/entries')
                .send({
                    promptId: "ae5df8n432",
                    entryId: "001",
                    text: "Become advanced in web development",
                    date: "02/02/2022"
                })
                .expect(201)
                .catch(err => done(err))
        }),
        it('can delete an entry', () => {
            return request(app)
                .delete('/entries/{entryId}')
                .expect(204)
                .catch(err => done(err))
        }),
        it('can update an entry', () => {
            return request(app)
                .put('/entries/{entryId}')
                .send({
                    text: "Have developed 3 personal project websites so that I can show employers my work."
                })
                .expect(201)
                .catch(err => done(err))
        }),
        it('can sort entries by topic', () => {
            return request(app)
                .get('/entries/?topic=')
                .expect('Content-Type', /json/)
                .expect(200
                    [
                        {
                            "prompt": "What is one thing you hope to accomplish within the next year and why?",
                            "promptId": "ae5df8n432",
                            "topic": "future goals",
                            "entryId": "001",
                            "text": "Have developed 3 personal project websites so that I can show employers my work.",
                            "date": "01/11/2022",
                        },
                        {
                            "prompt": "What is one value do you hope your future family will have?",
                            "promptId": "dk8ei3a239",
                            "topic": "future goals",
                            "entryId": "002",
                            "text": "I want my family to treat other people with respect and be kind.",
                            "date": "01/12/2022",
                        }
                    ])
                .catch(err => done(err))
        }),
        it('can sort entries by week', () => {
            return request(app)
                .get('/entries/?week=')
                .expect('Content-Type', /json/)
                .expect(200)
                .catch(err => done(err))
        }),
        it('can sort entries by month', () => {
            return request(app)
                .get('/entries/?month=')
                .expect('Content-Type', /json/)
                .expect(200)
                .catch(err => done(err))
        }),
        it('can sort entries by year', () => {
            return request(app)
                .get('/entries/?year=')
                .expect('Content-Type', /json/)
                .expect(200)
                .catch(err => done(err))
        })
    })
})
