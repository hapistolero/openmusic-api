const ClientError = require("../../exceptions/ClientError");

class PlaylistHandler {
    constructor(playlistService, usersService, validator) {
        this._playlistService = playlistService;
        this._usersService = usersService;
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
        this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    }

    async postPlaylistHandler(request, h) {
        try {
            this._validator.validatePlaylistPayload(request.payload);
            const { name = "untitled" } = request.payload;
            const { id: credentialId } = request.auth.credentials;

            const playlistId = await this._playlistService.addPlaylist({
                name, owner: credentialId,
            });

            const response = h.response({
                status: "success",
                message: "Playlist berhasil dibuat",
                data: {
                    playlistId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: "fail",
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            const response = h.response({
                status: "error",
                message: "Maaf, terjadi kegagalan pada server kami.",
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async getPlaylistHandler(request) {
        const { id: credentialId } = request.auth.credentials;

        const playlist = await this._playlistService.getPlaylist(credentialId);
        return {
            status: "success",
            data: {
                playlists: playlist.map((playlists) => ({
                    id: playlists.id,
                    name: playlists.name,
                    username: playlists.username,
                })),
            },
        };
    }

    async deletePlaylistHandler(request, h) {
        try {
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;

            await this._playlistService.verifyPlaylistOwner(id, credentialId);
            await this._playlistService.deletePlaylistById(id);

            return {
                status: "success",
                message: "Playlist Berhasil dihapus",
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: "fail",
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: "error",
                message: "Maaf, terjadi kegagalan pada server kami.",
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = PlaylistHandler;
