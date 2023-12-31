const e = require("cors");
const db = require("../models");
const Map = db.map;
const Customer = db.customer;

const streets = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const avenues = ['1', '2', '3', '4', '5', '6', '7'];
var writeToDb = false;

const vertices = {};
const edges = [];

function numVertices() {
    return vertices.length;
}

function numEdges() {
    return edges.length;
}

function getEdge(u, v) {
    for (var i = 0; i < numEdges(); i++) {
        if (edges[i].start == u && edges[i].end == v) {
            return edges[i];
        }
    }
    return null;
}

function endVertices(e) {
    return [e.start, e.end];
}

function opposite(v, e) {
    if (e.start == v) {
        return e.end;
    }
    if (e.end == v) {
        return e.start;
    }
    throw new Error("vertex not found!");
}

function outDegree(v) {
    var count = 0;
    for (var i = 0; i < numEdges(); i++) {
        if (edges[i].start == v) {
            count++;
        }
    }
    return count;
}

function inDegree(v) {
    var count = 0;
    for (var i = 0; i < numEdges(); i++) {
        if (edges[i].end == v) {
            count++;
        }
    }
    return count;
}

function outgoingEdges(v) {
    var oe = [];
    for (var i = 0; i < numEdges(); i++) {
        if (edges[i].start == v) {
            oe.push(edges[i]);
        }
    }
    return oe;
}

function incomingEdges(v) {
    var ie = [];
    for (var i = 0; i < numEdges(); i++) {
        if (edges[i].end == v) {
            ie.push(edges[i]);
        }
    }
    return ie;
}

function insertVertex(x) {
    if (!vertices[x]) {
        vertices[x] = new Set();
    }
    return vertices;
}

function insertEdge(u, v, bi = false, x = 1) {
    if (!vertices[u]) {
        return;
    }
    if (!vertices[v]) {
        return;
    }
    vertices[u].add(v);
    storeNodes(u,v);
    if (bi) {
        storeNodes(v, u);
        vertices[v].add(u);
    }
    return edges;
}

function removeVertex(v) {
    if (vertices[v]) {
        for (let adjacentVertex of vertices[v]) {
            removeEdge(v, adjacentVertex);
            for (let adjacentVertexBi of vertices[adjacentVertex]) {
                if (hasEdge(adjacentVertexBi, v)) {
                    removeEdge(adjacentVertexBi, v);
                }
            }
        }
        delete vertices[v];
    }
}

function removeEdge(u, v) {
    vertices[u].delete(v);
    // vertices[v].delete(u);
}

function hasEdge(u, v) {
    return vertices[u].has(v);
}

function createVertices() {
    for (var i = 0; i < streets.length; i++) {
        for (var j = 0; j < avenues.length; j++) {
            insertVertex(streets[i] + avenues[j]);
        }
    }
}

function calculateMap() {
    var bi = false;
    for (var i = 0; i < streets.length; i++) {
        for (var j = 0; j < avenues.length; j++) {
            //vertical edges
            if (i % 2 == 0) {
                insertEdge(streets[i] + avenues[j], streets[i] + avenues[j + 1]);
                //horizontal edges
                if (j % 2 == 0) {
                    insertEdge(streets[i + 1] + avenues[j], streets[i] + avenues[j]);
                } else {
                    if (avenues[j] == '2' || avenues[j] == '6') {
                        bi = true;
                    }
                    insertEdge(streets[i] + avenues[j], streets[i + 1] + avenues[j], bi);
                    bi = false;
                }
            } else {
                if (streets[i] == 'D') {
                    bi = true;
                }
                insertEdge(streets[i] + avenues[j + 1], streets[i] + avenues[j], bi);
                bi = false;
                if (j % 2 == 0) {
                    insertEdge(streets[i + 1] + avenues[j], streets[i] + avenues[j]);
                } else {
                    if (avenues[j] == '2' || avenues[j] == '6') {
                        bi = true;
                    }
                    insertEdge(streets[i] + avenues[j], streets[i + 1] + avenues[j], bi);
                    bi = false;
                }
            }
        }
    }
}

function print() {
    for (let v in vertices) {
        console.log(v + "->" + [...vertices[v]])
    }
}

function storeNodes(u, v) {
    var map = {
        fromNode: u,
        toNode: v,
    };
    if(writeToDb){
        Map.create(map)
            .catch((err) => {
                throw new Error("Some error occurred while creating the Map."+err);            
            });
    }
}

