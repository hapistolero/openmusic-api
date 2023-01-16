const PlaylistSongHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: "songplaylist",
    version: "1.0.0",
    register: async (server, { playlistSongsService, playlistService, validator }) => {
        const playlistSongHandler = new PlaylistSongHandler(
            playlistSongsService, playlistService, validator,
        );
        server.route(routes(playlistSongHandler));
    },
};
