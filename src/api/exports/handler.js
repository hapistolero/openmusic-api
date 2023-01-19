class ExportsHandler {
    constructor(service, playlistService, validator) {
        this._service = service;
        this._validator = validator;
        this._playlistService = playlistService;

        this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
    }

    async postExportPlaylistHandler(request, h) {
        const { playlistId } = request.params;
        const { id: userId } = request.auth.credentials;

        this._validator.validateExportPlaylistPayload(request.payload);

        await this._playlistService.verifyPlaylistOwner(playlistId, userId);

        const message = {
            userId: request.auth.credentials.id,
            targetEmail: request.payload.targetEmail,
        };

        await this._service.sendMessage("export:playlist", JSON.stringify(message));

        const response = h.response({
            status: "success",
            message: "Permintaan Anda dalam antrean",
        });

        response.code(201);
        return response;
    }
}

module.exports = ExportsHandler;
