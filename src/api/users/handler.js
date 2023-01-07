


class UserHandler {
    constructor(service, validator){
        this._service = service
        this._validator = validator
    }

    async postUserHandler(request, h){
        this._validator.validateUserPayload(request.payload)
        const {username, password, fullname} = request.payload

        const userId = await this._service.addUser({username, password, fullname})

        const response = h.request({
            status:'success',
            message: 'User berhasil ditambahkan',
            data:{
                userId,
            }
        })
        return response

    }

    async getUserByIdHandler(request, h){

        const { id } = request.params
        const user = await this._service.getUserById(id)

        return {
            status: 'success',
            data: {
                user,
            }
        }
    }

}

module.exports = UserHandler