/**
 * @author Hassan Nehme, studentID : 000436655
 */

class polylineSimplifier {
  #defaultEps;
  /**
   * The constructor initializes a default value of the error bound to 20.
   */
  constructor() {
    this.#defaultEps = 20;
  }

  /**
   * A setter for the error bound.
   * @param {Number} newEps A new value for the error bound.
   */
  setDefaultEps(newEps) {
    this.#defaultEps = newEps;
  }

  /**
   * Creates a polyline which is available for the user to use
   * instead of drawing their own polyline.
   * The curve is given by the function f(x) = e(-x)cos(2PIx).
   * @returns The curve as a list of connected points.
   */
  createBuiltIn() {
    let curvePoints = [];
    for (let x = 0; x < windowWidth; ++x) {
      const xval = map(x, 0, windowWidth, 0, 5);
      const yval = exp(-xval) * cos(TWO_PI * xval);
      const y = map(yval, -1, 1, windowHeight, 0);
      curvePoints.push(new Point(x, y + 148));
    }
    return curvePoints;
  }

  /**
   * Initialization: Creates an array representing the graph G and fills it with zeroes.
   * @param {Object} polyline The array of points defining the polygonal chain.
   * @returns The array.
   */
  initializeGraph(polyline) {
    return Array(polyline.length)
      .fill()
      .map(() => Array(polyline.length).fill(0));
  }

  /**
   * Computes the euclidian distance between a point and a line segment.
   * @param {Point} p1 The point.
   * @param {Point} p2 The first endpoint of the line segment.
   * @param {Point} p1 The second endpoint of the line segment.
   * @returns The distance between p1 and the line segment p2p3.
   */
  getDist(p1, p2, p3) {
    const m = (p3.y - p2.y) / (p3.x - p2.x);
    const b = p3.y - m * p3.x;
    return Math.abs(-m * p1.x + p1.y - b) / Math.sqrt(m * m + 1);
  }

  /**
   * Creates the graph G in O(n^3) time.
   * @param {Number} epsilon The error bound value.
   * @param {Object} polyline The array of points defining the polygonal chain.
   * @returns The graph G as a two dimentionnal array.
   */
  createGraph(epsilon, polyline) {
    let graph = this.initializeGraph(polyline);

    for (let i = 0; i < polyline.length - 1; ++i) {
      graph[i][i] = 0;
      graph[i][i + 1] = 1;
      graph[i + 1][i] = -1;
      for (let j = i + 2; j < polyline.length; ++j) {
        let possibleApprox = true;
        for (let k = i + 1; k < j; ++k) {
          const dist = this.getDist(polyline[k], polyline[i], polyline[j]);
          if (this.getDist(polyline[k], polyline[i], polyline[j]) > epsilon) {
            possibleApprox = false;
          }
        }
        if (possibleApprox) {
          graph[i][j] = 1;
          graph[j][i] = -1;
        }
      }
    }
    return graph;
  }

  /**
   * Provides an approximation of the initial polyline.
   * @param {Object} polyline The array of points defining the polygonal chain.
   * @param {Object} shortcut The shortest path in the graph G from p1 to pn.
   * @returns The approximated polyline P'.
   */
  getApproximation(polyline, shortcut) {
    let approximatedPolyline = [polyline[0]];
    let nextPointIdx;
    for (let i = 0; i != shortcut[shortcut.length - 1]; ) {
      nextPointIdx = shortcut[i];
      approximatedPolyline.push(polyline[nextPointIdx]);
      i = nextPointIdx;
    }

    return approximatedPolyline;
  }

  /**
   * Computes the shortest path in the graph G using dynammic programing.
   * This is possible since the graph G is a DAG (Directed asyclic graph).
   * @param {Object} IIgraph The graph G.
   * @returns The shortest path from p1 to pn.
   */
  computeShortestPath(IIgraph) {
    const n = IIgraph.length;
    let dp = [];
    let shortcut = [];
    for (let i = 0; i < n; ++i) {
      dp[i] = 999;
    }
    dp[n - 1] = 0;
    for (let i = n - 2; i >= 0; --i) {
      for (let j = 0; j < n; ++j) {
        const weight = IIgraph[i][j];
        if (weight > 0) {
          dp[i] = min(dp[i], weight + dp[j]);
          if (dp[i] === weight + dp[j]) {
            shortcut[i] = j;
          }
        }
      }
    }
    return shortcut;
  }

  /**
   * Calls the necessary methods to find the approximated polyline given an error bound.
   * @param {Object} polyline The array of points defining the polygonal chain.
   * @param {Number} epsilon The error bound value.
   * @returns The approximated polyline P'.
   */
  computeApproximation(polyline, epsilon = this.#defaultEps) {
    const IIgraph = this.createGraph(epsilon, polyline);
    const shortestPath = this.computeShortestPath(IIgraph);
    const approximation = this.getApproximation(polyline, shortestPath);
    return approximation;
  }
}
