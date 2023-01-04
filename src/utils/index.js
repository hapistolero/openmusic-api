const mapDBToModel =({
    id,
    title,
    body,
    tags,
    created_at,
    updated_at
}) =>({
    id,
    title,
    body,
    tags,
    createdAT: created_at,
    updatedAt: updated_at,

})

module.exports = {mapDBToModel}