import React, { useState } from "react";
import Viewport from "./Viewport";
import { 
  CameraPosition, 
  ThreeDObject,
  CameraViewName,
  DEFAULT_POSITIONS 
} from "../types";
import "./css/ViewportManager.css";

interface ViewportManagerProps {
  object: ThreeDObject | null;
  cameraPositions: CameraPosition[];
  onViewportChange?: (viewportId: string) => void;
}

const ViewportManager: React.FC<ViewportManagerProps> = ({
  object,
  cameraPositions,
  onViewportChange,
}) => {
  const [activeViewport, setActiveViewport] = useState<string>(CameraViewName.MAIN.toLowerCase());
  const [layout, setLayout] = useState<"single" | "quad">("single");

  // Create viewports from camera positions
  const viewports = cameraPositions.map((cameraPos, index) => ({
    id: `viewport-${index}`,
    name: cameraPos.name,
    cameraPosition: cameraPos,
    isActive: activeViewport === `viewport-${index}`,
    size: layout === "single" ? "large" : ("small" as const),
  }));

  // Add main viewport if no cameras are defined
  const allViewports =
    viewports.length > 0
      ? viewports
      : [
          {
            id: CameraViewName.MAIN.toLowerCase(),
            name: CameraViewName.MAIN,
            cameraPosition: {
              name: CameraViewName.MAIN,
              position: DEFAULT_POSITIONS.MAIN,
              rotation: [0, 0, 0] as [number, number, number],
              fov: 75,
            },
            isActive: activeViewport === CameraViewName.MAIN.toLowerCase(),
            size: layout === "single" ? "large" : ("small" as const),
          },
        ];

  const handleViewportActivate = (viewportId: string) => {
    setActiveViewport(viewportId);
    if (onViewportChange) {
      onViewportChange(viewportId);
    }
  };

  const getLayoutClass = () => {
    switch (layout) {
      case "single":
        return "viewports-grid-single";
      case "quad":
        return "viewports-grid-quad";
      default:
        return "viewports-grid-default";
    }
  };

  return (
    <div className="viewport-manager">
      {/* Viewport Controls */}
      <div className="viewport-controls">
        <span className="control-label">Layout:</span>
        <button
          onClick={() => setLayout("single")}
          className={`layout-button ${layout === "single" ? "active" : ""}`}
        >
          Single
        </button>
        <button
          onClick={() => setLayout("quad")}
          className={`layout-button ${layout === "quad" ? "active" : ""}`}
        >
          Quad
        </button>

        <div className="active-indicator">
          Active: {allViewports.find((v) => v.isActive)?.name || "None"}
        </div>
      </div>

      {/* Viewports Grid */}
      <div className={`viewports-grid ${getLayoutClass()}`}>
        {layout === "single" ? (
          // Single viewport layout
          <Viewport
            key={allViewports[0].id}
            object={object}
            cameraPosition={allViewports[0].cameraPosition}
            isActive={allViewports[0].isActive}
            name={allViewports[0].name}
            onActivate={() => handleViewportActivate(allViewports[0].id)}
            size="large"
          />
        ) : (
          // Quad viewport layout
          allViewports
            .slice(0, 4)
            .map((viewport) => (
              <Viewport
                key={viewport.id}
                object={object}
                cameraPosition={viewport.cameraPosition}
                isActive={viewport.isActive}
                name={viewport.name}
                onActivate={() => handleViewportActivate(viewport.id)}
                size="small"
              />
            ))
        )}
      </div>

      {/* Warning for extra cameras in quad mode */}
      {layout === "quad" && allViewports.length > 4 && (
        <div className="warning-message">
          Showing first 4 cameras. {allViewports.length - 4} more available.
        </div>
      )}
    </div>
  );
};

export default ViewportManager;
