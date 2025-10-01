import React, { useState, useRef } from "react";
import { 
  CameraPosition, 
  CameraAnimation,
  AnimationEasing,
  CAMERA_LIMITS,
  UI_LABELS,
  ARIA_LABELS 
} from "../types";
import "./css/CameraAnimator.css";

interface CameraAnimatorProps {
  cameraPositions: CameraPosition[];
  onAnimationStart: (animation: CameraAnimation) => void;
  onAnimationUpdate: (cameraPosition: CameraPosition) => void;
  onAnimationEnd: () => void;
}

const CameraAnimator: React.FC<CameraAnimatorProps> = ({
  cameraPositions,
  onAnimationStart,
  onAnimationUpdate,
  onAnimationEnd,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [animationName, setAnimationName] = useState<string>("");
  const [duration, setDuration] = useState<number>(5);
  const [selectedCameras, setSelectedCameras] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const animationRef = useRef<number | undefined>(undefined);

  const toggleCameraSelection = (cameraName: string) => {
    setSelectedCameras((prev) =>
      prev.includes(cameraName)
        ? prev.filter((name) => name !== cameraName)
        : [...prev, cameraName]
    );
  };

  const startAnimation = () => {
    if (selectedCameras.length < 2) {
      alert("Please select at least 2 camera positions for animation");
      return;
    }

    const keyframes = cameraPositions.filter((cam) =>
      selectedCameras.includes(cam.name)
    );

    const animation: CameraAnimation = {
      id: Date.now().toString(),
      name: animationName || `Animation_${Date.now()}`,
      duration,
      keyframes,
      easing: AnimationEasing.EASE_IN_OUT,
    };

    setIsAnimating(true);
    onAnimationStart(animation);

    // Simple animation implementation
    const startTime = Date.now();
    const totalDuration = duration * 1000;

    const animate = () => {
      const currentTime = Date.now();
      const progress = Math.min((currentTime - startTime) / totalDuration, 1);

      if (progress >= 1) {
        setIsAnimating(false);
        onAnimationEnd();
        return;
      }

      // Simple linear interpolation between keyframes
      const totalFrames = keyframes.length - 1;
      const frameProgress = progress * totalFrames;
      const currentFrame = Math.floor(frameProgress);
      const frameBlend = frameProgress - currentFrame;

      if (currentFrame < keyframes.length - 1) {
        const startFrame = keyframes[currentFrame];
        const endFrame = keyframes[currentFrame + 1];

        const interpolatedPosition: CameraPosition = {
          name: `Anim_${currentFrame}`,
          position: startFrame.position.map(
            (start, index) =>
              start + (endFrame.position[index] - start) * frameBlend
          ) as [number, number, number],
          rotation: startFrame.rotation.map(
            (start, index) =>
              start + (endFrame.rotation[index] - start) * frameBlend
          ) as [number, number, number],
          fov:
            startFrame.fov && endFrame.fov
              ? startFrame.fov + (endFrame.fov - startFrame.fov) * frameBlend
              : startFrame.fov,
        };

        onAnimationUpdate(interpolatedPosition);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsAnimating(false);
    onAnimationEnd();
  };

  return (
    <div className="camera-animator">
      <div
        className="animator-header"
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
        aria-controls="animator-content"
      >
        <h4>Camera Animation</h4>
        <span className={`expand-icon ${isExpanded ? "expanded" : ""}`}>▼</span>
      </div>

      {isExpanded && (
        <div id="animator-content" className="animator-content">
          {!isAnimating ? (
            <>
              {/* Animation Setup */}
              <div className="control-group">
                <label className="group-label">Animation Settings</label>

                <div className="setting-control">
                  <label htmlFor="animation-name">Animation Name</label>
                  <input
                    id="animation-name"
                    type="text"
                    value={animationName}
                    onChange={(e) => setAnimationName(e.target.value)}
                    placeholder="My Camera Animation"
                    aria-label="Animation name"
                  />
                </div>

                <div className="setting-control">
                  <label htmlFor="animation-duration">Duration (seconds)</label>
                  <input
                    id="animation-duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 5)}
                    min={CAMERA_LIMITS.ANIMATION_DURATION.MIN}
                    max={CAMERA_LIMITS.ANIMATION_DURATION.MAX}
                    aria-label="Animation duration in seconds"
                  />
                </div>
              </div>

              {/* Camera Selection */}
              <div className="control-group">
                <label className="group-label">Select Camera Positions</label>
                <div className="camera-selection">
                  {cameraPositions.map((camera) => (
                    <label key={camera.name} className="camera-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedCameras.includes(camera.name)}
                        onChange={() => toggleCameraSelection(camera.name)}
                        aria-label={`Select ${camera.name} camera for animation`}
                      />
                      <span>{camera.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Start Animation */}
              <button
                onClick={startAnimation}
                disabled={selectedCameras.length < 2}
                className="start-animation-button"
                aria-label={`Start animation with ${selectedCameras.length} selected cameras`}
              >
                {UI_LABELS.START_ANIMATION} ({selectedCameras.length} cameras selected)
              </button>
            </>
          ) : (
            /* Animation Controls */
            <div className="animation-controls">
              <div className="animation-status">
                <div className="status-indicator"></div>
                <span>Animation in progress...</span>
              </div>
              <button
                onClick={stopAnimation}
                className="stop-animation-button"
                aria-label={ARIA_LABELS.STOP_ANIMATION}
              >
                {UI_LABELS.STOP_ANIMATION}
              </button>
            </div>
          )}
        </div>
      )}


    </div>
  );
};

export default CameraAnimator;
