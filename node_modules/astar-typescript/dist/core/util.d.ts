import { Node } from './node';
/**
 * Backtrace from end node through parents and return the path.
 * @param node
 * @param includeStartingNode
 */
export declare function backtrace(node: Node, includeStartNode: boolean, includeEndNode: boolean): number[][];
