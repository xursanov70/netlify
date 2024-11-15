var canvas;
var stage;
var container;
var captureContainers;
var captureIndex;
var backgroundImage;
var isMobile = /Mobi|Android/i.test(navigator.userAgent); // Check if the device is mobile

function init() {
  // create a new stage and point it at our canvas:
  canvas = document.getElementById("testCanvas");
  stage = new createjs.Stage(canvas);

  // Set canvas to fill the screen
  resizeCanvas();

  var w = canvas.width;
  var h = canvas.height;

  // Load and draw background image based on device type
  backgroundImage = new Image();
  if (isMobile) {
    // Load a different image for mobile devices
    backgroundImage.src = 'https://i.pinimg.com/736x/17/db/dd/17dbdd33fb7e14ce63c8b0fed58e88a7.jpg'; // Replace with your mobile image path
  } else {
    // Load a different image for desktop devices
    backgroundImage.src = 'https://static.vecteezy.com/system/resources/previews/002/539/740/non_2x/abstract-low-poly-pink-background-free-vector.jpg'; // Replace with your desktop image path
  }

  backgroundImage.onload = function() {
    var bitmap = new createjs.Bitmap(backgroundImage);
    bitmap.scaleX = canvas.width / backgroundImage.width;
    bitmap.scaleY = canvas.height / backgroundImage.height;
    stage.addChild(bitmap); // Add the background image to the stage

    // Move the bitmap to the bottom of the stage so hearts are on top
    stage.setChildIndex(bitmap, 0);
    stage.update();
  };

  container = new createjs.Container();
  stage.addChild(container);

  captureContainers = [];
  captureIndex = 0;

  // Create a large number of slightly complex vector shapes, and give them random positions and velocities:
  for (var i = 0; i < 100; i++) {
    var heart = new createjs.Shape();
    heart.graphics.beginFill(createjs.Graphics.getHSL(Math.random() * 30 - 45, 100, 50 + Math.random() * 30));
    heart.graphics.moveTo(0, -12).curveTo(1, -20, 8, -20).curveTo(16, -20, 16, -10).curveTo(16, 0, 0, 12);
    heart.graphics.curveTo(-16, 0, -16, -10).curveTo(-16, -20, -8, -20).curveTo(-1, -20, 0, -12);
    heart.y = -100;

    container.addChild(heart);
  }

  for (i = 0; i < 100; i++) {
    var captureContainer = new createjs.Container();
    captureContainer.cache(0, 0, w, h);
    captureContainers.push(captureContainer);
  }

  // Start the tick and point it at the window so we can do some work before updating the stage:
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.on("tick", tick);

  // Update the canvas size when the window is resized
  window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Adjust background image scale when the window is resized
  if (backgroundImage && backgroundImage.complete) {
    var bitmap = stage.getChildAt(0);
    bitmap.scaleX = canvas.width / backgroundImage.width;
    bitmap.scaleY = canvas.height / backgroundImage.height;
    stage.update();
  }
}

function tick(event) {
  var w = canvas.width;
  var h = canvas.height;
  var l = container.numChildren;

  captureIndex = (captureIndex + 1) % captureContainers.length;
  stage.removeChildAt(1); // Adjust to remove hearts container (not background)
  var captureContainer = captureContainers[captureIndex];
  stage.addChildAt(captureContainer, 1); // Keep hearts above background
  captureContainer.addChild(container);

  // Iterate through all the children and move them according to their velocity:
  for (var i = 0; i < l; i++) {
    var heart = container.getChildAt(i);
    if (heart.y < -50) {
      heart._x = Math.random() * w;
      heart.y = h * (1 + Math.random()) + 50;
      heart.perX = (1 + Math.random() * 2) * h;
      heart.offX = Math.random() * h;
      heart.ampX = heart.perX * 0.1 * (0.15 + Math.random());
      heart.velY = -Math.random() * 2 - 1;
      heart.scale = Math.random() * 2 + 1;
      heart._rotation = Math.random() * 40 - 20;
      heart.alpha = Math.random() * 0.75 + 0.05;
      heart.compositeOperation = Math.random() < 0.33 ? "lighter" : "source-over";
    }
    var int = (heart.offX + heart.y) / heart.perX * Math.PI * 2;
    heart.y += heart.velY * heart.scaleX / 2;
    heart.x = heart._x + Math.cos(int) * heart.ampX;
    heart.rotation = heart._rotation + Math.sin(int) * 30;
  }

  captureContainer.updateCache("source-over");

  // Draw the updates to stage:
  stage.update(event);
}

init();
