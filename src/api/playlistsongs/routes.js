
const routes = (handler) =>[
    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: handler.postPlaylistSongHandler,
        options: {
            auth: 'openmusic_api_jwt'
        },
    },
    {
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: handler.getPlaylistSongsHandler,
        options: {
            auth: 'openmusic_api_jwt'
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: handler.deletePlaylistSongsHandler,
        options: {
            auth: 'openmusic_api_jwt'
        },
    },
    {
        method: 'GET',
        path: '/playlists/{id}/activities',
        handler: handler.getPlaylistActiviesHandler,
        options: {
            auth: 'openmusic_api_jwt'
        },
    },

]

module.exports = routes