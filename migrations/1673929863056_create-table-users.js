/* eslint-disable linebreak-style */
exports.up = (pgm) => {
    pgm.createTable("users", {

        id: {

            type: "VARCHAR(50)",

            primaryKey: true,

        },

        username: {

            type: "VARCHAR(50)",

            notNUll: true,

            unique: true,

        },

        password: {

            type: "TEXT",

            notNull: true,

        },

        fullname: {

            type: "TEXT",

        },

    });
};

exports.down = (pgm) => {
    pgm.dropTable("users");
};
