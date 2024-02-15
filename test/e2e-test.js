const net = require('net');
const port = 4000;
client = net.createConnection({ port }, () => {
    client.write(JSON.stringify({ method_name: "ready" }));

    setTimeout(() => {
        client.write(JSON.stringify({ method_name: "register-view-objects" }));
    }, 1000);
});

client.on('error', (err) => {
    console.log(err)
});