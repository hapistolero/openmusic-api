const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel } = require('../../utils');
const {nanoid} = require('nanoid');

class AlbumsService {
    constructor(){
        this._pool = new Pool()
    }

    async addAlbum({ name, year }) {
        const id = nanoid(16);
     
        const query = {
          text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
          values: [id, name, year],
        };
     
        const result = await this._pool.query(query);
     
        if (!result.rows[0].id) {
          throw new InvariantError('Album gagal ditambahkan');
        }
     
        return result.rows[0].id;
      }

      async getAlbumById(id) {
        const query = {
            text: 'SELECT * FROM albums where id = $1',
            values: [id],

        }
        const result = await this._pool.query(query)

        if(!result.rows.length){
            throw new NotFoundError('Catatan tidak ditemukan')
        }
        console.log(result.rows.map(mapDBToModel)[0])
        return result.rows.map(mapDBToModel)[0]
    }

    async editAlbumById(id, {name, year}) {
       

        const query = {
            text: 'UPDATE albums SET name = $1, year=$2 where id = $3 returning id',
            values: [name,year, id],
        }

        const result = await this._pool.query(query)

        if(!result.rows.length){
        throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan')
        }

    }

    async deleteAlbumByIdHandler(id){
        const query = {
            text: 'DELETE FROM albums where id = $1 returning id',
            values: [id],
        }

        const result = await this._pool.query(query)

        if (!result.rows.length){
            throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan')
        }

    }


}

module.exports = AlbumsService