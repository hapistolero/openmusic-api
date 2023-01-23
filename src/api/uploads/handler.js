class UploadsHandler {
    constructor(service, albumService, validator) {
        this._service = service;
        this._validator = validator;
        this._albumService = albumService;
        this.postAlbumsCoverHandler = this.postAlbumsCoverHandler.bind(this);
    }

    async postAlbumsCoverHandler(request, h) {
        const { cover } = request.payload;
        const { id } = request.params;
        this._validator.validateImageHeader(cover.hapi.headers);

        const filename = await this._service.writeFile(cover, cover.hapi);
        const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

        await this._albumService.addCoverAlbumById(id, coverUrl);

        const response = h.response({
            status: "success",
            message: "Cover berhasil di upload",
        });
        response.code(201);
        return response;
    }
}

module.exports = UploadsHandler;
