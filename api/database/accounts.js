const bcrypt = require('bcryptjs')
const uuid = require('uuid').v4

async function encryptPassword (password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

exports.getAccount = async function (client, userid) {
    const { rows } = await client.query({
        name: 'get-account-by-id',
        text: 'SELECT * FROM accounts WHERE userid=$1',
        values: [userid]
    })
    return rows[0]
}

exports.getAccountByUsername = async function (client, username) {
    const { rows } = await client.query({
        name: 'get-account-by-username',
        text: 'SELECT * FROM accounts WHERE username=$1',
        values: [username]
    })
    return rows[0]
}

exports.createAccount = async function (client, firstname, lastname, username, password) {
    const userid = uuid()
    const { rowCount } = await client.query({
        name: 'create-account',
        text: 'INSERT INTO accounts (firstname, lastname, username, password) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        values: [
            firstname,
            lastname,
            username,
            await encryptPassword(password)
        ]
    })
    return rowCount > 0 ? userid : undefined
}

exports.updatePassword = async function (client, username, userid, data) {
    // create dynamic query based on inputs
    const { password } = data
    const values = []
    const sets = []

    // if (username !== undefined) {
    //     values.push(username)
    //     sets.push('username=$' + values.length)
    // }

    if (password !== undefined) {
        values.push(await encryptPassword(password))
        sets.push('password=$' + values.length)
    }

    // if no properties were passed in then there is nothing to update
    if (values.length === 0) return await exports.getAccount(client, userid)

    values.push(userid)
    const { rows } = await client.query({
        name: 'update-password',
        text: 'UPDATE accounts SET ' + sets.join(', ') + ' WHERE userid=$' + (values.length) + ' RETURNING *',
        values
    })
    return rows[0]
}

exports.deleteAccount = async function (client, userid) {
    const { rowCount } = client.query({
        name: 'delete-account',
        text: 'DELETE FROM accounts WHERE userid=$1',
        values: [userid]
    })
    return rowCount > 0
}