// berkas penampung kode untuk membuat , mengkonfigurasi, dan menjalankan http server
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt')
const albums = require('./api/albums')
const songs = require('./api/song');
const users = require('./api/users');
const ClientError = require('./exceptions/ClientError');
const AlbumsService = require('./services/postgres/AlbumsService')
const SongsService = require('./services/postgres/SongsService')
const UsersService = require('./services/postgres/UsersService')
const AlbumsValidator = require('./validator/albums')
const SongsValidator = require('./validator/songs')
const usersValidator = require('./validator/users')


const authentications = require('./api/authentications')
const AuthenticationService = require('./services/postgres/AuthenticationsServices')
const TokenManager = require('./tokenize/TokenManager')
const AuthenticationsValidator = require('./validator/authentications');
const InvariantError = require('./exceptions/InvariantError');


const init = async () => {
  const albumsService = new AlbumsService()
  const songsService = new SongsService()
  const usersService = new UsersService()
  const authenticationsServices = new AuthenticationService()
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ])

  server.auth.strategy('openmusic_api_jwt','jwt',{
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid:true,
      credential: {
        id: artifacts.decoded.payload.id,
      }
    })
  })

  await server.register({
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator
    },

  })

  await server.register({
    plugin: users,
    options: {
      service: usersService,
      validator: usersValidator
    },

  })

  await server.register({
    plugin: authentications,
    options: {
      authenticationsService:authenticationsServices,
      usersService:usersService,
      tokenManager: TokenManager,
      validator: AuthenticationsValidator,
    },
  })

  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator
    },

  })


  server.ext('onPreResponse',(request, h)=>{
    const {response} = request

    if(response instanceof Error){
      console.log(response.message)
      

      if (response instanceof ClientError){
        console.log(4)
        const clientResponseError = h.response({
          status: 'fail',
          message: response.message,
        })
        
        clientResponseError.code(response.statusCode)
        return clientResponseError
      }

      if (response instanceof InvariantError){
        
        const InvariantErrorResponse = h.response({
          status: 'fail',
          message: response.message,
        })
        
        InvariantErrorResponse.code(response.statusCode)
        return InvariantErrorResponse
      }

      if(!response.isServer){
        return h.continue
      }

      
      

      const serverResponseError =h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami'
      })
      serverResponseError.code(500)
      return serverResponseError
    }

    return h.continue

    
  })


  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
