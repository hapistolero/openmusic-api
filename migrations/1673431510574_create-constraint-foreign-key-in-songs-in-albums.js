

exports.up = pgm => {
    
   
       pgm.addConstraint('songs','fk_songs.albumId_albums.id','Foreign key("albumId") References albums(id) on delete cascade')
   
   
   };
   
   exports.down = pgm => {
    pgm.dropConstraint('songs','"unique_albumId"')
       
   };
   