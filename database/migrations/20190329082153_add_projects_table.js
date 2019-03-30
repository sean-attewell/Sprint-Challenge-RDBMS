
exports.up = function(knex, Promise) {
    return knex.schema.createTable('projects', function (tbl) {
        tbl
            .increments(); // pass the name if you wanted to be called anything other than id

        tbl
            .string('project_name', 255)
            .notNullable()
            .unique('uq_project_name');

        tbl
            .string('project_description', 255)
            .notNullable();

        tbl
            .boolean('project_completed')
            .defaultTo(false);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('projects');
};
