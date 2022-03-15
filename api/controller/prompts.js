const prompts = require('../database/prompts')
const accounts = require('../database/accounts')
const { cli } = require('webpack')

module.exports = function (pool) {
    return {
        async getPrompt (req, res) {
            const prompt = await prompts.getPrompt(pool)
            if (prompt) {
                res.enforcer.status(200).send()
            }
        },
    }
}
