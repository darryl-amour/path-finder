/** @constant {number} */
const MOVE_COST = 10; // Assume using only search paths top (N), right (E), bottom (S), left (W)
/** @constant {Array} */
const SEARCH_PATHS = ['N', 'E', 'S', 'W'];


/**
 * @typedef Pos
 * @type {Array}
 * @property {number} Pos.row - row position within two dimensional gridMap array.
 * @property {number} Pos.column - column position within two dimensional gridMap array.
 */


/**
 * Node Class
 * @class
 * @classdesc Used to represent each cell in our 2 dimensional gridMap
 */
class Node {
  /**
   *
   * @param {number} h - estimated movement cost to move from a Node's given
   *                     pos on the grid to final destination.
   * @param {number} g - movement cost to move from the starting point to a
   *                     given square on the grid.
   * @param {Pos} pos - Position of node ([row, column]).
   * @param {Node} parent - reference to parent Node
   */
  constructor(h, g, pos, parent = null) {
    this.h = h;
    this.g = g;
    // grid position of Node
    this.pos = pos;
    this.parent = parent;
  }

  get f() {
    return this.h + this.g; // sum of (h + g)
  }
}


/**
 * Calculate approximate heuristic (h) using Manhattan Distance method
 * @param {Array} nodePos - Position of a node ([row, column]).
 * @param {Array} targetPos - Position of target node ([row, column]).
 */
const calcH = (nodePos, targetPos) => (
  Math.abs(nodePos[0] - targetPos[0])
  + Math.abs(nodePos[1] - targetPos[1])
);


/**
 * Identify grid position of intended target
 * @param {(number|string)} targetVal - number or character representing target
 * @param {Array} gridMap - 2 dimensional grid array
 * @return {Pos}
 */
const getTargetPos = (targetVal, gridMap) => {
  for (let row = 0; row < gridMap.length; row += 1) {
    for (let col = 0; col < gridMap[row].length; col += 1) {
      if (gridMap[row][col] === targetVal) return [row, col];
    }
  }
  // unable to locate target
  return null;
};


/**
 * Determines if a Node position is within the boundaries of
 * a gridMap and it is on a valid cell, not an obstacle.
 * @param {Pos} pos
 * @param {number} numRows
 * @param {number} numColumns
 * @param {(number|string)} obstacleVal
 * @param {Array.<Array>} gridMap
 */
const isValidNode = (pos, numRows, numColumns, obstacleVal, gridMap) => {
  let isValid = false;
  // Check Node is within boundary and not an Obstacle
  if (
    pos[0] >= 0 && pos[0] < numRows
    && pos[1] >= 0 && pos[1] < numColumns
    && gridMap[pos[0]][pos[1]] !== obstacleVal) {
    // Passed Validation
    isValid = true;
  }
  return isValid;
};


/**
 * @typedef ShortestPath
 * @type {Object}
 * @property {Array.<Pos>} ShortestPath.path - array of positions for each Node that was traversed
 *                                           to get from the starting position to the target value.
 * @property {number} ShortestPath.traversals - number of traversals from starting position to the
 *                                              target value.
 */


/**
 * pathFinder - Given as input a target value, obstacle value, starting position and
 * a grid map (2 dimensional array). Find the shortest path. Return the
 * minimum path and number of traversals to an object represented
 * by targetVal in gridMap. Note obstacle values are not passable and
 * you must find a way around.
 *
 *    Input:
 *          targetVal = 'X'
 *          obstacleVal = 0
 *          startPos = [0, 0]
 *          gridMap = [[1, 1, 1], [1, 0, 0], [1, 'X', 0]]
 *    Output:
 *          { path: [[0, 0], [1, 0], [2, 0], [2, 1]], traversals: 3 }
 *
 * @param {(number|string)} targetVal - number or character representing target
 * @param {(number|string)} obstacleVal - number or character representing obstacle
 * @param {Pos} startPos - starting grid position
 * @param {Array.<Array>} gridMap - Two dimensioal array.
 * @return {ShortestPath} - Shortest path which includes number of traversals
 */
