const db = require("../models");
const Map = db.map;
const Direction = db.direction;

function calculateMap(){
    var nodes = [];
    for(var i=0;i<7;i++){
        for(var j=0;j<2;j++){
            if(j % 2 == 1){
                nodes.push(i+" Ave");
            }else{
                nodes.push(String.fromCharCode(i+65)+" Street");
            }
        }
    
        var nodeName = "";
        var adjacentNodes = [];
        for(var i=0;i<nodes.length; i++){
            nodeName = nodes[i]+" and "+ nodes[i+1];
            adjacentNodes.push(nodes[i+2] + " and "+ nodes[i+3]);
        }

        Map.create(
            {
                name:nodeName,
                adjacentNodes: adjacentNodes,
            });
    }
}

function getShortestPath(start, end, map){
    var distance = Infinity;
    var nearestNode = null;
    var shortestPath = [];
    for(var node in map){
        if(node[distance]>nearestNode.distance){
            nearestNode = node;
        }
    
        if(!nearestNode) break;
        // if(distance == Infinity) break;
        for(var node in map){
            let currentNode = node;
            if(currentNode.distance < nearestNode){
                nearestNode =currentNode;
            }
        }
        shortestPath.push(nearestNode);
        if(currentNode == end){
            break;
        }
    }
    return shortestPath;

}
