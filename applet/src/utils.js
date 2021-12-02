/**
 * @author Hassan Nehme, studentID : 000436655
 */

class utils {
  /**
   * Used to compute the different components of
   * the orientation determinant.
   * @param {Point} p1 A first point of the triplet.
   * @param {Point} p2 A second point of the triplet.
   * @returns A subcomponent of the orientation determinant.
   */
  computeSubResult(p1, p2) {
    return p1.x * p2.y - p1.y * p2.x;
  }

  /**
   * Computes the orientation determinant of a triplet of points.
   * @param {Point} p1 The first point of the triplet.
   * @param {Point} p2 The second point of the triplet.
   * @param {Point} p3 The third point of the triplet.
   * @returns The orientation as a left turn or a right turn.
   */
  orientation(p1, p2, p3) {
    const triplet = [p1, p2, p3];
    let determinant = 0;
    for (const i in triplet) {
      determinant += this.computeSubResult(triplet[i], triplet[(i + 1) % triplet.length]);
    }
    if (determinant === 0) return 2;
    return determinant > 0 ? 0 : 1; //1 is LT
  }

  /**
   * Draws an edge between every two consecutive points in the array of points.
   * @param {Object} polyPoints The polyline.
   * @param {Object} strokeVals The color in RGB.
   */
  simplePolyline(polyPoints, strokeVals = [100, 0, 200]) {
    stroke(strokeVals[0], strokeVals[1], strokeVals[2]);
    if (polyPoints.length > 1) {
      for (let i = 0; i < polyPoints.length - 1; ++i) {
        line(polyPoints[i].x, polyPoints[i].y, polyPoints[i + 1].x, polyPoints[i + 1].y);
      }
    }
  }

  /**
   * Given four points  p1, p2, p3 and p4, determines if the line segment p1p2
   * intersect the line segment p3p4.
   * @param {Point} p1 The first endpoint of the first line segment.
   * @param {Point} p2 The second endpoint of the first line segment.
   * @param {Point} p3 The first endpoint of the second line segment.
   * @param {Point} p4 The second endpoint of the second line segment.
   * @returns  True if the segment p1p2 intersects the segment p3p4 and false otherwise.
   */
  intersection(p1, p2, p3, p4) {
    if (this.orientation(p1, p2, p3) !== this.orientation(p1, p2, p4))
      if (this.orientation(p3, p4, p1) !== this.orientation(p3, p4, p2)) return true;
    return false;
  }

  /**
   * Checks if the new point that the user chose for the next vertex is valid.
   * Meaning that the edge made by connecting that point to the last valid vertex
   * does NOT cross any former edge.
   * @param {Point} extraPoint The added point.
   * @returns True if the point is valid and false otherwise.
   */
  isValid(extraPoint) {
    for (let i = 0; i < points.length - 2; ++i) {
      if (extraPoint !== points[i]) {
        const quad = [points[points.length - 1], extraPoint, points[i], points[i + 1]];
        if (this.intersection(quad[0], quad[1], quad[2], quad[3])) {
          return false;
        }
      }
    }
    return true;
  }
}
