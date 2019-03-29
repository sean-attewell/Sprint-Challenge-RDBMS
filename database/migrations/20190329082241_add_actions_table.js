
exports.up = function(knex, Promise) {
    return knex.schema.createTable('actions', function (tbl) {
        tbl
            .increments(); // pass the name if you wanted to be called anything other than id

        tbl
            .string('action_name', 255)
            .notNullable()
            .unique('uq_action_name');

        tbl
            .string('action_notes', 255);

        tbl
            .boolean('action_completed')
            .defaultTo(false);

        tbl
            .integer('project_id')
            .unsigned()
            .references('id')
            .inTable('projects')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('actions');
};
