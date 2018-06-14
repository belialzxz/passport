const Node =  require('../db/models/Node');

module.exports = function(io) {

    let controller = {};
    controller.getNodes = function(req, res, next){
        Node.find((err, nodes) => {
            if(err)
                return next(err);
                res.status(200).json(nodes);
                
        });
    };
    controller.updateNode = function(req, res, next){
        Node.findByIdAndUpdate(req.body._id, req.body)
            .then((oringalData) => {
                Node.find((err, nodes) => {
                    if(err)
                        return next(err);
                    io.emit('data', nodes);
                    res.status(204).send();
                })
                
                
            })
            .catch(next);
    };

    return controller;
}