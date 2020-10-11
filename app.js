"use strict";

// İmport Modules
const express = require("express");
const exphbs = require('express-handlebars');
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const xss = require("xss");

// İmport Public
app.use("/public", express.static(path.join(__dirname, "./public")));


// Wiev Engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


// İmport Route
const route = require("./Routes/route");
app.use("/", route);


// İmport Jquery
app.use("/chat/jquery", express.static(path.join(__dirname, "./node_modules/jquery/dist")));


//İmport Config
const mysql = require("./Config/config");
const db = mysql;

// Socket İo
io.on("connection", (socket) => {

    //console.log("Bir Kullanıcı Bağlandı " + socket.id);
    socket.on("takemessage", (msg, authorId) => {
        // Bu kanala gelen mesajı filtreleyip geri ekrana basılması için tüm kanllara yolluyoruz
         let mail = xss.filterXSS(msg);
         io.emit("takemessages", mail, authorId);
    });

    // Database
    socket.on("takedatabase", (msg, auid) => {
        // bu kanala gelen mesajı filtreleyip veritabanına ekliyoruz
        let mails = xss.filterXSS(msg);
        db.query(`INSERT INTO chat (author_id, message) values ('${auid}','${mails}')`, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Data Added");
            }
        });
        io.emit("takedata", msg, auid);

    });

    // User Disconnect
    socket.on("disconnect", () => {
        //console.log("1 Kullanıcı Ayrıldı " + socket.id);

    });
});

// Server Start
server.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server http://127.0.0.1:${port} ' adresi üzerinden başladı`);
    }
});
