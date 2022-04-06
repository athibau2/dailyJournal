const accounts = require('../database/accounts')
const bcrypt = require('bcryptjs')

module.exports = function (pool) {
	return {
		async createAccount (req, res) {
			const { firstname, lastname, username, password } = req.enforcer.body
			const userid = await accounts.createAccount(pool, firstname, lastname, username, password)
			if (userid) {
				res.set('location', '/api/accounts/' + userid)
					.enforcer
					.status(201)
					.send()
			} else {
				res.enforcer.status(409).send()
			}
		},

		async updatePassword (req, res) {
			const { currentPass, newPass } = req.enforcer.body
			const { username } = req.enforcer.params

			const client = await pool.connect()
			try {
				await client.query('BEGIN')
				let account = await accounts.getAccountByUsername(client, username)
				if (account === undefined) {
					res.enforcer.status(404).send()
				} else if (account.userid !== req.user.id) {
					res.enforcer.status(403).send()
				} else {
					const match = await bcrypt.compare(currentPass, account.password)
					if (match) {
						await accounts.updatePassword(client, username, newPass)
						res.enforcer.status(200).send()
					} else {
						res.enforcer.status(401).send()
					}
				}
				await client.query('COMMIT')
			} catch (e) {
				await client.query('ROLLBACK')
				throw e
			} finally {
				client.release()
			}
		},

		async deleteAccount (req, res) {
			const { userid } = req.enforcer.params
			const client = await pool.connect()
			try {
				await client.query('BEGIN')
				let account = await accounts.getAccount(client, userid)
				if (account === undefined) {
					res.enforcer.status(204).send()
				} else if (account.userid != userid) {
					res.enforcer.status(403).send()
				} else if (account.userid == userid) {
					await accounts.deleteAccount(pool, account.userid)
					res.enforcer.status(204).send()
				} else {
					res.enforcer.status(400).send()
				}
				await client.query('COMMIT')
			} catch (e) {
				await client.query('ROLLBACK')
				throw e
			} finally {
				client.release()
			}
		},
	}
}