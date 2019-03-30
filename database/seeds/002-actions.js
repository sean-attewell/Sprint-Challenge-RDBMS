
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('actions').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('actions').insert([
        { action_name: 'Buy seeds', action_notes: 'notes about buying seeds', action_completed: false, project_id: 1 },
        { action_name: 'Plant seed', action_notes: 'notes about buying planting seeds', action_completed: false, project_id: 1 },
        { action_name: 'Just build the house', action_notes: 'notes about building the house', action_completed: false, project_id: 2 }
      ]);
    });
};
