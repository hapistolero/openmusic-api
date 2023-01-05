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

module.exports = {mapDBToModel, mapDBToModel1}