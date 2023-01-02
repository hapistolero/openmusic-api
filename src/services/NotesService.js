// mengelola resource notes yang disimpan pada memory(array)

const {nanoid} = require('nanoid')
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

        this._notes.push(newNotes);

        //memastikan newNote masuk ke dalam array notes
        const isSusccess = this._notes.filter((note) => note.id === id ).length > 0;

        if (!isSusccess){
            throw new Error('catatan gagal ditambahkan');
        }
        
        return id
    }

    //ambil 

    getNotes () {
        return this._notes;

    }

    //ambil berdasarkan id
    getNotesById(id){
        const note = this._notes.filter((n)=> n.id === id)[0];

        if(!note) {
            throw new Error ('catatan tidak ditemukan')
        }
        return note

    } 

    //edit 
    editNoteById(id, {title, body, tags}) {
        const index = this._notes.findIndex((note) => note.id === id)

        if (index === -1){
            throw new Error('gagal memperbarui catatan, id tidak ditemukan')

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
            throw new Error('catatan gagal dihapus, id tidiak ditemukan')
            
        }

        this._notes.splice(index,1);
    }
}

module.exports = NotesServices