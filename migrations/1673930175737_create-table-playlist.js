/* eslint-disable linebreak-style */
exports.up = (pgm) => {
    pgm.createTable("playlist",

        {

            id: {

                type: "VARCHAR(50)",

                primaryKey: true,

                notNull: true,

            },

            name: {

                type: "VARCHAR(50)",

                notNull: true,

            },

            owner: {

                type: "VARCHAR(50)",

                notNull: true,

            },

        });

    pgm.addConstraint("playlist", "fk_playlist.owner_users.id", "Foreign key(owner) References users(id) on delete cascade");
};

exports.down = (pgm) => {
    pgm.dropConstraint("playlist", "fk_playlist.owner_users.id");
    pgm.dropTable("playlist");
};
