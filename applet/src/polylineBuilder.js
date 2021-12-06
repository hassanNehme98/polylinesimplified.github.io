/**
 * Creates a polyline which is available for the user to use
 * instead of drawing their own polyline.
 */
class polylineBuilder {
  constructor() {}

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
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
}
