const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapDBToModel } = require("../../utils");

class AlbumsService {
    constructor() {
        this._pool = new Pool();
    }

    async addAlbum({ name, year }) {
        const id = `album-${nanoid(16)}`;

        const query = {
            text: "INSERT INTO albums VALUES($1, $2, $3) RETURNING id",
            values: [id, name, year],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError("Album gagal ditambahkan");
        }

        return result.rows[0].id;
    }

    async getAlbumById(id) {
        const query = {
            text: "SELECT * from albums where id = $1",
            values: [id],

        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError("Album tidak ditemukan");
        }
        return result.rows.map(mapDBToModel)[0];
    }

    async getSongByIdAlbum(id) {
        const query1 = {
            text: 'SELECT * FROM songs where "albumId" = $1',
            values: [id],

        };
        const result1 = await this._pool.query(query1);

        // eslint-disable-next-line no-shadow
        return result1.rows.map(({ id, title, performer }) => ({ id, title, performer }));
    }

    async editAlbumById(id, { name, year }) {
        const query = {
            text: "UPDATE albums SET name = $1, year=$2 where id = $3 returning id",
            values: [name, year, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError("Gagal memperbarui catatan. Id tidak ditemukan");
        }
    }

    async deleteAlbumById(id) {
        const query = {
            text: "DELETE FROM albums where id = $1 returning id",
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError("Catatan gagal dihapus. Id tidak ditemukan");
        }
    }
}

module.exports = AlbumsService;
