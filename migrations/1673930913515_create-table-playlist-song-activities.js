/* eslint-disable linebreak-style */

exports.up = (pgm) => {
    pgm.createTable("playlist_song_activities", {

        id: {

            type: "TEXT",

            primarykey: true,

        },

        playlist_id: {

            type: "TEXT",

            notNull: true,

        },

        song_id: {

            type: "TEXT",

            notNull: true,

        },

        user_id: {

            type: "TEXT",

            notNull: true,

        },

        action: {

            type: "TEXT",

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
