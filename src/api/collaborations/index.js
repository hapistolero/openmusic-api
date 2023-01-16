const CollaborationsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: "collaborations",
    version: "1.0.0",
    register: async (server, { collaborationsService, playlistService, validator }) => {
        const collaborationHandler = new CollaborationsHandler(
            collaborationsService, playlistService, validator,
        );
        server.route(routes(collaborationHandler));
    },

};
