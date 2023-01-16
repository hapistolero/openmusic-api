

exports.up = pgm => {    
   
       pgm.addConstraint('playlist','fk_playlist.owner_users.id','Foreign key(owner) References users(id) on delete cascade')
   
   
   };
   
   exports.down = pgm => {
       pgm.dropConstraint('playlist','fk_playlist.owner_users.id')

   };
   