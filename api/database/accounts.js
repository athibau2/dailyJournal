const bcrypt = require('bcryptjs')
const uuid = require('uuid').v4

exports.createAccount = async function (client, firstname, lastname, email, password) {
    const userid = uuid()
    const salt = await bcrypt.genSalt(10)
    const { rowCount } = await client.query({
        name: 'create-account',
        text: 'INSERT INTO accounts (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        values: [
            firstname,
            lastname,
            email,
            await bcrypt.hash(password, salt)
        ]
    })
    return rowCount > 0 ? userid : undefined
}

exports.getAccount = async function (client, userid) {
    const { rows } = await client.query({
        name: 'get-account-by-id',
        text: 'SELECT * FROM accounts WHERE userid=$1',
        values: [userid]
    })
    return rows[0]
}

exports.updatePassword = async function (client, userid, data) {
    // create dynamic query based on inputs
    const { email, password } = data
    const values = []
    const sets = []
    const salt = await bcrypt.genSalt(10)


    if (email !== undefined) {
        values.push(email)
        sets.push('email=$' + values.length)
    }

    if (password !== undefined) {
        values.push(await bcrypt.hash(password, salt))
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