import earcut from "earcut";
import Cartesian2 from "./Cartesian2.js";
import Check from "./Check.js";
import WindingOrder from "./WindingOrder.js";

/**
 * @private
 */
const PolygonPipeline = {};

/**
 * @exception {DeveloperError} At least three positions are required.
 */
PolygonPipeline.computeArea2D = function (positions) {
  //>>includeStart('debug', pragmas.debug);
  Check.defined("positions", positions);
  Check.typeOf.number.greaterThanOrEquals(
    "positions.length",
    positions.length,
    3,
  );
  //>>includeEnd('debug');

  const length = positions.length;
  let area = 0.0;

  for (let i0 = length - 1, i1 = 0; i1 < length; i0 = i1++) {
    const v0 = positions[i0];
    const v1 = positions[i1];

    area += v0.x * v1.y - v1.x * v0.y;
  }

  return area * 0.5;
};

/**
 * @returns {WindingOrder} The winding order.
 *
 * @exception {DeveloperError} At least three positions are required.
 */
PolygonPipeline.computeWindingOrder2D = function (positions) {
  const area = PolygonPipeline.computeArea2D(positions);
  return area > 0.0 ? WindingOrder.COUNTER_CLOCKWISE : WindingOrder.CLOCKWISE;
};

/**
 * Triangulate a polygon.
 *
 * @param {Cartesian2[]} positions Cartesian2 array containing the vertices of the polygon
 * @param {number[]} [holes] An array of the staring indices of the holes.
 * @returns {number[]} Index array representing triangles that fill the polygon
 */
PolygonPipeline.triangulate = function (positions, holes) {
  //>>includeStart('debug', pragmas.debug);
  Check.defined("positions", positions);
  //>>includeEnd('debug');

  const flattenedPositions = Cartesian2.packArray(positions);
  return earcut(flattenedPositions, holes, 2);
};

export default PolygonPipeline;
