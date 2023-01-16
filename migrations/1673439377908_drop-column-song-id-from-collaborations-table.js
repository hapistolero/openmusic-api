/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.dropColumns('collaborations','song_id')
};

exports.down = pgm => {
    pgm.addColumns('collaborations',{
        song_id:{
            type:'VARCHAR(50)',
            notNull: true,
        },
    })

};
