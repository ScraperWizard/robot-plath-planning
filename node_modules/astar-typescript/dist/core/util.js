"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backtrace = void 0;
/**
 * Backtrace from end node through parents and return the path.
 * @param node
 * @param includeStartingNode
 */
function backtrace(node, includeStartNode, includeEndNode) {
    // Init empty path
    const path = [];
    // If `includeEndNode` is enabled, attach the end node to be the current node
    let currentNode = includeEndNode ? node : node.getParent();
    // Loop as long the current node has a parent
    while (currentNode.getParent()) {
        path.push([currentNode.position.x, currentNode.position.y]);
        currentNode = currentNode.getParent();
    }
    // If true we will also include the starting node
    if (includeStartNode) {
        path.push([currentNode.position.x, currentNode.position.y]);
    }
    return path.reverse();
}
exports.backtrace = backtrace;
