exports.submit = async function (client, response, date, userid, promptid) {
    const { rowCount, rows } = await client.query({
        name: 'submit-entry',
        text: 'INSERT INTO entries (text, date, promptid, userid) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING RETURNING *',
        values: [
            response,
            date,
            promptid,
            userid,
        ],
    })
    return rowCount > 0 ? rows[0] : undefined
}

exports.getToday = async function (client, today, userid) {
    const { rowCount, rows } = await client.query({
        name: 'get-entry-today',
        text: 'SELECT * FROM entries e INNER JOIN prompts p ON e.promptid = p.promptid INNER JOIN topics t ON p.topicid = t.topicid WHERE date=$1 AND userid=$2',
        values: [
            today,
            userid
        ]
    })
    return rowCount > 0 ? rows : undefined
}

exports.filterDate = async function (client, afterDate, userid) {
    const { rowCount, rows } = await client.query({
        name: 'filter-by-date',
        text: 'SELECT * FROM entries e INNER JOIN prompts p ON e.promptid = p.promptid INNER JOIN topics t ON p.topicid = t.topicid WHERE e.date >= $1 AND e.userid=$2',
        values: [
            afterDate,
            userid
        ]
    })
    return rowCount > 0 ? rows : undefined
}

exports.filterTopic = async function (client, topicid, userid) {
    const { rowCount, rows } = await client.query({
        name: 'filter-by-topic',
        text: 'SELECT * FROM entries e INNER JOIN prompts p ON e.promptid = p.promptid INNER JOIN topics t ON p.topicid = t.topicid WHERE t.topicid=$1 AND e.userid=$2',
        values: [
            topicid,
            userid
        ]
    })
    return rowCount > 0 ? rows : undefined
}
