import React, { useState } from "react";
import ObjectLoader from "./ObjectLoader";
import CameraManager from "./CameraManager";
import AdvancedCameraControls from "./AdvancedCameraControls";
import CameraAnimator from "./CameraAnimator";
import { 
  CameraPosition, 
  ThreeDObject, 
  CameraSettings,
  TabType,
  UI_LABELS,
  CAMERA_LIMITS,
  DEFAULT_POSITIONS,
  CameraViewName,
  createDefaultCameraSettings
} from "../types";
import "./css/ControlsPanel.css";

interface ControlsPanelProps {
  onObjectLoad: (object: ThreeDObject | null) => void;
  cameraPositions: CameraPosition[];
  onCameraPositionsChange: (positions: CameraPosition[]) => void;
  onViewportChange?: (viewport: string) => void;
  onCameraUpdate?: (camera: CameraPosition) => void;
  onAnimationUpdate?: (camera: CameraPosition) => void;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  onObjectLoad,
  cameraPositions,
  onCameraPositionsChange,
  onViewportChange,
  onCameraUpdate,
  onAnimationUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.OBJECT);
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>(
    createDefaultCameraSettings()
  );

  const activeCamera = cameraPositions[0] || {
    name: CameraViewName.MAIN,
    position: DEFAULT_POSITIONS.MAIN,
    rotation: [0, 0, 0],
    fov: CAMERA_LIMITS.FOV.DEFAULT,
  };

  const handleCameraUpdate = (camera: CameraPosition) => {
    if (onCameraUpdate) {
      onCameraUpdate(camera);
    }
  };

  const handleAnimationUpdate = (camera: CameraPosition) => {
    if (onAnimationUpdate) {
      onAnimationUpdate(camera);
    }
  };

  return (
    <div className="controls-panel">
      <h2 className="controls-panel-title">
        {UI_LABELS.THREEDIM_VIEWER}
      </h2>

      {/* Tab Navigation */}
      <div className="controls-panel-tabs">
        <button
          onClick={() => setActiveTab(TabType.OBJECT)}
          className={`controls-panel-tab ${activeTab === TabType.OBJECT ? "active" : ""}`}
        >
          {UI_LABELS.TAB_3D_OBJECT}
        </button>
        <button
          onClick={() => setActiveTab(TabType.CAMERAS)}
          className={`controls-panel-tab ${activeTab === TabType.CAMERAS ? "active" : ""}`}
        >
          {UI_LABELS.TAB_CAMERAS}
        </button>
        <button
          onClick={() => setActiveTab(TabType.ANIMATION)}
          className={`controls-panel-tab ${activeTab === TabType.ANIMATION ? "active" : ""}`}
        >
          {UI_LABELS.TAB_ANIMATION}
        </button>
      </div>

      {/* Tab Content */}
      <div className="controls-panel-content">
        {activeTab === TabType.OBJECT && (
          <div>
            <h3 className="controls-panel-section-title">{UI_LABELS.LOAD_3D_OBJECT}</h3>
            <ObjectLoader onObjectLoad={onObjectLoad} />
          </div>
        )}

        {activeTab === TabType.CAMERAS && (
          <div>
            <AdvancedCameraControls
              cameraPosition={activeCamera}
              onCameraUpdate={handleCameraUpdate}
              settings={cameraSettings}
              onSettingsUpdate={setCameraSettings}
            />

            <CameraManager
              cameraPositions={cameraPositions}
              onCameraPositionsChange={onCameraPositionsChange}
              onViewportChange={onViewportChange}
            />
          </div>
        )}

        {activeTab === TabType.ANIMATION && (
          <div>
            <CameraAnimator
              cameraPositions={cameraPositions}
              onAnimationStart={(animation) =>
                console.log("Animation started:", animation)
              }
              onAnimationUpdate={handleAnimationUpdate}
              onAnimationEnd={() => console.log("Animation ended")}
            />

            <div className="controls-panel-animation-guide">
              <h4>Animation Guide</h4>
              <p>
                1. Select multiple camera positions
                <br />
                2. Set animation duration
                <br />
                3. Click "Start Animation" to preview camera path
                <br />
                4. The camera will smoothly transition between selected
                positions
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="controls-panel-stats">
        <div className="controls-panel-stat-row">
          <span>Cameras:</span>
          <span>{cameraPositions.length}</span>
        </div>
        <div className="controls-panel-stat-row">
          <span>Active:</span>
          <span>{activeCamera.name}</span>
        </div>
        <div className="controls-panel-stat-row">
          <span>FOV:</span>
          <span>{cameraSettings.fov}°</span>
        </div>
      </div>
    </div>
  );
};

export default ControlsPanel;
