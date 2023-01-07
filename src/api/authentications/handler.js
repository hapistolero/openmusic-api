const { response } = require("@hapi/hapi/lib/validation")

class AuthenticationHandler {
    constructor(AuthenticationService, UsersService, tokenManager ,validator){
        
    }

    async postAuthenticationHandler(request, h){
        this._validator.valldatePostAuthenticationsPayload(request.valldatePostAuthenticationsPayload)

        const {username, password} = request.valldatePostAuthenticationsPayload
        const id = await this._usersService.verifyUserCredential(username, password)

        const accessToken = this._tokenManager.generateAccessToken({id})
        const refreshToken = this._tokenManager.generateRefreshToken({id})

        await this._AuthenticationsService.addRefreshToken(refreshToken)

        const response = h.response({
            status:'success',
            message: 'Authentication berhasil ditambahkan',
            data: {
                accessToken,
                refreshToken,
            }           
        })
        response.code(201)

        return response
    }

    async putAuthenticatonHandler(request, h){
        this._validator.validatePutAuthenticationPayload(request.payload)

        const {refreshToken} = request.payload
        await this._authenticationsService.verifyRefreshToken(refreshToken)
        const { id } = this._tokenManager.verifyRefreshToken(refreshToken)
        
        const accessToken = this._tokenManager.generateAccessToken({id})

        return {
            status: 'success',
            message: 'Access Token berhasil diperbarui',
            data: {
                accessToken,
            }
        }
    }

    async deleteAuthenticationHandler(request, h){
        this._validator.validateDeleteAuthenticationPayload(request.payload)

        const {refreshToken} = request.payload
        await this._authenticationsService.verifyRefreshToken(refreshToken)
        await this._authenticationsService.deleteRefreshToken(refreshToken)

        return{
            status: 'success',
            message: 'Refresh token berhasil dihapus'
        }
    }




}

module.exports = AuthenticationHandler