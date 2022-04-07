const share = require('../database/share')

module.exports = function (pool) {
    return {
        async search (req, res) {
            const searchText = req.enforcer.query.searchtext
            const entryid = req.enforcer.query.entryid
            if (searchText !== undefined) {
                const results = await share.search(pool, searchText)
                if (results !== undefined) {
                    res.enforcer.status(200).send(results)
                } else {
                    res.enforcer.status(404).send()
                }
            }
            else if (entryid !== undefined) {
                const results = await share.getSharedList(pool, entryid)
                if (results !== undefined) {
                    res.enforcer.status(200).send(results)
                } else {
                    res.enforcer.status(404).send()
                }
            }
        },

        async shareEntry(req, res) {
            const { entryid, userid } = req.enforcer.body
            const count = await share.shareEntry(pool, entryid, userid)
            if (count !== undefined) {
                res.enforcer.status(201).send()
            } else {
                res.enforcer.status(400).send()
            }
        },

        async unshareEntry(req, res) {
            const { entryid, userid } = req.enforcer.params
            const count = await share.unshareEntry(pool, entryid, userid)
            if (count !== undefined) {
                res.enforcer.status(204).send()
            } else {
                res.enforcer.status(400).send()
            }
        }
    }
}