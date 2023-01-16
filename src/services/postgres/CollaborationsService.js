const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class CollaborationsService {
    constructor() {
        this._pool = new Pool();
    }

    async addCollaboration(playlistId, userId) {
        await this.verifyExistUser(userId);
        const id = `collab-${nanoid(16)}`;

        const query = {
            text: "insert into collaborations values($1, $2,$3) returning id",
            values: [id, playlistId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError("Kolaborasi gagal ditambahkan ");
        }
        if (result.rows[0].id === undefined) {
            throw new NotFoundError("Kolaborasi gagal ditambahkan");
        }

        return result.rows[0].id;
    }

    async verifyExistUser(userId) {
        const query = {
            text: "select * from users where id = $1",
            values: [userId],
        };

        const result = await this._pool.query(query);

        if (result.rows[0] === undefined) {
            throw new NotFoundError("user tidak ditemukan");
        }

        return result.rows;
    }

    async deleteCollaboration(playlistId, userId) {
        const query = {
            text: "delete from collaborations where user_id =$1  and playlist_id = $2 returning id",
            values: [userId, playlistId],

        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError("Kolaborasi gagal dihapus");
        }
    }

    async verifyCollaborator(playlistId, userId) {
        const query = {
            text: "SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
            values: [playlistId, userId],

        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new AuthorizationError("Kolaborasi gagal diverifikasi");
        }
    }
}

module.exports = CollaborationsService;
