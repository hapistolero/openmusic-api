/* eslint-disable linebreak-style */

exports.up = (pgm) => {
    pgm.createTable("songsplaylist", {

        id: {

            type: "VARCHAR(50)",

            primaryKey: true,

        },

        playlist_id: {

            type: "VARCHAR(50)",

            notNull: true,

        },

        song_id: {

            type: "VARCHAR(50)",

            notNull: true,

        },

    });

    pgm.addConstraint("songsplaylist", "fk_songsplaylist.playlist_id_playlist.id", "Foreign key(playlist_id) References playlist(id) on delete cascade");

    pgm.addConstraint("songsplaylist", "fk_songsplaylist.song_id_songs.id", "Foreign key(song_id) References songs(id) on delete cascade");
};

exports.down = (pgm) => {
    pgm.dropConstraint("songsplaylist", "fk_songsplaylist.playlist_id_playlist.id");

    pgm.dropConstraint("songsplaylist", "fk_songsplaylist.song_id_songs.id");

    pgm.dropTable("songsplaylist");
};
