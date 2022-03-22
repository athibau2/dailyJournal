const uuid = require('uuid').v4

exports.submit = async function (client, response, date, userid, promptid) {
    const entryid = uuid()
    const { rowCount } = await client.query({
        name: 'submit-entry',
        text: 'INSERT INTO entries (text, date, promptid, userid) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING RETURNING entryid',
        values: [
            response,
            date,
            promptid,
            userid,
        ]
    })
    return rowCount > 0 ? entryid : undefined
}