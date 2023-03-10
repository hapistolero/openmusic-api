const routes = (handler) => [
    {
        method: "POST",
        path: "/albums/{id}/likes",
        handler: handler.postAlbumLikeHandler,
        options: {
            auth: "openmusic_api_jwt",
        },
    },
    {
        method: "GET",
        path: "/albums/{id}/likes",
        handler: handler.getAlbumLikesHandler,
    },
];

module.exports = routes;
