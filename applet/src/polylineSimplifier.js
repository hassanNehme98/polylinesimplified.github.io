/**
 * @author Hassan Nehme, studentID : 000436655
 * Class used to approximate a polyline by applying the algorithm
 * proposed by Imai and Iri.
 */

class polylineSimplifier {
  #defaultEps;
  #IIgraph;
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
   * Draws the graph on the screen.
   * @param {Object} polyline The array of points defining the polygonal chain.
   */
  showGraph(polyline) {
    this.createGraph(this.#defaultEps, polyline);
    stroke(255, 0, 0);
    for (let i = 0; i < this.#IIgraph.length; ++i)
      for (let j = 0; j < this.#IIgraph.length; ++j) {
        if (this.#IIgraph[i][j] != 0 && this.#IIgraph[i][j] != -1) {
          line(points[i].x, points[i].y, points[j].x, points[j].y);
        }
      }
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
    const num = Math.abs((p3.x - p2.x) * (p2.y - p1.y) - (p2.x - p1.x) * (p3.y - p2.y));
    const den = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2));
    return num / den;
  }

  /**
   * Creates the graph G in O(n^3) time.
   * @param {Number} epsilon The error bound value.
   * @param {Object} polyline The array of points defining the polygonal chain.
   * @returns The graph G as a two dimentionnal array.
   */
  createGraph(epsilon, polyline) {
    this.#IIgraph = this.initializeGraph(polyline);
    for (let i = 0; i < polyline.length - 1; ++i) {
      this.#IIgraph[i][i] = 0;
      this.#IIgraph[i][i + 1] = 1;
      this.#IIgraph[i + 1][i] = -1;
      for (let j = i + 2; j < polyline.length; ++j) {
        let possibleApprox = true;
        for (let k = i + 1; k < j; ++k) {
          if (this.getDist(polyline[k], polyline[i], polyline[j]) > epsilon) {
            possibleApprox = false;
            break;
          }
        }
        if (possibleApprox) {
          this.#IIgraph[i][j] = 1;
          this.#IIgraph[j][i] = -1;
        }
      }
    }
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
   * @param {Object} this.IIgraph The graph G.
   * @returns The shortest path from p1 to pn.
   */
  computeShortestPath() {
    const n = this.#IIgraph.length;
    let dp = [];
    let shortcut = [];
    for (let i = 0; i < n; ++i) {
      dp[i] = 999999;
    }
    dp[n - 1] = 0;
    for (let i = n - 2; i >= 0; --i) {
      for (let j = 0; j < n; ++j) {
        const weight = this.#IIgraph[i][j];
        if (weight > 0) {
          if (dp[i] > weight + dp[j]) {
            dp[i] = weight + dp[j];
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
    this.createGraph(epsilon, polyline);
    const shortestPath = this.computeShortestPath();
    const approximation = this.getApproximation(polyline, shortestPath);
    return approximation;
  }
}
