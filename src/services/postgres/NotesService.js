const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel } = require('../../utils');
const {nanoid} = require('nanoid');
class NotesService {

    constructor() {
        this._pool = new Pool();
    }

    async addNote({ title, body, tags }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
     
        const query = {
          text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
          values: [id, title, body, tags, createdAt, updatedAt],
        };
     
        const result = await this._pool.query(query);
     
        if (!result.rows[0].id) {
          throw new InvariantError('Catatan gagal ditambahkan');
        }
     
        return result.rows[0].id;
      }

    async getNotes() {
        const result = await this._pool.query('SELECT * from notes')
        
        return result.rows.map(mapDBToModel)
    }

    async getNoteById(id) {
        const query = {
            text: 'SELECT * FROM notes where id = $1',
            values: [id],

        }
        const result = await this._pool.query(query)

        if(!result.rows.length){
            throw new NotFoundError('Catatan tidak ditemukan')
        }
        console.log(result.rows.map(mapDBToModel)[0])
        return result.rows.map(mapDBToModel)[0]
    }

    async editNoteById(id, {title, body, tags}) {
        const updateAt = new Date().toISOString()

        const query = {
            text: 'UPDATE notes SET title = $1, body=$2, tags=$3, updated_at = $4 where id = $5 returning id',
            values: [title, body, tags, updateAt, id],
        }

        const result = await this._pool.query(query)

        if(!result.rows.length){
        throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan')
        }

    }

    async deleteNoteByIdHandler(id){
        const query = {
            text: 'DELETE FROM notes where id = $1 returning id',
            values: [id],
        }

        const result = await this._pool.query(query)

        if (!result.rows.length){
            throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan')
        }

    }


    
}

module.exports = NotesService