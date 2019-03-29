const express = require('express');

const knex = require('knex');
const knexConfig = require('./knexfile.js').development;
const db2 = knex(knexConfig);

const server = express();
const db = require('./database/dbHelpers');;

server.use(express.json());

// GET all projects
server.get('/api/projects', async (req, res) => {
    try {
        const allProjects = await db.getProjects();
        res.status(200).json(allProjects);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// GET all actions
server.get('/api/actions', async (req, res) => {
    try {
        const allActions = await db.getActions();
        res.status(200).json(allActions);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// POST a project
server.post('/api/projects', (req, res) => {
    if (!req.body.project_name || !req.body.project_description) {
        res.status(400).json({ error: "Please enter project_name and project_description" });
    } else {
        db.addProject(req.body)
            .then(arrayOfId => {
                res.status(201).json(arrayOfId)
            })
            .catch(err => {
                res.json({ error: "Some useful error message" });
            })
    }
});

// POST an action
server.post('/api/actions', (req, res) => {
    if (!req.body.action_name || !req.body.action_notes || !req.body.project_id) {
        res.status(400).json({ error: "Please enter action_name, action_notes and project_id" });
    } else {
        db.addAction(req.body)
            .then(arrayOfId => {
                res.status(201).json(arrayOfId)
            })
            .catch(err => {
                res.json({ error: "Some useful error message" });
            })
    }
});

// Luis soltuion
// get project by ID and array of related actions
// I think the helper function breaks if id doesn't exist so falls into catch
// server.get('/api/projects/:id', async (req, res) => {
//     try {
//         const project = await db.getProjectById(req.params.id);
//         if (project.id === Number(req.params.id)) {
//             res.status(200).json(project);
//         } else {
//             res.status(404).json({ message: `id ${req.params.id} doesn't exist ` })
//         }
//     } catch (error) {
//         res.status(500).json({ message: `id ${req.params.id} doesn't exist ` });
//     }
// });


// Chicken dinner knex solution
// 1 query for the project, one for the related actions
// simpy put the outputs together in the response json

// only things missing are converting boolean to true/false instead of 1/0
// and handling the error case
server.get("/api/projects/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const projectArray = await db.getProjectWithId(id);
        const actions = await db.getActionsForProjectWithId(id)

        res.status(200).json({ ...projectArray[0], actions: actions });
    } catch (error) {
        res.status(400).json({ message: "Id not found", error });
    }
});


const port = 3300;
server.listen(port, function () {
    console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
