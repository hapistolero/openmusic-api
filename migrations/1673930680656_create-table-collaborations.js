/* eslint-disable linebreak-style */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("collaborations", {

        id: {

            type: "VARCHAR(50)",

            primaryKey: true,

        },

        playlist_id: {

            type: "VARCHAR(50)",

            notNull: true,

        },

        user_id: {

            type: "VARCHAR(50)",

            notNull: true,

        },

    });

    pgm.addConstraint("collaborations", "unique_playlist_id_and_user_id", "UNIQUE(playlist_id, user_id)");

    pgm.addConstraint("collaborations", "fk_collaborations.playlist_id_playlist.id", "Foreign key(playlist_id) References playlist(id) on delete cascade");

    pgm.addConstraint("collaborations", "fk_collaborations.user_id_users.id", "Foreign key(user_id) References users(id) on delete cascade");
};

exports.down = (pgm) => {
    pgm.dropConstraint("collaborations", "unique_playlist_id_and_user_id");

    pgm.dropConstraint("collaborations", "fk_collaborations.playlist_id_playlist.id");

    pgm.dropConstraint("collaborations", "fk_collaborations.user_id_users.id");

    pgm.dropTable("collaborations");
};
