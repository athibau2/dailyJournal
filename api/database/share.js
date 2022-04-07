exports.search = async function (client, searchText) {
    searchText = `${searchText}%`
    const { rowCount, rows } = await client.query({
        name: 'search-to-share',
        text: 'SELECT a.firstname, a.lastname, a.username, a.userid FROM accounts a WHERE a.username LIKE $1',
        values: [searchText]
    })
    return rowCount > 0 ? rows : undefined
}

exports.getSharedList = async function (client, entryid) {
    const { rowCount, rows } = await client.query({
        name: 'get-shared-list',
        text: 'SELECT a.username, s.entryid, s.userid FROM accounts a INNER JOIN shared_entries s ON a.userid = s.userid WHERE s.entryid = $1 ORDER BY a.username ASC',
        values: [entryid]
    })
    return rowCount > 0 ? rows : undefined
}

exports.shareEntry = async function (client, entryid, userid) {
    const { rowCount } = await client.query({
        name: 'share-entry',
        text: 'INSERT INTO shared_entries VALUES($1, $2) ON CONFLICT DO NOTHING RETURNING *',
        values: [
            entryid,
            userid
        ]
    })
    return rowCount > 0 ? rowCount : undefined
}

exports.unshareEntry = async function (client, entryid, userid) {
    const { rowCount } = await client.query({
        name: 'unshare-entry',
        text:'DELETE FROM shared_entries WHERE entryid = $1 AND userid = $2 RETURNING *',
        values: [
            entryid,
            userid
        ]
    })
    return rowCount > 0 ? rowCount : undefined
}
