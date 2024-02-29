const http = require('http');
const Koa = require('koa');
const  { koaBody } = require('koa-body');
const Router = require('@koa/router');
const cors = require('@koa/cors')
const WebSocket  = require('ws');
const { faker } = require("@faker-js/faker");
const messages = require("./demo_messages");


const app = new Koa();
const router = new Router();
const port = process.env.PORT || 7072;
const server = http.createServer(app.callback());
const wss = new WebSocket.Server({ server });

app
    .use(cors())
    .use(router.routes("/messages"))
    .use(router.allowedMethods())
    .use(koaBody({
        text: true,
        urlencoded: true,
        multipart: true,
        json: true,
    }));

app.use(async (ctx, next) => {
    console.log(`Received request: ${ctx.request.method} ${ctx.request.url}`);
    return await next();
});

router.get("/messages", async (ctx, next) => {
    ctx.response.status = 200;
    console.log(ctx.data)
    ctx.response.body = messages;

});

router.post("/messages/create" , async (ctx, next) => {
    messages.push(ctx.request.body);
    ctx.response.status = 200;
});

const lazySendMessages = (ws) => {
    const pageSize = 4;
    let pageNumber = Math.ceil(messages.length / pageSize);
    messages.sort((a, b) => new Date(a.receivedAt) - new Date(b.receivedAt))

    while (pageNumber) {
        ws.send(JSON.stringify(messages.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)));
        pageNumber--;
    }
}

wss.on('connection', (ws, response) => {
    lazySendMessages(ws);

    ws.on('error', console.error);

    ws.on('message', (e) => {
        const received =  JSON.parse(e);
        console.log('получено:', received);

        const message = {
            id: faker.string.uuid(),
            from: received.user,
            type: received.type,
            textBody: received.textBody,
            blobContent: received.blobContent || '',
            receivedAt: new Date()
        }
        messages.push(message);
        const messageString = JSON.stringify(message);

        Array.from(wss.clients)
            .filter(client => client.readyState === WebSocket.OPEN)
            .forEach(client => client.send(messageString));
    });
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
