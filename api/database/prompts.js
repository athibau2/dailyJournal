exports.getPrompt = async function (client) {
    const { rows } = await client.query({
        name: 'get-random-prompt',
        text: 'SELECT * FROM prompts LIMIT 1 OFFSET FLOOR(random() * (SELECT COUNT(*) FROM PROMPTS))',
    })
    return rows[0]
}