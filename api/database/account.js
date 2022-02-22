const bcrypt = require('bcryptjs')
const uuid = require('uuid').v4

exports.createAccount = async function (client, firstName, lastName, email, password) {
    const userId = uuid()
    const salt = await bcrypt.genSalt(10)
    const { rowCount } = await client.query({
        name: 'create-account',
        text: 'INSERT INTO accounts (firstName, lastName, email, password) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        values: [
            firstName,
            lastName,
            email,
            await bcrypt.hash(password, salt)	
        ]
    })
    return rowCount > 0 ? userId : undefined
}

exports.getAccount = async function (client, userId) {
    const { rows } = await client.query({
        name: 'get-account-by-id',
        text: 'SELECT * FROM accounts WHERE userId=$1',
        values: [userId]
    })
    return rows[0]
}

exports.updateAccount = async  function (client, userId, data) {
    // create dynamic query based on inputs
    const { email, password } = data
    const values = []
    const sets = []

    if (email !== undefined) {
        values.push(email)
        sets.push('email=$' + values.length)
    }

    if (password !== undefined) {
        values.push(password)
        sets.push('password=$' + values.length)
    }

    // if no properties were passed in then there is nothing to update
    if (values.length === 0) return await exports.getAccount(client, userId)

    values.push(userId)
    const { rows } = client.query({
        name: 'update-account',
        text: 'UPDATE accounts SET ' + sets.join(', ') + ' WHERE userId=$' + (values.length) + ' RETURNING *',
        values
    })
    return rows[0]
}

exports.deleteAccount = async function (client, userId) {
    const { rowCount } = client.query({
        name: 'delete-account',
        text: 'DELETE FROM accounts WHERE userId=$1',
        values: [userId]
    })
    return rowCount > 0
}