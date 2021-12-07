/**
 * @author Hassan Nehme, studentID : 000436655
 */

/*----------------------------------------------USAGE-------------------------------------------------
Approximate a polyline using Imai and Iri's algorithm.
Draw the simple polyline by clicking on the screen to create points. Each time you click, 
an edge is drawn by connecting the current chosen point to the last chosen point. This only happens
if the point that you choose, can actually be chosen; meaning that the edge won't cross the curve. 
If it does, then  the program won't allow it, and hence, nothing will happen! When you choose to 
approximate the polyline, click on the button "approximate", this will draw the approximated polygon
in another color. A built-in polyline is available and can also be approximated.
*-----------------------------------------------------------------------------------------------------/

/* eslint-disable no-undef, no-unused-vars */
//A point has is defined by its x and y components.
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
//Points contains all the points of the sketch.
var points = [];
//A polyline which is available for the user ( either as mathematical function or a country map).
innerPolyline = undefined;
//Approximated polyline
approximation = undefined;
//Creator is an instance of the utils class.
let creator = undefined;
//An object of the class polylineSimplifier to compute the approximation.
let solver = undefined;
//polylineCreator is used to provide the user with available polylines.
let polyDrawer = undefined;
//mapAsPolyline is used to read the map of a country from a file.
let mapAsPolyline = undefined;
//ShowGraph is used to know when to show the Imai and Iri's graph to the user.
let showGraph = false;
//drawPolyline is used to know when to draw the initial polyline.
let drawPolyline = true;
//countryMap is used to know if a country map is drawn.
let countryMap = false;

/**
 * Adds CSS to a button.
 * @param {Button} button The button to style.
 * @param {Hexadecimal} color The color to add.
 * @param {Number} ypad The vertical padding to add.
 */
function styleButton(button, color = "black", ypad = 0.8) {
  button.style(`color: ${color}`);
  button.style("text-transform:uppercase");
  button.style("text-align:center");
  button.style("transition: all 0.5s");
  button.style("margin:0 0.3em 0.3em 0");
  button.style("box-sizing: border-box");
  button.style(`padding:${ypad}em 1em`);
}

/**
 * Removes all the points from the sketch.
 * Resets all the global variables to their initial values.
 * Disables and enables some of the buttons.
 */
function resetpoints() {
  points = [];
  showGraph = undefined;
  polygonCompleted = false;
  innerPolyline = undefined;
  approximation = undefined;
  countryMap = false;
  drawPolyline = true;

  buttonBuiltIn.removeAttribute("disabled");
  randomMap.removeAttribute("disabled");
  approximate.attribute("disabled", "");
  visualGraph.attribute("disabled", "");
}

/**
 * The setup functions sets the canvas,
 * creates the buttons of the sketch
 * and links them to their on-click methods.
 */
function setup() {
  solver = new polylineSimplifier();
  polyDrawer = new polylineBuilder();
  creator = new utils();
  createCanvas(windowWidth, windowHeight);
  textSize(40);

  //BUTTONS
  button = createButton("Clear");
  button.position(30, 85);
  button.mousePressed(resetpoints);
  styleButton(button, "#8B0000");

  approximate = createButton("Approximate");
  approximate.position(120, 85);
  approximate.mousePressed(function getApproximation() {
    showGraph = false;
    drawPolyline = false;
    const polyChain = innerPolyline ? innerPolyline : points;
    approximation = solver.computeApproximation(polyChain);
  });
  approximate.attribute("disabled", "");
  styleButton(approximate, "green");

  visualGraph = createButton("Visualize Graph");
  visualGraph.position(260, 85);
  visualGraph.mousePressed(function getGraph() {
    approximation = undefined;
    showGraph = true;
  });
  visualGraph.attribute("disabled", "");
  styleButton(visualGraph, "#0C8E77");

  buttonBuiltIn = createButton("Random Polyline");
  buttonBuiltIn.position(425, 85);
  buttonBuiltIn.mousePressed(function availablePoly() {
    resetpoints();
    innerPolyline = polyDrawer.chooseRandFunc();
  });
  styleButton(buttonBuiltIn, "#005E6A");

  selfIntersecting = createButton("Self-Intersecting curve");
  selfIntersecting.position(600, 85);
  selfIntersecting.mousePressed(function selfIntersection() {
    resetpoints();
    innerPolyline = polyDrawer.intersectingCurves();
  });
  styleButton(selfIntersecting, "#004b55");

  randomMap = createButton("random map");
  randomMap.position(835, 85);
  randomMap.mousePressed(function randMap() {
    resetpoints();
    mapAsPolyline = loadStrings("./src/maps/belgium.txt", mapFileLoad);
  });
  styleButton(randomMap, "#00262A");

  input = createInput();
  input.position(1120, 50);

  submission = createButton("Change value");
  submission.position(input.x + input.width + 10, input.y);
  submission.mousePressed(function modifyEps() {
    solver.setDefaultEps(input.value());
  });
  styleButton(submission, "green", 0.09);
}

/**
 * Reads the coordinates of the points on the map from a file.
 */
function mapFileLoad() {
  innerPolyline = polyDrawer.loadMap(mapAsPolyline);
  countryMap = true;
}

/**
 * Writes the title, draws the sketch points and lines and
 * the notifying messages when needed.
 */
function draw() {
  background(0);
  stroke(0, 0, 0);
  textSize(40);
  fill("#006666");
  rectMode(TOP);
  rect(-5, -5, windowWidth + 200, 150);
  fill("#bed3c3");
  text("Approximating polylines with Imai and Iri's algorithm", 30, 50);
  textSize(20);
  fill("#CB6E0B");
  text("Error bound:", 1120, 45);
  stroke(100, 0, 200);
  for (i in points) {
    ellipse(points[i].x, points[i].y, 1, 1);
  }
  strokeWeight(4);
  if (points && points.length > 1) {
    visualGraph.removeAttribute("disabled");
  }
  if ((points && points.length > 1) || innerPolyline) {
    approximate.removeAttribute("disabled");
  }
  if (showGraph) {
    solver.showGraph(points);
  } else if (approximation) {
    if (countryMap) creator.simpleClosedCurve(approximation, [255, 255, 255]);
    else creator.simplePolyline(approximation, [255, 255, 255]);
    stroke(0, 0, 0);
    textSize(15);
    fill("#0b7aa7");

    const nbInitPoints = innerPolyline ? innerPolyline.length : points.length;
    text(`Initial polyline: ${nbInitPoints} points`, 1122, 105);
    text(`Approximation: ${approximation.length} points`, 1122, 125);
  }

  if (drawPolyline && !showGraph) {
    if (points) creator.simplePolyline(points, [100, 0, 200]);
    if (innerPolyline) {
      if (countryMap) creator.simpleClosedCurve(innerPolyline);
      else creator.simplePolyline(innerPolyline);
    }
  }
}

/**
 * Add a point to the sketch if chosen in the
 * available canvas and if it is a valid point
 * (Edges cannot cross each other).
 */
function mousePressed() {
  if (mouseY < 150 || innerPolyline || approximation || showGraph) return;
  buttonBuiltIn.attribute("disabled", "");
  randomMap.attribute("disabled", "");
  const nextPoint = new Point(mouseX, mouseY);
  if (creator.isValid(nextPoint)) {
    points.push(nextPoint);
  }
}

/**
 * Resizes the canvas when needed.
 */
windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};
