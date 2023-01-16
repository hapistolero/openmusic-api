const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const { mapDBToModel, mapGetPlaylist } = require("../../utils");

class PlaylistService {
    constructor(collaborationService) {
        this._pool = new Pool();
        this._collaborationService = collaborationService;
    }

    async addPlaylist({ name, owner }) {
        const id = `playlist-${nanoid(16)}`;
        const query = {
            text: "INSERT INTO playlist VALUES($1, $2, $3) RETURNING id",
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError("Playlist gagal ditambahkan");
        }
        return result.rows[0].id;
    }

    async getPlaylist(owner) {
        const query = {
            text: `SELECT playlist.id, playlist.name, users.username FROM playlist
                LEFT JOIN collaborations ON playlist.id = collaborations.playlist_id  
                LEFT JOIN users ON playlist.owner  = users.id
               
                WHERE playlist.owner = $1 OR collaborations.user_id = $1`,
            values: [owner],
        };

        const result = await this._pool.query(query);

        return result.rows.map(mapGetPlaylist);
    }

    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: "SELECT owner FROM playlist WHERE id = $1",
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError("Playlist tidak ditemukan");
        }

        if (result.rows[0].owner !== owner) {
            throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
        }
    }

    async postSongPlaylist(id) {
        const query = {
            text: "SELECT * FROM songs where id = $1",
            values: [id],

        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError("Lagu tidak ditemukan");
        }
        return result.rows.map(mapDBToModel)[0];
    }

    async editSongById(id, {
        title, year, genre, performer, duration, albumId,
    }) {
        const query = {
            text: 'UPDATE songs SET title=$1, year=$2, genre=$3, performer=$4, duration=$5, "albumId"=$6 where "id"=$7 returning id',
            values: [title, year, genre, performer, duration, albumId, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError("Gagal memperbarui Lagu. Id tidak ditemukan");
        }
    }

    async deletePlaylistById(id) {
        const query = {
            text: "DELETE FROM playlist where id = $1 returning id",
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError("Lagu gagal dihapus. Id tidak ditemukan");
        }
    }

    async verifyCollaborator(playlistId, userId) {
        const query = {
            text: "select * from collaborations where user_id =$1 and playlist_id = $2",
            values: [userId, playlistId],

        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError("Kolaborasi gagal diverifikasi");
        }
    }

    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this.verifyPlaylistOwner(playlistId, userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }

            console.log(error.message);

            try {
                await this._collaborationService.verifyCollaborator(playlistId, userId);
            // eslint-disable-next-line no-shadow
            } catch (error) {
                console.log(error);
                if (error instanceof AuthorizationError) {
                    throw error;
                }

                throw error;
            }
        }
    }
}

module.exports = PlaylistService;
