

module.exports = (app, io) => {
    const NodeController =  require('../controllers/node_controller')(io);
    app.get('/api/getnodes', NodeController.getNodes);
    app.put('/api/updatenode', NodeController.updateNode);
}