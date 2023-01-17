/* eslint-disable linebreak-style */

exports.up = (pgm) => {
    pgm.createTable("playlist_song_activities", {

        id: {

            type: "VARCHAR(50)",

            primarykey: true,

        },

        playlist_id: {

            type: "VARCHAR(50)",

            notNull: true,

        },

        song_id: {

            type: "VARCHAR(50)",

            notNull: true,

        },

        user_id: {

            type: "VARCHAR(50)",

            notNull: true,

        },

        action: {

            type: "VARCHAR(10)",

            notNull: true,

        },

        time: {

            type: "TIMESTAMP",

            notNull: true,

        },

    });

    pgm.addConstraint(

        "playlist_song_activities",

        "fk_playlist_song_activies.playlist_id_playlist.id",

        "foreign key(playlist_id) references playlist(id) on delete cascade",

    );
};

exports.down = (pgm) => {
    pgm.dropConstraint(

        "playlist_song_activities",

        "fk_playlist_song_activies.playlist_id_playlist.id",

    );

    pgm.dropTable("playlist_song_activities");
};
