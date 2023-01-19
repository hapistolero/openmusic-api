class PlaylistSongHandler {
    constructor(playlistSongsService, usersService, validator) {
        this._playlistSongsService = playlistSongsService;
        this._usersService = usersService;
        this._validator = validator;

        this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
        this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
        this.deletePlaylistSongsHandler = this.deletePlaylistSongsHandler.bind(this);

        this.getPlaylistActiviesHandler = this.getPlaylistActiviesHandler.bind(this);
    }

    async postPlaylistSongHandler(request, h) {
        this._validator.validatePlaylistSongsPayload(request.payload);
        const { id: playlistId } = request.params;

        const { songId } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistSongsService.verifyPlaylistAccess(playlistId, credentialId);

        const playlistSongId = await this._playlistSongsService.addPlaylistSong(songId,
            playlistId);
        const action = "add";

        await this._playlistSongsService.postActivity(playlistId, songId, credentialId, action);

        const response = h.response({
            status: "success",
            message: "Lagu Berhasil di tambahkan di playlist",
            data: {
                playlistSongId,
            },
        });
        response.code(201);
        return response;
    }

    async getPlaylistSongsHandler(request) {
        const { id: credentialId } = request.auth.credentials;
        const { id: playlistId } = request.params;

        await this._playlistSongsService.verifyPlaylistAccess(playlistId, credentialId);

        const playlist = await this._playlistSongsService.getPlaylist(playlistId);

        const songs = await this._playlistSongsService.getSongsPlaylist(playlistId);
        playlist.songs = songs;

        return {
            status: "success",
            data: {
                playlist,
            },
        };
    }

    async deletePlaylistSongsHandler(request) {
        this._validator.validatePlaylistSongsPayload(request.payload);
        const { id: credentialId } = request.auth.credentials;
        const { songId } = request.payload;
        const { id: playlistId } = request.params;

        const action = "delete";
        await this._playlistSongsService.verifyPlaylistAccess(playlistId, credentialId);
        await this._playlistSongsService.deleteSongPlaylist(songId, playlistId);
        await this._playlistSongsService.postActivity(playlistId, songId, credentialId, action);

        return {
            status: "success",
            message: "Lagu Dari Playlist Berhasil dihapus",
        };
    }

    async getPlaylistActiviesHandler(request) {
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistSongsService.verifyPlaylistAccess(playlistId, credentialId);

        const activities = await this._playlistSongsService.getPlaylistActivites(playlistId);
        return {
            status: "success",
            data: {
                playlistId,
                activities,
            },
        };
    }
}

module.exports = PlaylistSongHandler;
