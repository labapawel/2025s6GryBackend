const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const io=require('socket.io');
const { Client } = require('./lib/client.js');
const { Gracze } = require('./lib/gracze.js');
require('dotenv').config();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
};

const app = express();
const port = process.env.PORT || 3000;
const server = https.createServer({
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT)
}, app);

app.use(cors(corsOptions));
app.use(express.static('public'));
server.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
});

const ss = io(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

let gracze = new Gracze(); // tablica graczy

ss.on('connection', (socket) => {
    let unqId = socket.handshake.query.unqId;
    let gra = gracze.dodajGracza(unqId, socket); // dodanie gracza do tablicy graczy
    gra.aktualizujTabliceGracza(unqId); // aktualizacja planszy gracza


    socket.on('modTablice', (data) => {
        gra.modyfikujPlansze(unqId, data); // modyfikacja planszy gracza
    });


}); 
