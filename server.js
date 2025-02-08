const io = require("socket.io")(3000, {
    cors: { origin: "*" }
});

let players = {};

io.on("connection", (socket) => {
    console.log("Nový hráč připojen:", socket.id);

    socket.on("newPlayer", (player) => {
        players[socket.id] = player;
        io.emit("updatePlayers", players);
    });

    socket.on("move", (player) => {
        if (players[socket.id]) {
            players[socket.id].x = player.x;
            players[socket.id].y = player.y;
            io.emit("updatePlayers", players);
        }
    });

    socket.on("colorChange", (data) => {
        if (players[socket.id]) {
            players[socket.id].color = data.color;
            io.emit("updatePlayers", players);
        }
    });

    socket.on("chat", (chatData) => {
        if (players[socket.id]) {
            players[socket.id].messages = chatData.messages;
            io.emit("chatUpdate", chatData);
        }
    });

    socket.on("disconnect", () => {
        console.log("Hráč odpojen:", socket.id);
        delete players[socket.id];
        io.emit("updatePlayers", players);
    });
});
