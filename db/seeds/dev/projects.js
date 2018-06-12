exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('palettes').del()
    .then(() => knex('projects').del())

    .then(() => {
      return Promise.all([
        
        // Insert a single project, return the project ID, insert 2 palettes
        knex('projects').insert({
          name: 'Amazing palettes'
        }, 'id')
          .then(palettes => {
            return knex('palettes').insert([               	          	            	          	           	
              { name:'pretty', color1: '#1373f7', color2: '#37aed3', color3: '#3a49d4', color4: '#6fb87b', color5: '#16802d', project_id: palettes[0] },
              { name:'other', color1: '#16802d', color2: '#6fb87b', color3: '#3a49d4', color4: '#37aed3', color5: '#1373f7', project_id: palettes[0] }
            ]);
          })
          .then(() => console.log('Seeding complete!'))
          .catch(error => console.log(`Error seeding data: ${error}`))
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
