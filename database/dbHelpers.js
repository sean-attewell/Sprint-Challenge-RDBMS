const knex = require('knex');
const knexConfig = require('../knexfile.js').development;

const db = knex(knexConfig);

module.exports = {
    getProjects,
    getActions,
    addProject,
    addAction,
    getProjectById,
    getProjectWithId,
    getActionsForProjectWithId
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

// *** THIS KIND OF WORKS 
// *** Does not nest the actions in an array - just repeats
// *** the project for each action
// function getProjectById(id) {
//     return db("projects")
//         .leftJoin("actions", "projects.id", "=", "actions.project_id")
//         .select("*")
//         .where({ "projects.id": id })
// }


// *** The lengthy Luis method ***
function intToBoolean(int) {
    return int === 1 ? true : false;
}

function projectToBody(project) {
    const result = {
        ...project,
        project_completed: intToBoolean(project.completed),
    };

    if (project.actions) {
        result.actions = project.actions.map(action => ({
            ...action,
            completed: intToBoolean(action.completed),
        }));
    }

    return result;
}

function actionToBody(action) {
    return {
        ...action,
        completed: intToBoolean(action.completed),
    };
}

function getProjectActions(projectId) {
    return db('actions')
        .where('project_id', projectId)
        .then(actions => actions.map(action => actionToBody(action)));
}

function getProjectById(id) {
    let query = db('projects as p');

    if (id) {
        query.where('p.id', id).first();

        const promises = [query, getProjectActions(id)]; // [ projects, actions ]

        return Promise.all(promises).then(function (results) {
            let [project, actions] = results;
            project.actions = actions;

            return projectToBody(project);
        });
    }

    return query.then(projects => {
        return projects.map(project => projectToBody(project));
    });
}

// Chicken dinner
// The much better Connor method:

function getProjectWithId(id) {
    return db("projects")
        .where({ id });
}

function getActionsForProjectWithId(id) {
    return db.select(
        "actions.id",
        "actions.action_name",
        "actions.action_notes",
        "actions.action_completed"
        )
        .from("projects")
        .innerJoin("actions", "projects.id", "=", "actions.project_id")
        .where("projects.id", "=", id);
}