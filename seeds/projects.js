
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('colors').del()
    .then(() => knex('projects').del())

    .then(() => {
      return Promise.all([
        
        // Insert a single project, return the project ID, insert 2 colors
        knex('projects').insert({
          name: 'pastel-journey'
        }, 'id')
        .then(colors => {
          return knex('colors').insert([
            { name: 'jason_mraz', project_id: colors[0] },
            { name: 'dmb', project_id: colors[0] }
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
