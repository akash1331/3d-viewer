import React, { useState } from "react";
import ViewportManager from "./components/ViewportManager";
import ControlsPanel from "./components/ControlsPanel";
import { CameraPosition, ThreeDObject } from "./types";
import "./App.css";

const App: React.FC = () => {
  const [currentObject, setCurrentObject] = useState<ThreeDObject | null>(null);
  const [cameraPositions, setCameraPositions] = useState<CameraPosition[]>([]);

  return (
    <div className="app-container">
      {/* Main Viewport Area */}
      <div className="app-main-viewport">
        <ViewportManager
          object={currentObject}
          cameraPositions={cameraPositions}
        />
      </div>

      {/* Controls Panel */}
      <div className="app-controls-panel">
        <ControlsPanel
          onObjectLoad={setCurrentObject}
          cameraPositions={cameraPositions}
          onCameraPositionsChange={setCameraPositions}
        />
      </div>
    </div>
  );
};

export default App;
