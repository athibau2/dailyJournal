const entries = require('../database/entries')

module.exports = function (pool) {
    return {
        async submitEntry (req, res) {
            const { response, date, userid, promptid } = req.enforcer.body
            const entryid = await entries.submit(pool, response, date, userid, promptid)
			if (entryid) {
				res.set('location', '/api/journal/' + entryid)
					.enforcer
					.status(201)
					.send()
			} else {
				res.enforcer.status(409).send()
			}
        },

        async getEntries (req, res) {

        },
        
        async updateEntry (req, res) {

        },
        
        async deleteEntry (req, res) {

        },
        
    }
}