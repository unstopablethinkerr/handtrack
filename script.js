document.addEventListener('DOMContentLoaded', (event) => {
    const video = document.getElementById('video');

    // Access the primary (rear) camera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } } })
        .then(stream => {
            video.srcObject = stream;
            video.play();
        })
        .catch(err => {
            console.error('Error accessing the camera:', err);
        });
});
