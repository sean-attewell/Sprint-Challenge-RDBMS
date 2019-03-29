const knex = require('knex');
const knexConfig = require('../knexfile.js').development;

const db = knex(knexConfig);

module.exports = {
    getProjects,
    getActions,
    addProject,
    addAction,
    getProjectById
};

function getProjects() {
    return db("projects");
}

function getActions() {
    return db("actions");
}

function addProject(project) {
    return db("projects")
        .insert(project)
}

function addAction(action) {
    return db("actions")
        .insert(action)
}

function getProjectById(id) {
    return db("projects")
        .leftJoin("actions", "projects.id", "=", "actions.project_id")
        .select("*")
        .where({ "projects.id": id })
        // .groupBy('dishes.dish_name')
}