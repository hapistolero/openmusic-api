const mapDBToModel = ({
    id,
    name,
    year,
    coverUrl,
}) => ({
    id,
    name,
    year,
    coverUrl,

});

const mapDBToModel1 = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    albumId,
}) => (
    {
        id,
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
    }
);

const mapGetPlaylist = ({ id, name, username }) => ({
    id, name, username,
});

const mapGetPlaylistActivitiesDBToModel = ({
    username, title, action, time,
}) => ({
    username, title, action, time,
});

module.exports = {
    mapDBToModel, mapDBToModel1, mapGetPlaylist, mapGetPlaylistActivitiesDBToModel,
};
