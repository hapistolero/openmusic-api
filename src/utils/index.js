const mapDBToModel =({
    id,
    name,
    year,
}) =>({
    id,
    name,
    year,

})

const mapDBToModel1 =({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    albumId,
}) =>(
    {
        id,
        title,
        year,
        performer,
        genre,
        duration,
        albumId:albumId, 
    }
)

const mapGetPlaylist = ({ id, name, username }) => ({
    id, name, username,
  });

  const mapGetPlaylistActivitiesDBToModel = ({
    username, title, action, time,
  }) => ({
    username, title, action, time,
  });

module.exports = {mapDBToModel, mapDBToModel1, mapGetPlaylist, mapGetPlaylistActivitiesDBToModel}