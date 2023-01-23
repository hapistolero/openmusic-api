const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");

class AlbumLikeSevice {
    constructor(cacheService) {
        this._pool = new Pool();
        this._cacheService = cacheService;
    }

    async addAlbumLike(userId, albumId) {
        const id = `like-${nanoid(16)}`;

        const query = {
            text: "insert into user_album_likes values ($1,$2,$3) returning id",
            values: [id, userId, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError("Gagal menyukai album");
        }

        await this._cacheService.delete(`album_likes:${albumId}`);
        return result.rows[0].id;
    }

    async deleteAlbumLike(userId, albumId) {
        const query = {
            // eslint-disable-next-line quotes
            text: `delete from user_album_likes a where a."userId" = $1 and a."albumId" = $2 returning id`,
            values: [userId, albumId],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError("Gagal untuk batal menyukai album");
        }

        await this._cacheService.delete(`album_likes:${albumId}`);
    }

    async getLikesCount(albumId) {
        try {
            const result = await this._cacheService.get(`album_likes:${albumId}`);
            return {
                source: "cache",
                count: JSON.parse(result),
            };
        } catch (error) {
            const query = {
                // eslint-disable-next-line quotes
                text: `select * from user_album_likes a where  a."albumId" =$1`,
                values: [albumId],
            };
            const result = await this._pool.query(query);

            if (!result.rows.length) {
                throw new InvariantError("Belum ada yang menyukai album id");
            }

            await this._cacheService.set(`album_likes:${albumId}`, JSON.stringify(result.rows.length));

            return {
                count: result.rows.length,
            };
        }
    }

    async checkLikesStatus(userId, albumId) {
        const query = {
            // eslint-disable-next-line quotes
            text: `select * from user_album_likes a where a."userId" = $1 and a."albumId" = $2`,
            values: [userId, albumId],
        };
        const result = await this._pool.query(query);
        return result.rows.length;
    }
}

module.exports = AlbumLikeSevice;
