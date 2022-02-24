const accounts = require('../database/accounts')

module.exports = function (pool) {
	return {
		async createAccount (req, res) {
			const { firstname, lastname, email, password } = req.enforcer.body
			const userid = await accounts.createAccount(pool, firstname, lastname, email, password)
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
			const data = req.enforcer.body
			const { userid } = req.enforcer.params

			const client = await pool.connect()
			try {
				await client.query('BEGIN')
				let account = await accounts.getAccount(client, userid)
				if (account === undefined) {
					res.enforcer.status(404).send()
				} else {
					await accounts.updatePassword(client, userid, data)
					res.enforcer.status(200).send()
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
			await accounts.deleteAccount(pool, userid)
			res.enforcer.status(204).send()
		},

		async login (req, res) {

		},

		async logout (req, res) {

		}
	}
}