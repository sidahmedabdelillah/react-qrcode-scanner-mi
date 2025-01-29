// import React, { useEffect, useRef } from "react";
// import jsQR from "jsqr";

// const QrScanner = ({ onScan, onError, width = 300, height = 300 }) => {
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);

//     useEffect(() => {
//         const startScanner = async () => {
//             try {
//                 const stream = await navigator.mediaDevices.getUserMedia({
//                     video: { facingMode: "environment" },
//                 });
//                 if (videoRef.current) videoRef.current.srcObject = stream;
//             } catch (err) {
//                 if (onError) onError(err);
//             }
//         };

//         startScanner();

//         return () => {
//             if (videoRef.current && videoRef.current.srcObject) {
//                 const tracks = videoRef.current.srcObject.getTracks();
//                 tracks.forEach((track) => track.stop());
//             }
//         };
//     }, [onError]);

//     useEffect(() => {
//         const scanQRCode = () => {
//             const canvas = canvasRef.current;
//             const video = videoRef.current;

//             if (!canvas || !video) return;

//             const ctx = canvas.getContext("2d");
//             canvas.width = width;
//             canvas.height = height;

//             if (video.readyState === video.HAVE_ENOUGH_DATA) {
//                 ctx.drawImage(video, 0, 0, width, height);
//                 const imageData = ctx.getImageData(0, 0, width, height);
//                 const code = jsQR(imageData.data, imageData.width, imageData.height);

//                 if (code && onScan) {
//                     onScan(code.data);
//                 }
//             }
//             requestAnimationFrame(scanQRCode);
//         };

//         scanQRCode();
//     }, [onScan, width, height]);

//     return (
//         <div>
//             <video ref={videoRef} autoPlay style={{ display: "none" }} />
//             <canvas ref={canvasRef} />
//         </div>
//     );
// };

// export default QrScanner;

import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import jsQR from "jsqr";

const QrScanner = ({ onScan, onError, cameraMode = "environment", width, heigth}) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const startScanner = () => {
            navigator.mediaDevices
                .getUserMedia({
                    video: {
                        facingMode: cameraMode, // Use the cameraMode prop here
                    },
                })
                .then((stream) => {
                    if (videoRef.current) videoRef.current.srcObject = stream;
                })
                .catch((err) => {
                    if (onError) onError(err);
                });
        };

        startScanner();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, [cameraMode, onError]); // Re-run when cameraMode changes

    useEffect(() => {
        const scanQRCode = () => {
            const canvas = canvasRef.current;
            const video = videoRef.current;

            if (!canvas || !video) return;

            const ctx = canvas.getContext("2d");
            canvas.width = width ?? 300; 
            canvas.height = height ?? 300;

            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code && onScan) {
                    onScan(code.data); // Pass the scanned value
                }
            }

            requestAnimationFrame(scanQRCode);
        };

        scanQRCode();
    }, [onScan]);

    return (
        <div>
            <video ref={videoRef} autoPlay style={{ display: "none" }} />
            <canvas ref={canvasRef} />
        </div>
    );
};

QrScanner.propTypes = {
    onScan: PropTypes.func.isRequired,
    onError: PropTypes.func,
    cameraMode: PropTypes.oneOf(["user", "environment"]), // Add prop validation
};
export default QrScanner;
