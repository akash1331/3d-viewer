import React, { useState } from "react";
import { 
  CameraPosition, 
  CameraSettings,
  CAMERA_LIMITS,
  UI_LABELS 
} from "../types";
import "./css/AdvancedCameraControls.css";

interface AdvancedCameraControlsProps {
  cameraPosition: CameraPosition;
  onCameraUpdate: (camera: CameraPosition) => void;
  settings: CameraSettings;
  onSettingsUpdate: (settings: CameraSettings) => void;
}

const AdvancedCameraControls: React.FC<AdvancedCameraControlsProps> = ({
  cameraPosition,
  onCameraUpdate,
  settings,
  onSettingsUpdate,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const updateCameraProperty = (property: keyof CameraPosition, value: any) => {
    onCameraUpdate({
      ...cameraPosition,
      [property]: value,
    });
  };

  const updateSettingsProperty = (
    property: keyof CameraSettings,
    value: any
  ) => {
    onSettingsUpdate({
      ...settings,
      [property]: value,
    });
  };

  return (
    <div className="advanced-camera-controls">
      <div
        className="controls-header"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded ? "true" : "false"}
        aria-controls="advanced-camera-content"
      >
        <h4>Advanced Camera Controls</h4>
        <span className={`expand-icon ${isExpanded ? "expanded" : ""}`}>▼</span>
      </div>

      {isExpanded && (
        <div id="advanced-camera-content" className="controls-content">
          {/* Position Controls */}
          <div className="control-group">
            <label className="group-label">Position</label>
            <div className="vector-controls">
              {["x", "y", "z"].map((axis, index) => (
                <div key={axis} className="vector-control">
                  <label htmlFor={`position-${axis}`}>
                    {axis.toUpperCase()}
                  </label>
                  <input
                    id={`position-${axis}`}
                    type="number"
                    value={cameraPosition.position[index].toFixed(2)}
                    onChange={(e) => {
                      const newPosition = [...cameraPosition.position] as [
                        number,
                        number,
                        number
                      ];
                      newPosition[index] = parseFloat(e.target.value) || 0;
                      updateCameraProperty("position", newPosition);
                    }}
                    step="0.1"
                    aria-label={`Camera position ${axis} coordinate`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Rotation Controls */}
          <div className="control-group">
            <label className="group-label">Rotation (Radians)</label>
            <div className="vector-controls">
              {["x", "y", "z"].map((axis, index) => (
                <div key={axis} className="vector-control">
                  <label htmlFor={`rotation-${axis}`}>
                    {axis.toUpperCase()}
                  </label>
                  <input
                    id={`rotation-${axis}`}
                    type="number"
                    value={cameraPosition.rotation[index].toFixed(3)}
                    onChange={(e) => {
                      const newRotation = [...cameraPosition.rotation] as [
                        number,
                        number,
                        number
                      ];
                      newRotation[index] = parseFloat(e.target.value) || 0;
                      updateCameraProperty("rotation", newRotation);
                    }}
                    step="0.01"
                    aria-label={`Camera rotation ${axis} coordinate in radians`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Camera Settings */}
          <div className="control-group">
            <label className="group-label">Camera Settings</label>

            <div className="setting-control">
              <label htmlFor="fov-control">Field of View</label>
              <input
                id="fov-control"
                type="range"
                min={CAMERA_LIMITS.FOV.MIN}
                max={CAMERA_LIMITS.FOV.MAX}
                value={settings.fov}
                onChange={(e) =>
                  updateSettingsProperty("fov", parseInt(e.target.value))
                }
                aria-label={`Field of view: ${settings.fov} degrees`}
              />
              <span>{settings.fov}°</span>
            </div>

            <div className="setting-control">
              <label htmlFor="near-control">Near Plane</label>
              <input
                id="near-control"
                type="number"
                value={settings.near.toFixed(2)}
                onChange={(e) =>
                  updateSettingsProperty(
                    "near",
                    parseFloat(e.target.value) || 0.1
                  )
                }
                step="0.1"
                min="0.1"
                aria-label="Camera near plane distance"
              />
            </div>

            <div className="setting-control">
              <label htmlFor="far-control">Far Plane</label>
              <input
                id="far-control"
                type="number"
                value={settings.far.toFixed(2)}
                onChange={(e) =>
                  updateSettingsProperty(
                    "far",
                    parseFloat(e.target.value) || 100
                  )
                }
                step="1"
                min={CAMERA_LIMITS.NEAR.MIN}
                aria-label="Camera far plane distance"
              />
            </div>
          </div>

          {/* Frustum Visualization */}
          <div className="control-group">
            <label className="group-label">Visualization</label>

            <div className="toggle-control">
              <label htmlFor="show-frustum">
                <input
                  id="show-frustum"
                  type="checkbox"
                  checked={settings.showFrustum}
                  onChange={(e) =>
                    updateSettingsProperty("showFrustum", e.target.checked)
                  }
                />
                                  {UI_LABELS.SHOW_FRUSTUM}
              </label>
            </div>

            {settings.showFrustum && (
              <>
                <div className="setting-control">
                  <label htmlFor="frustum-color">Frustum Color</label>
                  <input
                    id="frustum-color"
                    type="color"
                    value={settings.frustumColor}
                    onChange={(e) =>
                      updateSettingsProperty("frustumColor", e.target.value)
                    }
                    aria-label="Camera frustum color"
                  />
                </div>

                <div className="setting-control">
                                  <label>{UI_LABELS.FRUSTUM_OPACITY}</label>
                  <input
                    id="frustum-opacity"
                    type="range"
                    min={CAMERA_LIMITS.FRUSTUM_OPACITY.MIN}
                    max={CAMERA_LIMITS.FRUSTUM_OPACITY.MAX}
                    step="0.1"
                    value={settings.frustumOpacity}
                    onChange={(e) =>
                      updateSettingsProperty(
                        "frustumOpacity",
                        parseFloat(e.target.value)
                      )
                    }
                    aria-label={`Frustum opacity: ${(
                      settings.frustumOpacity * 100
                    ).toFixed(0)}%`}
                  />
                  <span>{(settings.frustumOpacity * 100).toFixed(0)}%</span>
                </div>
              </>
            )}
          </div>

          {/* Preset Buttons */}
          <div className="control-group">
            <label className="group-label">Quick Presets</label>
            <div className="preset-buttons">
              <button
                onClick={() => updateCameraProperty("fov", 75)}
                className="preset-button"
                aria-label="Reset field of view to 75 degrees"
              >
                Reset FOV (75°)
              </button>
              <button
                onClick={() => updateCameraProperty("position", [5, 5, 5])}
                className="preset-button"
                aria-label="Reset camera position to default"
              >
                Reset Position
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default AdvancedCameraControls;
