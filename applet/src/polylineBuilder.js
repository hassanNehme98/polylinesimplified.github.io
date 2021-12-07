/**
 *
 * @author Hassan Nehme, studentID : 000436655
 * Class used to create polylines which are available for the user.
 * Can be directly used instead of drawing a polyline.
 */
class polylineBuilder {
  constructor() {}

  /**
   * Provides a random number from a set of values.
   * @param {Number} nbVals The number of values.
   * @returns A random integer in the range [0, nbVals - 1]
   */
  getRandomInt(nbVals) {
    return Math.floor(Math.random() * nbVals);
  }

  /**
   * The curve is given by the function f(x) = e(-x)cos(2PIx).
   * @returns The curve as a list of connected points.
   */
  decreasingExp() {
    let curvePoints = [];
    for (let x = 0; x < windowWidth; x = x + 6) {
      const xval = map(x, 0, windowWidth, 0, 5);
      const yval = exp(-xval) * cos(TWO_PI * xval);
      const y = map(yval, -1, 1, windowHeight, 0);
      curvePoints.push(new Point(x, y + 148));
    }
    return curvePoints;
  }

  /**
   * The curve is given by the function f(x) = sin(x).
   * @returns The curve as a list of connected points.
   */
  sinusShaped() {
    let curvePoints = [];
    for (let x = 0; x < windowWidth; x = x + 2) {
      const angle = map(x, 0, windowWidth, -10 * TWO_PI, 10 * TWO_PI);
      const yval = sin(angle);
      const y = map(yval, -1, 1, windowHeight * 0.75, 0);
      curvePoints.push(new Point(x, y + 200));
    }
    return curvePoints;
  }

  /**
   * The curve is given by the function f(x) = sin(x)/x.
   * @returns The curve as a list of connected points.
   */
  gaussianShaped() {
    let curvePoints = [];
    for (let x = 0; x < windowWidth; x++) {
      const angle = map(x, 0, windowWidth, -10 * TWO_PI, 10 * TWO_PI);
      if (angle != 0) {
        const yval = sin(angle) / angle;
        const y = map(yval, -1, 1, windowHeight * 0.75, 0);
        curvePoints.push(new Point(x, y + 300));
      }
    }
    return curvePoints;
  }

  /**
   * Calls one of the functions above to provide a polyline at random.
   * @returns A polyline at random.
   */
  chooseRandFunc() {
    let r = this.getRandomInt(3);
    console.log(r);
    switch (r) {
      case 0:
        return this.decreasingExp();
      case 1:
        return this.sinusShaped();
      case 2:
        return this.gaussianShaped();
    }
  }

  /**
   * Returns a selve intersecting curves. The algorithm
   * proposed is NOT designed to deal with this type of curves.
   * But it is interesting to visualize the result nevertherless.
   * @returns A self intersecting curve.
   */
  intersectingCurves() {
    let curvePoints = [];
    for (let t = 0; t < windowWidth; t++) {
      const x_t = sin(t / 10) * 200 + sin(t / 15) * 200 + windowWidth / 2;
      const y_t = cos(t / 10) * 200 + windowHeight / 2;

      curvePoints.push(new Point(x_t, y_t));
    }
    console.log(curvePoints);
    return curvePoints;
  }

  /**
   * Builds a polyline from data in a file representing a map.
   * @param {String} polygon The string containing the file data.
   * @returns The polyline as an array of points.
   */
  loadMap(polygon) {
    let polyline = [];
    console.log(polygon.length);
    if (polygon.length > 0) {
      for (let i = 0; i < polygon.length; i++) {
        const coords = polygon[i].split(/(\s+)/).filter(function (e) {
          return e.trim().length > 0;
        });
        polyline.push(new Point(coords[0], coords[1]));
      }
    } else {
      console.error("File is empty");
    }
    return polyline;
  }
}
