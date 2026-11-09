// Shared Views, Reactions & Active Viewer Heartbeat Lambda Handler
// Used by aaforbaldmen.com, aazoomforbaldmen.com, and felinetherapistforbaldmen.com
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SID_RE = /^[a-f0-9-]{8,64}$/i;
function respond(statusCode, body) {
    return {
        statusCode,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    };
}
export function createDailyViewsHandler(config = {}) {
    const TABLE = config.tableName || process.env.TABLE_NAME || 'daily-views';
    const HEARTBEAT_TTL_SECONDS = config.heartbeatTtlSeconds ?? 90;
    let ddbPromise = null;
    async function getDdb() {
        if (!ddbPromise) {
            ddbPromise = (async () => {
                const clientMod = await import('@aws-sdk/client-dynamodb');
                const libMod = await import('@aws-sdk/lib-dynamodb');
                const client = new clientMod.DynamoDBClient({});
                return {
                    ddb: libMod.DynamoDBDocumentClient.from(client),
                    ...libMod,
                };
            })();
        }
        return ddbPromise;
    }
    async function handleView(date, sid) {
        const { ddb, UpdateCommand, PutCommand } = await getDdb();
        const now = Math.floor(Date.now() / 1000);
        await ddb.send(new UpdateCommand({
            TableName: TABLE,
            Key: { pk: 'VIEWS', sk: date },
            UpdateExpression: 'ADD #v :inc',
            ExpressionAttributeNames: { '#v': 'views' },
            ExpressionAttributeValues: { ':inc': 1 },
        }));
        await ddb.send(new UpdateCommand({
            TableName: TABLE,
            Key: { pk: 'VIEWS', sk: 'TOTAL' },
            UpdateExpression: 'ADD #v :inc',
            ExpressionAttributeNames: { '#v': 'views' },
            ExpressionAttributeValues: { ':inc': 1 },
        }));
        await ddb.send(new PutCommand({
            TableName: TABLE,
            Item: {
                pk: `ACTIVE#${date}`,
                sk: sid,
                ttl: now + HEARTBEAT_TTL_SECONDS,
            },
        }));
    }
    async function handleHeartbeat(date, sid) {
        const { ddb, PutCommand } = await getDdb();
        const now = Math.floor(Date.now() / 1000);
        await ddb.send(new PutCommand({
            TableName: TABLE,
            Item: {
                pk: `ACTIVE#${date}`,
                sk: sid,
                ttl: now + HEARTBEAT_TTL_SECONDS,
            },
        }));
    }
    async function handleStats(date) {
        const { ddb, GetCommand, QueryCommand } = await getDdb();
        const now = Math.floor(Date.now() / 1000);
        const [dayResult, totalResult, activeResult] = await Promise.all([
            ddb.send(new GetCommand({ TableName: TABLE, Key: { pk: 'VIEWS', sk: date } })),
            ddb.send(new GetCommand({ TableName: TABLE, Key: { pk: 'VIEWS', sk: 'TOTAL' } })),
            ddb.send(new QueryCommand({
                TableName: TABLE,
                KeyConditionExpression: 'pk = :pk',
                FilterExpression: '#t > :now',
                ExpressionAttributeNames: { '#t': 'ttl' },
                ExpressionAttributeValues: { ':pk': `ACTIVE#${date}`, ':now': now },
                Select: 'COUNT',
            })),
        ]);
        return {
            dayViews: dayResult.Item?.views || 0,
            totalViews: totalResult.Item?.views || 0,
            activeViewers: activeResult.Count || 0,
        };
    }
    async function getReactionCounts(date) {
        const { ddb, GetCommand } = await getDdb();
        const [upResult, downResult] = await Promise.all([
            ddb.send(new GetCommand({ TableName: TABLE, Key: { pk: 'REACT_COUNT', sk: `${date}#up` } })),
            ddb.send(new GetCommand({ TableName: TABLE, Key: { pk: 'REACT_COUNT', sk: `${date}#down` } })),
        ]);
        return {
            thumbsUp: upResult.Item?.count || 0,
            thumbsDown: downResult.Item?.count || 0,
        };
    }
    async function handleGetReactions(date, sid) {
        const { ddb, GetCommand } = await getDdb();
        const [counts, userResult] = await Promise.all([
            getReactionCounts(date),
            ddb.send(new GetCommand({ TableName: TABLE, Key: { pk: `REACT#${date}`, sk: sid } })),
        ]);
        return {
            ...counts,
            userReaction: userResult.Item?.reaction || null,
        };
    }
    async function handleReact(date, sid, reaction) {
        const { ddb, GetCommand, UpdateCommand, PutCommand, DeleteCommand } = await getDdb();
        const existing = await ddb.send(new GetCommand({
            TableName: TABLE,
            Key: { pk: `REACT#${date}`, sk: sid },
        }));
        const oldReaction = existing.Item?.reaction || null;
        if (oldReaction === reaction)
            return handleGetReactions(date, sid);
        const ops = [];
        if (oldReaction) {
            ops.push(ddb.send(new UpdateCommand({
                TableName: TABLE,
                Key: { pk: 'REACT_COUNT', sk: `${date}#${oldReaction}` },
                UpdateExpression: 'ADD #c :dec',
                ExpressionAttributeNames: { '#c': 'count' },
                ExpressionAttributeValues: { ':dec': -1 },
            })));
        }
        if (reaction) {
            ops.push(ddb.send(new UpdateCommand({
                TableName: TABLE,
                Key: { pk: 'REACT_COUNT', sk: `${date}#${reaction}` },
                UpdateExpression: 'ADD #c :inc',
                ExpressionAttributeNames: { '#c': 'count' },
                ExpressionAttributeValues: { ':inc': 1 },
            })));
            ops.push(ddb.send(new PutCommand({
                TableName: TABLE,
                Item: { pk: `REACT#${date}`, sk: sid, reaction },
            })));
        }
        else {
            ops.push(ddb.send(new DeleteCommand({
                TableName: TABLE,
                Key: { pk: `REACT#${date}`, sk: sid },
            })));
        }
        await Promise.all(ops);
        return handleGetReactions(date, sid);
    }
    return async function handler(event) {
        const method = event.requestContext?.http?.method || 'GET';
        const reqPath = event.rawPath || '/';
        if (method === 'OPTIONS')
            return { statusCode: 204, headers: {}, body: '' };
        try {
            if (method === 'POST' && reqPath === '/view') {
                const body = JSON.parse(event.body || '{}');
                if (!body.date || !DATE_RE.test(body.date))
                    return respond(400, { error: 'Invalid date' });
                if (!body.sid || !SID_RE.test(body.sid))
                    return respond(400, { error: 'Invalid session' });
                await handleView(body.date, body.sid);
                return respond(200, { ok: true });
            }
            if (method === 'GET' && reqPath === '/stats') {
                const date = event.queryStringParameters?.date;
                if (!date || !DATE_RE.test(date))
                    return respond(400, { error: 'Invalid date' });
                return respond(200, await handleStats(date));
            }
            if (method === 'POST' && reqPath === '/heartbeat') {
                const body = JSON.parse(event.body || '{}');
                if (!body.date || !DATE_RE.test(body.date))
                    return respond(400, { error: 'Invalid date' });
                if (!body.sid || !SID_RE.test(body.sid))
                    return respond(400, { error: 'Invalid session' });
                await handleHeartbeat(body.date, body.sid);
                return respond(200, { ok: true });
            }
            if (method === 'POST' && reqPath === '/react') {
                const body = JSON.parse(event.body || '{}');
                if (!body.date || !DATE_RE.test(body.date))
                    return respond(400, { error: 'Invalid date' });
                if (!body.sid || !SID_RE.test(body.sid))
                    return respond(400, { error: 'Invalid session' });
                if (body.reaction !== null && body.reaction !== 'up' && body.reaction !== 'down') {
                    return respond(400, { error: 'Invalid reaction' });
                }
                return respond(200, await handleReact(body.date, body.sid, body.reaction));
            }
            if (method === 'GET' && reqPath === '/reactions') {
                const date = event.queryStringParameters?.date;
                const sid = event.queryStringParameters?.sid;
                if (!date || !DATE_RE.test(date))
                    return respond(400, { error: 'Invalid date' });
                if (!sid || !SID_RE.test(sid))
                    return respond(400, { error: 'Invalid session' });
                return respond(200, await handleGetReactions(date, sid));
            }
            return respond(404, { error: 'Not found' });
        }
        catch (err) {
            console.error('Views handler error:', err);
            return respond(500, { error: 'Internal error' });
        }
    };
}
export const dailyViewsHandler = createDailyViewsHandler();