const pathFinder = (targetVal, obstacleVal, startPos, gridMap) => {
  // Initialize return values
  /** @type {Array.<Pos>} */
  const path = [];
  let traversals = 0;

  // Determine target position
  const targetPos = getTargetPos(targetVal, gridMap);

  // Edge Case: unable to identify a target
  if (targetPos) {
    const numRows = gridMap.length;
    const numColumns = gridMap[0].length;

    // Initialize the open list
    const openList = {};
    // Initialize the closed list
    const closedList = {};

    // Add starting node to openList
    const startNode = new Node(calcH(startPos, targetPos), 0, startPos);
    openList[startNode.pos] = startNode;

    // iterate while openList is not empty
    while (Object.keys(openList).length > 0) {
      // Find node w/ least f on openList
      let lowFKey;
      Object.keys(openList).forEach((key) => {
        if (!lowFKey) {
          lowFKey = key;
        } else if (openList[key].f < openList[lowFKey].f) lowFKey = key;
      });

      // process node w/ lowest f score as currentNode
      let currentNode = openList[lowFKey];
      // Remove from openList
      delete openList[lowFKey];

      // add currentNode to closedList
      closedList[currentNode.pos] = currentNode;

      // Edge Case: if currentNode is target return traced path and number of traversals
      if (currentNode.pos[0] === targetPos[0] && currentNode.pos[1] === targetPos[1]) {
        do {
          // add position of node to path
          path.push(currentNode.pos);
          // move to next node
          currentNode = currentNode.parent;
        } while (currentNode);
        // calculate traversals
        traversals = path.length - 1;
        // reverse for path from start to target
        path.reverse();
        break;
      }

      /** Generate valid successor nodes */

      // variables used to generate each successor node
      let newNodeRow;
      let newNodeCol;
      let newSuccessorNode;
      let direction;

      // generate newNode for each search path top (N), right (E), bottom (S), left (W)
      for (let i = 0; i < SEARCH_PATHS.length; i += 1) {
        // initialize row/col and direction for new Node
        [newNodeRow, newNodeCol] = currentNode.pos;
        direction = SEARCH_PATHS[i];

        // Adjust row/col based on direction
        if (direction === 'N') newNodeRow -= 1;
        else if (direction === 'E') newNodeCol += 1;
        else if (direction === 'S') newNodeRow += 1;
        else if (direction === 'W') newNodeCol -= 1;
        else {
          // unhandled directions
          throw new Error(`Unhandled search path direction: ${direction}`);
        }

        if (
          isValidNode(
            [
              newNodeRow,
              newNodeCol,
            ],
            numRows, numColumns,
            obstacleVal,
            gridMap,
          )
        ) {
          // Create new Node
          // set new Node.h = calcH(newNode.pos, target)
          // set new Node.g = currentNode.g + MOVE_COST
          // set new Node.pos = [newNodeRow, newNodeCol]
          // set new Node.parent = currentNode
          newSuccessorNode = new Node(
            calcH([newNodeRow, newNodeCol], targetPos),
            currentNode.g + MOVE_COST,
            [newNodeRow, newNodeCol],
            currentNode,
          );

          // Three validation checks for adding to openList:
          // #1) newSuccessorNode.pos does not exist on closed list AND
          // #2) If newSuccessorNode already on openList only add if lower f score OR
          // #3) newSuccessorNode.pos does not exist on open list
          if (
            (!closedList[newSuccessorNode.pos])
            && (!openList[newSuccessorNode.pos]
            || (openList[newSuccessorNode.pos]
            && newSuccessorNode.f < openList[newSuccessorNode.pos].f))
          ) {
            // Add to openList
            openList[newSuccessorNode.pos] = newSuccessorNode;

            // check if we have discovered target
            // do not need to generate anymore newSuccessorNode
            if (
              newSuccessorNode.pos[0] === targetPos[0]
              && newSuccessorNode.pos[1] === targetPos[1]
            ) break;
          }
        }
      }
    }
  }

  // Return Shortest Path, possibility no Path was found
  return { path, traversals };
};


module.exports = pathFinder;
