const routes = (handler) => [
    {
        method: "PUT",
        path: "/authentications",
        handler: (request, h) => handler.putAuthenticationHandler(request, h),
    },
    {
        method: "POST",
        path: "/authentications",
        handler: (request, h) => handler.postAuthenticationHandler(request, h),
    },
    {
        method: "DELETE",
        path: "/authentications",
        handler: (request, h) => handler.deleteAuthenticationsHandler(request, h),
    },
];

module.exports = routes;
