/* eslint-disable linebreak-style */
// berkas penampung kode untuk membuat , mengkonfigurasi, dan menjalankan http server

require("dotenv").config();

const Hapi = require("@hapi/hapi");

const Jwt = require("@hapi/jwt");

const albums = require("./api/albums");

const songs = require("./api/song");

const users = require("./api/users");

const ClientError = require("./exceptions/ClientError");

const AlbumsService = require("./services/postgres/AlbumsService");

const SongsService = require("./services/postgres/SongsService");

const UsersService = require("./services/postgres/UsersService");

const AlbumsValidator = require("./validator/albums");

const SongsValidator = require("./validator/songs");

const usersValidator = require("./validator/users");

const authentications = require("./api/authentications");

const AuthenticationService = require("./services/postgres/AuthenticationsServices");

const TokenManager = require("./tokenize/TokenManager");

const AuthenticationsValidator = require("./validator/authentications");

const collaborations = require("./api/collaborations");

const CollaborationsValidator = require("./validator/collaborations");

const CollaborationsService = require("./services/postgres/CollaborationsService");

const Playlist = require("./api/playlist");

const PlaylistService = require("./services/postgres/PlaylistService");

const PlaylistValidator = require("./validator/playlist");

const PlaylistSongs = require("./api/playlistsongs");

const PlaylistSongsService = require("./services/postgres/PlaylistSongsService");

const PlaylistSongsValidator = require("./validator/playlistsongs");

const InvariantError = require("./exceptions/InvariantError");

const _exports = require("./api/exports");
const ProducerSevice = require("./services/RabbitMQ/ProducerService");
const ExportsValidator = require("./validator/exports");

const init = async () => {
    const collaborationsService = new CollaborationsService();

    const albumsService = new AlbumsService();

    const songsService = new SongsService();

    const usersService = new UsersService();

    const playlistService = new PlaylistService(collaborationsService);

    const playlistSongsService = new PlaylistSongsService();

    const authenticationsServices = new AuthenticationService();

    const server = Hapi.server({

        port: process.env.PORT,

        host: process.env.HOST,

        routes: {

            cors: {

                origin: ["*"],

            },

        },

    });

    await server.register([

        {

            plugin: Jwt,

        },

    ]);

    server.auth.strategy("openmusic_api_jwt", "jwt", {

        keys: process.env.ACCESS_TOKEN_KEY,

        verify: {

            aud: false,

            iss: false,

            sub: false,

            maxAgeSec: process.env.ACCESS_TOKEN_AGE,

        },

        validate: (artifacts) => ({

            isValid: true,

            credential: {

                id: artifacts.decoded.payload.id,

            },

        }),

    });

    await server.register({

        plugin: songs,

        options: {

            service: songsService,

            validator: SongsValidator,

        },

    });

    await server.register({

        plugin: users,

        options: {

            service: usersService,

            validator: usersValidator,

        },

    });

    await server.register({

        plugin: authentications,

        options: {

            authenticationsService: authenticationsServices,

            usersService,

            tokenManager: TokenManager,

            validator: AuthenticationsValidator,

        },

    });

    await server.register({

        plugin: albums,

        options: {

            service: albumsService,

            validator: AlbumsValidator,

        },

    });

    await server.register({

        plugin: collaborations,

        options: {

            collaborationsService,

            playlistService,

            validator: CollaborationsValidator,

        },

    });

    await server.register({

        plugin: Playlist,

        options: {

            playlistService,

            usersService,

            validator: PlaylistValidator,

        },

    });

    await server.register({

        plugin: PlaylistSongs,

        options: {

            playlistSongsService,

            playlistService,

            validator: PlaylistSongsValidator,

        },

    });

    await server.register({

        plugin: _exports,

        options: {

            service: ProducerSevice,

            playlistService,

            validator: ExportsValidator,

        },

    });

    server.ext("onPreResponse", (request, h) => {
        const { response } = request;

        if (response instanceof Error) {
            if (response instanceof ClientError) {
                const clientResponseError = h.response({

                    status: "fail",

                    message: response.message,

                });

                clientResponseError.code(response.statusCode);

                return clientResponseError;
            }

            if (response instanceof InvariantError) {
                const InvariantErrorResponse = h.response({

                    status: "fail",

                    message: response.message,

                });

                InvariantErrorResponse.code(response.statusCode);

                return InvariantErrorResponse;
            }

            if (!response.isServer) {
                return h.continue;
            }

            const serverResponseError = h.response({

                status: "error",

                message: "terjadi kegagalan pada server kami",

            });

            serverResponseError.code(500);

            return serverResponseError;
        }

        return h.continue;
    });

    await server.start();

    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
