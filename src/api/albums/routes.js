const routes =(handler) =>[
    {
        method: 'POST',
        path: '/albums',
        handler: handler.postAlbumHandler,
        option: {
            auth: 'openmusic_api_jwt'
        },

    },
    {
        method: 'GET',
        path: '/albums/{id}',
        handler:  handler.getAlbumByIdHandler,
        option: {
            auth: 'openmusic_api_jwt'
        },
     },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler: handler.putAlbumByIdHandler,
        option: {
            auth: 'openmusic_api_jwt'
        },
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: handler.deleteAlbumByIdHandler,
        option: {
            auth: 'openmusic_api_jwt'
        },
    }

]

module.exports = routes