// const express = require('express')
// const { status } = require('express/lib/response')
// const app = express()
// const port = 3000

// app.use(express.json())
// app.use(express.text())

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

// app.post('/entries', (req, res) => {
//     if (!req.is('text/plain') && !req.is('application/json')) {
//         res.sendStatus(400)
//     }
//     else res.send(req.body)
// })

// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })



const Enforcer = require('openapi-enforcer')
const EnforcerMiddleware = require('openapi-enforcer-middleware')
const express = require('express')
const path = require('path')

const app = express()

// Any paths defined in your openapi.yml will validate and parse the request
// before it calls your route code.
const openapiPath = path.resolve(__dirname, '../openapi.yaml')
const enforcerPromise = Enforcer(openapiPath)
const enforcerMiddleware = EnforcerMiddleware(enforcerPromise)

app.use(enforcerMiddleware.init({basePath: '/api'}))

  // Catch errors
  enforcerMiddleware.on('error', err => {
  console.error(err)
  process.exit(1)
}) 

app.use(enforcer.route({
  // The "users" is mapped to via the "x-controller" value.
  accounts: {
    // The "listUsers" is mapped to via the "x-operation" or "operationId" value.
    async createAccount (req, res) {
      const { rows } = dbClient.query('SELECT * FROM users')
      const users = rows.map(row => {
        return {
          id: row.id,
          name: row.name,
          email: row.email
        }
      })
      res.enforcer.send(users)
    }
  }
}))

app.use(enforcerMiddleware.mock())


// If your openapi.yml file defines this path then this path will only
// execute when the request is valid otherwise it will send back a 400
// with a message describing why the request was invalid.
app.get('/api/users/:userId', (req, res) => {
  // OLD WAY: get the userId as a string
  const userIdOldWay = req.params.userId  

  // BETTER WAY: get the userID as the type defined in your openapi.yml file
  const userId = req.enforcer.params.userId

  // ... do some processing

  // validate, serialize, and send a response that follows your openapi.yml file
  res.enforcer.send({
    userId,

    // The date object will serialize to the correct format, according to your
    // openapi.yml file.  Most likely this will be either the openapi format
    // `date` or `date-time`.
    birthDate: new Date('2000-01-01') 
  })
  
})
  
module.exports = app;
