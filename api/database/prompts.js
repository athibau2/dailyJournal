exports.getPrompt = async function (client) {
    const { rows } = await client.query({
        name: 'get-random-prompt',
        text: 'SELECT p.promptid, p.prompttext, p.topicid, t.topictext FROM prompts p INNER JOIN topics t ON p.topicid = t.topicid LIMIT 1 OFFSET FLOOR(random() * (SELECT COUNT(*) FROM PROMPTS));',
    })
    return rows[0]
}