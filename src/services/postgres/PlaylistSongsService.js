const { Pool} = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const { mapGetPlaylist, mapGetPlaylistActivitiesDBToModel} = require("../../utils");
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError')
const CollaborationService = require('.././postgres/CollaborationsService');
const {nanoid} = require('nanoid')



class playlistSongsService {

    constructor() {
        this._pool = new Pool()
        this._collaborationsService = new CollaborationService()
        
    }

    async addPlaylistSong(songsId, playlistId){
        
        await this.verifyIfSongNotExist(songsId)
               
        const id = `songPlaylist-${nanoid(16)}`

        
        

        const query = {
            text: 'insert into songsplaylist values($1, $2, $3) returning id',
            values: [id, playlistId,songsId]
        }

        const result = await this._pool.query(query)

        if(!result.rows.length){
            throw new InvariantError("Lagu Gagal ditambahkan dalam playlist")            
        }

        return result.rows[0].id
    }


    async getSongsPlaylist(playlistId){
        
        const query = {
            text:  `select songsplaylist.id, songs.title, songs.performer from songsplaylist
                    left join songs on songs.id = songsplaylist.song_id
                    where songsplaylist.playlist_id = $1`,
            values: [playlistId]

        }

        const result = await this._pool.query(query)

        if (!result.rows.length){
            throw new NotFoundError('playlist tidak ditemukan')
        }

        return  result.rows

    }

    async deleteSongPlaylist(songId, playlistId){
       
            const query = {
                text: `delete from songsplaylist where song_id =$1 and playlist_id = $2 returning id`,
                values: [songId, playlistId]
            }
    
            const result = await this._pool.query(query)
           
            if(!result.rows.length){ 
                throw new InvariantError('Lagu Gagal dihapus')
            }
            
       
       


    }

    async verifyPlaylistOwner(id, owner){
      
        const query = {
            text: 'select * from playlist where id = $1',
            values: [id],
        }
       
        const result = await this._pool.query(query)     
       
        
        if(result.rows.length===0){
            
            throw new NotFoundError('Playlist Tidak Ditemukan')            
        }
                                        

        if(result.rows[0].owner !== owner){
            throw new AuthorizationError('Anda Tidak Berhak mengakses playlist ini')
        }
        
                                                                     
        

    }

    

    async verifyCollaborator(playlistId, userId){
        const query = {
            text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
            values: [playlistId,userId]
    
        }

       
    
        const result = await this._pool.query(query)
       
        if(!result.rows.length){            
            throw new AuthorizationError('Kolaborasi gagal diverifikasi')
        }

       
        
       }

    async verifyPlaylistAccess(playlistId, userId){
        try {
            
            
            await this.verifyPlaylistOwner(playlistId, userId)           
           
        } catch (error) {
           if(error instanceof NotFoundError){
            throw error

           }

            try {                                
                await this._collaborationsService.verifyCollaborator(playlistId, userId)                                        
            } catch (error) {   
                throw error                                                                 
           }    
           console.log(error.message)
                                                   
                            
        }
    }

   
    async verifyIfSongNotExist( songId){
        
            const query ={
                text:`select * from songs where id = $1 `,
                values:[songId]
            }
            
    
            const result = await this._pool.query(query)
    
            if (result.rows.length === 0){
               
                throw new NotFoundError('Lagu Tidak Ada')
              
            }
        
    
            
        
        
    
    }

    async getPlaylist(playlistId) {       
       
        const query = {
            text: `SELECT playlist.id, playlist.name, users.username FROM playlist
            LEFT JOIN collaborations ON playlist.id = collaborations.playlist_id  
            LEFT JOIN users ON playlist.owner  = users.id
           
            WHERE playlist.id = $1 OR collaborations.playlist_id = $1`,
            values: [playlistId],
           }
    
           
            const result  = await this._pool.query(query)
            

            
          
            return result.rows.map(mapGetPlaylist)[0]
                
    
  
    
}

async getPlaylistActivites(playlistId){
   
    const query = {
        text: `select users.username, songs.title,
        playlist_song_activities.action, playlist_song_activities.time
        from playlist_song_activities
        right join users on users.id = playlist_song_activities.user_id
        right join songs on songs.id = playlist_song_activities.song_id
        where playlist_song_activities.playlist_id = $1
        `,
        values: [playlistId],
    }

    const result = await this._pool.query(query)
    
    return result.rows.map(mapGetPlaylistActivitiesDBToModel)

}

async postActivity(playlistId, songId, userId, action){
   
        const id = `playlist-${nanoid(16)}`
    const time = new Date().toISOString()
   

    const query = {
        text:`insert into playlist_song_activities values($1, $2, $3, $4, $5, $6) returning id `,
        values: [id , playlistId, songId, userId, action, time]
    }

    const result = await this._pool.query(query)

    if(!result.rows.length){
        throw new InvariantError('Aktivitas gagal ditambahkan')
    }

    return result.rows[0].id
        
  
    
}

}

module.exports = playlistSongsService

