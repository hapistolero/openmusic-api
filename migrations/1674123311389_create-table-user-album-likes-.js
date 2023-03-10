/* eslint-disable linebreak-style */
exports.up = (pgm) => {
    pgm.createTable("user_album_likes", {

        id: {

            type: "VARCHAR(50)",

            primarykey: true,

        },

        userId: {

            type: "VARCHAR(50)",

            notNull: true,

        },

        albumId: {

            type: "VARCHAR(50)",

            notNull: true,

        },

    });
};

exports.down = (pgm) => {
    pgm.dropTable("user_album_likes");
};
