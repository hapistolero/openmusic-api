const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapDBToModel1 } = require("../../utils");

class SongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addSong({
        title, year, performer, genre, duration, albumId,
    }) {
        const id = `song-${nanoid(16)}`;

        const query = {
            text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
            values: [id, title, year, genre, performer, duration, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError("Lagu gagal ditambahkan");
        }
        return result.rows[0].id;
    }

    async getSongs({ title, performer }) {
        if (title && performer) {
            const result = await this._pool.query(`SELECT id, title, performer FROM songs where lower(title) like '%${title}%' and  lower(performer) like '%${performer}%'`);
            return result.rows;
        }
        if (title || performer) {
            const result = await this._pool.query(`SELECT id, title, performer FROM songs where lower(title) like '%${title}%' or lower(performer) like '%${performer}%' `);

            return result.rows;
        }
        const result = await this._pool.query("SELECT id, title, performer from songs");
        return result.rows;
    }

    async getSongById(id) {
        const query = {
            text: "SELECT * FROM songs where id = $1",
            values: [id],

        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError("Lagu tidak ditemukan");
        }
        return result.rows.map(mapDBToModel1)[0];
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

    async deleteSongById(id) {
        const query = {
            text: "DELETE FROM songs where id = $1 returning id",
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError("Lagu gagal dihapus. Id tidak ditemukan");
        }
    }
}

module.exports = SongsService;
