import React, { useState } from "react";
import { 
  CameraPosition, 
  CameraViewName,
  UI_LABELS,
  createDefaultCameraPosition,
  getPresetCameraPositions 
} from "../types";
import "./css/CameraManager.css";

interface CameraManagerProps {
  cameraPositions: CameraPosition[];
  onCameraPositionsChange: (positions: CameraPosition[]) => void;
  onViewportChange?: (viewport: string) => void;
}

const CameraManager: React.FC<CameraManagerProps> = ({
  cameraPositions,
  onCameraPositionsChange,
  onViewportChange,
}) => {
  const [newCameraName, setNewCameraName] = useState("");

  const predefinedCameras: CameraPosition[] = getPresetCameraPositions();

  const addPredefinedCamera = (camera: CameraPosition) => {
    if (!cameraPositions.find((pos) => pos.name === camera.name)) {
      onCameraPositionsChange([...cameraPositions, camera]);
    }
  };

  const addCustomCamera = () => {
    if (
      newCameraName &&
      !cameraPositions.find((pos) => pos.name === newCameraName)
    ) {
      const newCamera: CameraPosition = createDefaultCameraPosition(
        newCameraName as CameraViewName,
        [3, 3, 3],
        [-Math.PI / 6, Math.PI / 4, 0]
      );
      onCameraPositionsChange([...cameraPositions, newCamera]);
      setNewCameraName("");
    }
  };

  const removeCamera = (cameraName: string) => {
    onCameraPositionsChange(
      cameraPositions.filter((pos) => pos.name !== cameraName)
    );
  };

  const setActiveViewport = (cameraName: string) => {
    if (onViewportChange) {
      onViewportChange(cameraName);
    }
  };

  const isCameraAdded = (cameraName: string) => {
    return !!cameraPositions.find((pos) => pos.name === cameraName);
  };

  return (
    <div className="camera-manager">
      {/* Predefined Cameras */}
      <div className="section">
        <h4 className="section-title">Predefined Views</h4>
        <div className="grid-buttons">
          {predefinedCameras.map((camera) => (
            <button
              key={camera.name}
              onClick={() => addPredefinedCamera(camera)}
              disabled={isCameraAdded(camera.name)}
              className={`grid-button ${
                isCameraAdded(camera.name) ? "disabled" : ""
              }`}
            >
              {camera.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Camera */}
      <div className="section">
        <h4 className="section-title">Custom Camera</h4>
        <div className="input-group">
          <input
            type="text"
            value={newCameraName}
            onChange={(e) => setNewCameraName(e.target.value)}
            placeholder={UI_LABELS.CAMERA_NAME_PLACEHOLDER}
            className="text-input"
          />
          <button
            onClick={addCustomCamera}
            disabled={!newCameraName}
            className={`add-button ${!newCameraName ? "disabled" : ""}`}
          >
            {UI_LABELS.CREATE_CAMERA}
          </button>
        </div>
      </div>

      {/* Camera List */}
      <div className="section">
        <h4 className="section-title">
          Active Cameras ({cameraPositions.length})
        </h4>
        {cameraPositions.length === 0 ? (
          <p className="empty-state">No cameras added yet</p>
        ) : (
          <div className="camera-list">
            {cameraPositions.map((camera) => (
              <div key={camera.name} className="camera-item">
                <span className="camera-name">{camera.name}</span>
                <div className="camera-actions">
                  <button
                    onClick={() => setActiveViewport(camera.name)}
                    className="view-button"
                  >
                    {UI_LABELS.VIEW_CAMERA}
                  </button>
                  <button
                    onClick={() => removeCamera(camera.name)}
                    className="remove-button"
                  >
                    {UI_LABELS.REMOVE_CAMERA}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


    </div>
  );
};

export default CameraManager;
