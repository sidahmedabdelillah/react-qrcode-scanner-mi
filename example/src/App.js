import React, { useState } from 'react';
import { QrScanner } from 'react-qrcode-scanner-mi';  // Correct named import

function App() {
  const [scannedData, setScannedData] = useState(null);  // Store the scanned QR code value

  // This function will be triggered when a QR code is scanned
  const handleScan = (data) => {
    if (data) {
      setScannedData(data);  // Set the scanned QR code value to state
    }
  };

  // This function will be triggered if there's an error while scanning
  const handleError = (err) => {
    console.error("Error scanning QR Code: ", err);
  };

  return (
    <div className="App">
      <h1>QR Code Scanner</h1>

      {/* Pass the handleScan function to the onScan prop */}
      <QrScanner
        onScan={handleScan}
        onError={handleError}
      />

      {/* Display the scanned data */}
      {scannedData && (
        <div>
          <h2>Scanned Data:</h2>
          <p>{scannedData}</p>
        </div>
      )}
    </div>
  );
}

export default App;
