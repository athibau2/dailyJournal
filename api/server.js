require('dotenv').config()

const Enforcer = require('openapi-enforcer')
const EnforcerMiddleware = require('openapi-enforcer-middleware')
const express = require('express')
const { Pool } = require('pg')
const path = require('path')
const Accounts = require('./controller/accounts')
const Entries = require('./controller/entries')
const Authentication = require('./controller/authentication')
const Prompts = require('./controller/prompts')
const Topics = require('./controller/topics')
const Share = require('./controller/share')
const Notifications = require('./controller/notifications')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oidc');
const session = require('express-session')
const DatabaseAccounts = require('./database/accounts')
const ConnectPgSimple = require('connect-pg-simple')(session)
const cron = require('node-cron');
const sgMail = require('@sendgrid/mail')


// Establish database connection
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: +process.env.POSTGRES_PORT
})

// test that we can connect to the database
pool.query('SELECT NOW()', (err, res) => {
	if (err) {
		console.error(err)
		process.exit(1)
	} else {
		console.log('Database connected', res)
	}
})

// run cron job for daily email reminders
cron.schedule(`0 0 0 * * *`, () => {
	console.log('Task runs every day at midnight to schedule email reminders')
	pool.query('SELECT * FROM accounts', (err, res) => {
		if (err) {
			console.error(err)
			process.exit(1)
		} else {
			for (let i = 0; i < res.rowCount; ++i) {
				let time = res.rows[i].notif_time
				time = time.split(' ')
				time = time[0].split(':')
				let year = new Date().getFullYear()
				let month = new Date().getMonth()
				let date = new Date().getDate()
				let day = new Date().getDay()
				let hour = time[0]
				let min = time[1]
				month += 1
				// let ts = Math.round((new Date(Date.UTC(year, month, date, hour, min, 0, 0)).getTime() / 1000))

				let task = cron.schedule(`0 ${min} ${hour} ${date} ${month} ${day}`, () => {
					sgMail.setApiKey(process.env.SENDGRID_API_KEY)
						const msg = {
							template_id: 'd-69856f01088a4338b11c72c497970a14',
							to: res.rows[i].username, //res.rows[i].username
							from: {
								name: 'Write Now',
								email: 'thibaudeauapps@gmail.com',
							},
							// send_at: ts,
						}
						sgMail.send(msg).then(() => {
							  console.log('Email sent')
							}).catch((error) => {
							  console.error(error)
							})
				}, {
					timezone: "America/Denver" // Intl.DateTimeFormat().resolvedOptions().timeZone
				})
				task.start()
			}
		}
	})
}, {
	timezone: "America/Denver" // Intl.DateTimeFormat().resolvedOptions().timeZone
});


// set up passport local strategy
passport.use(new LocalStrategy((username, password, done) => {
	const type = password.split('===')[0]
	const pass = password.split('===')[1]
	DatabaseAccounts.getAccountByUsername(pool, username)
		.then(async account => {
			console.log(account)
			if (account === undefined && type === 'writenow') {
				done(null, false)
			} else {
				// compare encrypted password
				const match = await bcrypt.compare(pass, account.password.writenow)
				if (match) {
					// passwords matched, so create the user object
					done(null, { id: account.userid, username: account.username, firstname: account.firstname, lastname: account.lastname, type: type })
				} else {
					const hash = await bcrypt.hash(pass, 10)
					const m2 = await bcrypt.compare(pass, hash)
					// passwords did not match
					done(null, false)
				}
			}
		})
		.catch(e => done(e, null))
}))


// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: 'http://localhost:3001/oauth2/redirect/google'
//   },
//   function(issuer, profile, cb) {
// 	console.log('1')
// 	pool.query('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
// 		issuer,
// 		profile.id
// 	], async (err, res) => {
// 		if (err) {
// 			console.error(err)
// 			return cb(err)
// 			process.exit(1)
// 		}
// 		if (!res) {
// 			const salt = await bcrypt.genSalt(10)
// 			const pass = {
// 				google: await bcrypt.hash('google', salt)
// 			}
// 			// The Google account has not logged in to this app before.  Create a
//         	// new user record and link it to the Google account.
// 			pool.query('INSERT INTO accounts (firstname, lastname, username, password) VALUES (?, ?, ?, ?)', [
// 				profile.name.givenName,
// 				profile.name.familyName,
// 				profile.emails[0].value,
// 				pass,
// 			  ], function(err) {
// 				if (err) { return cb(err); }
	  
// 				var id = this.lastID;
// 				pool.query('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
// 				  id,
// 				  issuer,
// 				  profile.id
// 				], function(err) {
// 				  if (err) { return cb(err); }
// 				  var user = {
// 					id: id.toString(),
// 					name: profile.displayName
// 				  };
// 				  return cb(null, user);
// 				});
// 			  });
// 		}
// 	})
//     db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
//       issuer,
//       profile.id
//     ], async function(err, cred) {
//       if (err) { return cb(err); }
//       if (!cred) {
// 		const salt = await bcrypt.genSalt(10)
//     	const pass = {
// 			google: await bcrypt.hash('google', salt)
// 		}
//         // The Google account has not logged in to this app before.  Create a
//         // new user record and link it to the Google account.
//         // db.run('INSERT INTO users (firstname, lastname, username, password) VALUES (?, ?, ?, ?)', [
//         //   profile.name.givenName,
// 		//   profile.name.familyName,
// 		//   profile.emails[0].value,
// 		//   pass,
//         // ], function(err) {
//         //   if (err) { return cb(err); }

//         //   var id = this.lastID;
//         //   db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
//         //     id,
//         //     issuer,
//         //     profile.id
//         //   ], function(err) {
//         //     if (err) { return cb(err); }
//         //     var user = {
//         //       id: id.toString(),
//         //       name: profile.displayName
//         //     };
//         //     return cb(null, user);
//         //   });
//         // });
//       } else {
//         // The Google account has previously logged in to the app.  Get the
//         // user record linked to the Google account and log the user in.
//         db.get('SELECT * FROM users WHERE id = ?', [ cred.user_id ], function(err, user) {
//           if (err) { return cb(err); }
//           if (!user) { return cb(null, false); }
//           return cb(null, user);
//         });
//       }
//     });
//   }
// ));


passport.serializeUser((user, done) => {
	done(null, JSON.stringify(user))
})

passport.deserializeUser((id, done) => {
	done(null, JSON.parse(id))
})

const app = express()

// Any paths defined in your openapi.yml will validate and parse the request
// before it calls your route code.
const openapiPath = path.resolve(__dirname, 'openapi.yaml')
const enforcerPromise = Enforcer(openapiPath, {hideWarnings: true})
const enforcerMiddleware = EnforcerMiddleware(enforcerPromise)

app.use(express.json())

app.use(function(req, res, next) {
	console.log(req.method + ' ' + req.path)
	next()
})

app.use(enforcerMiddleware.init({baseUrl: '/api'}))

// Catch errors
enforcerMiddleware.on('error', err => {
  console.error(err)
  process.exit(1)
})

app.use(session({
	store: new ConnectPgSimple({
		pool
	}),
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 2592000000 // 30 days, written in milliseconds
	}
}))

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
	const { operation } = req.enforcer
	if (operation.security !== undefined) {
		const sessionIsRequired = operation.security.find(obj => obj.cookieAuth !== undefined)
		if (sessionIsRequired && !req.user) {
			res.sendStatus(401)
			return
		}
	}
	next()
})

app.use(enforcerMiddleware.route({
	accounts: Accounts(pool),
	authentication: Authentication(passport),
	entries: Entries(pool),
	prompts: Prompts(pool),
	topics: Topics(pool),
	share: Share(pool),
	notifications: Notifications(pool),
}))

// fallback mocking middleware
//app.use(enforcerMiddleware.mock())

module.exports = app;
