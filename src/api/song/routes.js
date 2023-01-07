const routes =(handler) =>[
    {
        method: 'POST',
        path: '/songs',
        handler: handler.postSongHandler,
        option: {
            auth: 'openmusic_api_jwt'
        },

    },
    {
        method: 'GET',
        path: '/songs',
        handler:  handler.getSongsHandler,
        option: {
            auth: 'openmusic_api_jwt'
        },
     },
    {
        method: 'GET',
        path: '/songs/{id}',
        handler:  handler.getSongByIdHandler,
        option: {
            auth: 'openmusic_api_jwt'
        },
     },
    
    {
        method: 'PUT',
        path: '/songs/{id}',
        handler: handler.putSongByIdHandler,
        option: {
            auth: 'openmusic_api_jwt'
        },
    },
    {
        method: 'DELETE',
        path: '/songs/{id}',
        handler: handler.deleteSongByIdHandler,
        option: {
            auth: 'openmusic_api_jwt'
        },
    }

]

module.exports = routes