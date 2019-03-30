
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('projects').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('projects').insert([
        { project_name: 'Plant a tree', project_description: 'Description for planting a tree project', project_completed: false },
        { project_name: 'Build a house', project_description: 'Description for building a house project', project_completed: false }
      ]);
    });
};
