const ExportPlaylistPayloadSchema = require("./schema");
const InvarianError = require("../../exceptions/InvariantError");

const ExportsValidator = {
    validateExportPlaylistPayload: (payload) => {
        const validationResult = ExportPlaylistPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvarianError(validationResult.error.message);
        }
    },
};

module.exports = ExportsValidator;
