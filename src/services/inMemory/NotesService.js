// mengelola resource notes yang disimpan pada memory(array)

const {nanoid} = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
class NotesServices {
    constructor() {
        this._notes = []
    }

    //fungsi crud

    //tambah
    addNote({title, body, tags}) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updateAt = createdAt;

        //buat objek
        const newNote = {
            title, tags, body, id, createdAt, updateAt,
        }

        this._notes.push(newNote);

        //memastikan newNote masuk ke dalam array notes
        const isSusccess = this._notes.filter((note) => note.id === id ).length > 0;

        if (!isSusccess){
            throw new InvariantError('Catatan gagal ditambahkan');
        }
        
        return id
    }

    //ambil 

    getNotes () {
        return this._notes;

    }

    //ambil berdasarkan id
    getNoteById(id){
        const note = this._notes.filter((n)=> n.id === id)[0];

        if(!note) {
            throw new NotFoundError('Catatan tidak ditemukan')
        }
        return note

    } 

    //edit 
    editNoteById(id, {title, body, tags}) {
        const index = this._notes.findIndex((note) => note.id === id)

        if (index === -1){
            throw new NotFoundError('Gagal memperbarui catatan, Id tidak ditemukan')

        }

        const updateAt = new Date().toISOString();

        this._notes[index] = {
            ...this._notes[index],
            title,
            tags,
            body,
            updateAt,
        }

    }

    deleteNoteById(id){
        const index = this._notes.findIndex((note) => note.id === id)

        if (index === -1){
            throw new NotFoundError('Catatan gagal dihapus, Id tidak ditemukan')
            
        }

        this._notes.splice(index,1);
    }
}

module.exports = NotesServices