const routes =(handler) =>[
    {
        method: 'POST',
        path: '/playlists',
        handler: handler.postPlaylistHandler,
        options: {
            auth: 'openmusic_api_jwt'
        },
    },
    {
        method: 'GET',
        path: '/playlists',
        handler:  handler.getPlaylistHandler,
        options: {
            auth: 'openmusic_api_jwt'
        },
     },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: handler.deletePlaylistHandler,
        options: {
            auth: 'openmusic_api_jwt'
        },
    },
    

]

module.exports = routes