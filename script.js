const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let model = null;
let isHandDetected = false;

// Load Handtrack.js model
handTrack.load().then(loadedModel => {
  model = loadedModel;
  startVideo();
});

// Start video stream
function startVideo() {
  handTrack.startVideo(video).then(status => {
    if (status) {
      console.log('Video started');
      detectHands();
    } else {
      console.error('Please enable video permissions');
    }
  });
}

// Detect hands in video frames
function detectHands() {
  if (model) {
    model.detect(video).then(predictions => {
      renderPredictions(predictions);
      requestAnimationFrame(detectHands); // Continuously detect hands
    });
  }
}

// Render predictions and show green border
function renderPredictions(predictions) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (predictions.length > 0) {
    isHandDetected = true;
    canvas.classList.add('hand-detected');
    setTimeout(() => {
      canvas.classList.remove('hand-detected');
    }, 1000); // Remove border after 1 second
  } else {
    isHandDetected = false;
  }

  // Draw bounding boxes
  predictions.forEach(prediction => {
    const [x, y, width, height] = prediction.bbox;
    context.strokeStyle = 'green';
    context.lineWidth = 2;
    context.strokeRect(x, y, width, height);
  });
}

// Adjust canvas size to match video
function resizeCanvas() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
}

window.addEventListener('resize', resizeCanvas);
video.addEventListener('loadedmetadata', resizeCanvas);