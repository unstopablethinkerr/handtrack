document.addEventListener('DOMContentLoaded', (event) => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // Access the selfie (front) camera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(stream => {
            video.srcObject = stream;
            video.play();
        })
        .catch(err => {
            console.error('Error accessing the camera:', err);
        });

    // Initialize Handtrack.js
    const modelParams = {
        flipHorizontal: true,   // flip e.g for video
        maxNumBoxes: 2,        // maximum number of boxes to detect
        iouThreshold: 0.5,      // ioU threshold for non-max suppression
        scoreThreshold: 0.6,    // confidence threshold for predictions.
    };

    const model = handTrack.load(modelParams);

    model.then(lmodel => {
        handTrack.startVideo(video).then(status => {
            if (status) {
                console.log('Video started');
                function runDetection() {
                    model.detect(video).then(predictions => {
                        console.log('Predictions: ', predictions);
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        handTrack.renderPredictions(predictions, canvas, context, video);
                        requestAnimationFrame(runDetection);
                    });
                }
                runDetection();
            } else {
                console.log('Video failed to start');
            }
        });
    });

    // Resize canvas to match video dimensions
    video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    });
});
