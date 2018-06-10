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
            { name:'pretty', color1: '#234kjl', color2: '#234kjl', color3: '#234kjl', color4: '#234kjl', color5: '#234kjl', project_id: palettes[0] },
            { name:'other', color1: '#234kjl', color2: '#234kjl', color3: '#234kjl', color4: '#234kjl', color5: '#234kjl', project_id: palettes[0] },
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