async function fetchMap() {
    var length = -1;
    await Map.findAll({
        raw: true,
        order: [
            ["createdAt", "ASC"],
          ],
        })
    .then((data)=> {
        if(!data.length){
            writeToDb = true;
            length = 0;
            return length;
        }
        for(var i = 0; i< data.length; i++){
            insertVertex(data[i].fromNode);                 //{ 'A0': new Set()}
            insertVertex(data[i].toNode);                   //{ 'B1': new Set()}
            insertEdge(data[i].fromNode, data[i].toNode);   //{'A0': ['B1', 'B2']}
        }
    })
    .catch((err) => {
        throw new Error(err.message || "Some error occurred while creating the Map.");
    });
    return length;
}

async function init() {
    createVertices();
    calculateMap();
    // print();
    writeToDb = false;
}

function decoratePath(path){
    var decoratedPath = "Start from ";
    for(var node in path){
        var street = path[node].substring(0,1);
        var avenue = path[node].substring(1,2);
        var ave = "";
        if(parseInt(avenue) == 1){
            ave = "st";
        }else if(parseInt(avenue) == 2){
            ave = "nd";
        }else if(parseInt(avenue) == 3){
            ave = "rd";
        }else if(parseInt(avenue) >= 4){
            ave = "th";
        }
        decoratedPath += avenue + ave + " Ave and " + street + " Street,\n then, go to ";
    }
    var directions = decoratedPath.substring(0, (decoratedPath.length-14));
    return { 'directions': directions};
}

exports.findRoute = async (req, res) => {
    var length = await fetchMap();
    if(length === 0){
        await init();
    }
    
    var c1 = req.params.customerId;
    var c2 = req.params.deliverToCustomerId;
    await Customer.findOne({
            where: {
                id: c1
            },
        })
        .then(async (c1data) => {
            await Customer.findOne({
                    where: {
                        id: c2
                    },
                })
                .then((c2data) => {
                    var c1address = c1data.dataValues.address;
                    var c2address = c2data.dataValues.address;
                    var start = c1address.substring(12,13) + c1address.substring(0,1);
                    var end = c2address.substring(12,13) + c2address.substring(0,1);
                    var path = getShortestPathUsingDijkstrasAlgorithm(start, end);

                    if (path.length) {
                        res.send(decoratePath(path));
                    } else {
                        res.status(404).send({
                            message: `Cannot find path!`,
                        });
                    }
                })
                .catch((err) => {
                    res.status(500).send({
                        message: err.message || "Error retrieving Customer.",
                    });
                })
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Error retrieving Customer.",
            });
        });
};
// getShortestPathUsingDijkstrasAlgorithm('G5', 'A2');
exports.findRouteLength = async (c1, c2) => {
    var length = await fetchMap();
    if(length === 0){
        await init();
    }
    return await callAlgorithm(c1, c2).then((result)=> {return result;});
};

async function callAlgorithm(c1, c2){
    var pathLength = 0;
    await Customer.findOne({
        raw: true,
        where: {
            id: c1
        },
    })
    .then(async (c1data) => {
        await Customer.findOne({
                raw: true,
                where: {
                    id: c2
                },
            })
            .then((c2data) => {
                var c1address = c1data.address;
                var c2address = c2data.address;
                var start = c1address.substring(12,13) + c1address.substring(0,1);
                var end = c2address.substring(12,13) + c2address.substring(0,1);
                
                var path = getShortestPathUsingDijkstrasAlgorithm(start, end);
                if (path.length) {
                    pathLength = path.length;
                    return path.length;
                } else {
                    throw new Error(`Cannot find path!`);
                }
            })
            .catch((err) => {
                throw new Error(err.message || "Error retrieving Customer.");
            });
    })
    .catch((err) => {
        throw new Error(err.message || "Error retrieving Customer.");
    });
    return pathLength;
}

function getShortestPathUsingDijkstrasAlgorithm(start, end) {

    var distance = {};
    var previousNodes = {};
    var toVisit = new Set();
    var shortestPath = [];

    for (var node in vertices) {
        distance[node] = Infinity;
        if (node == start) {
            distance[node] = 0;
        }
        toVisit.add(node);
    }
    while (toVisit.size) {
        var nextNode = null;
        for (var node of toVisit) {
            if (!nextNode || distance[node] < distance[nextNode]) {
                nextNode = node;
            }
        }
        if (distance[nextNode] == Infinity) break;
        if (nextNode == end) break;
        // console.log(node, distance[node], distance[nextNode], vertices[nextNode]);
        for (let next of vertices[nextNode]) {
            // console.log( distance[nextNode], );
            var tempDistance = distance[nextNode] + 1;
            if (tempDistance < distance[next]) {
                distance[next] = tempDistance;
                previousNodes[next] = nextNode;
                // console.log(nextNode);
            }
        }
        toVisit.delete(nextNode);
    }
    // console.log(previousNodes);
    var i = end;
    shortestPath.push(i);
    while (i != undefined) {
        i = previousNodes[i];
        if (i != undefined) {
            shortestPath.unshift(i);
        }
    }
    return shortestPath;
}