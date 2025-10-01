import React, { useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Bounds, useBounds } from "@react-three/drei";
import * as THREE from "three";
import { 
  CameraPosition, 
  ThreeDObject, 
  LoadedModel,
  COLORS,
  GRID_CONFIG 
} from "../types";
import { useModelLoader } from "../hooks/useModelLoader";
import CameraFrustum from "./CameraFrustum";
import "./css/Viewport.css";

interface ViewportProps {
  object: ThreeDObject | null;
  cameraPosition: CameraPosition;
  isActive: boolean;
  name: string;
  onActivate: () => void;
  size: "small" | "medium" | "large";
  showFrustum?: boolean;
  frustumColor?: string;
  frustumOpacity?: number;
}

// Model Component for Viewport
const ViewportModel: React.FC<{ object: ThreeDObject }> = ({ object }) => {
  const [model, setModel] = useState<LoadedModel | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { loadModel, loading, error } = useModelLoader();
  const bounds = useBounds();

  useEffect(() => {
    if (object) {
      setLoadError(null);
      setModel(null);
      console.log(`Loading model: ${object.name} (${object.type})`);
      
      loadModel(object.url, object.type)
        .then((loadedModel) => {
          if (loadedModel) {
            setModel(loadedModel);
            console.log(`Successfully loaded: ${object.name}`);
          } else {
            setLoadError(`Failed to load model: ${object.name}`);
          }
        })
        .catch((err) => {
          console.error('Model loading failed:', err);
          setLoadError(`Error loading ${object.name}: ${err.message || err}`);
        });
    }
  }, [object, loadModel]);

  useEffect(() => {
    if (model && bounds) {
      bounds.refresh().clip().fit();
    }
  }, [model, bounds]);

  if (loading) {
    return (
      <group>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="blue" transparent opacity={0.3} />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </group>
    );
  }

  if (loadError || error) {
    console.error('Display error:', loadError || error);
    return (
      <group>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" transparent opacity={0.5} />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </group>
    );
  }

  if (!model) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" transparent opacity={0.7} />
      </mesh>
    );
  }

  return <primitive object={model.scene} scale={object.scale || 1} />;
};

// Camera Controller for Viewport
const ViewportCameraController: React.FC<{
  cameraPosition: CameraPosition;
}> = ({ cameraPosition }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...cameraPosition.position);
    camera.rotation.set(...cameraPosition.rotation);

    if (camera instanceof THREE.PerspectiveCamera && cameraPosition.fov) {
      camera.fov = cameraPosition.fov;
      camera.updateProjectionMatrix();
    }
  }, [camera, cameraPosition]);

  return null;
};

const ViewportContent: React.FC<Omit<ViewportProps, "onActivate" | "size">> = ({
  object,
  cameraPosition,
  isActive,
  showFrustum = false,
  frustumColor = COLORS.FRUSTUM_DEFAULT,
  frustumOpacity = 0.2,
}) => {
  return (
    <>
      <ViewportCameraController cameraPosition={cameraPosition} />

      {/* Add Camera Frustum Visualization */}
      {showFrustum && (
        <CameraFrustum
          cameraPosition={cameraPosition}
          show={showFrustum}
          color={frustumColor}
          opacity={frustumOpacity}
        />
      )}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        enabled={isActive}
      />

      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      <gridHelper args={[GRID_CONFIG.SIZE, GRID_CONFIG.DIVISIONS, COLORS.GRID_PRIMARY, COLORS.GRID_SECONDARY]} />
      <axesHelper args={[3]} />

      <Bounds fit clip observe margin={1.2}>
        {object ? (
          <ViewportModel object={object} />
        ) : (
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" wireframe />
          </mesh>
        )}
      </Bounds>
    </>
  );
};

const Viewport: React.FC<ViewportProps> = (props) => {
  const {
    name,
    isActive,
    onActivate,
    size,
    showFrustum,
    frustumColor,
    frustumOpacity,
  } = props;

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "viewport-small";
      case "medium":
        return "viewport-medium";
      case "large":
        return "viewport-large";
      default:
        return "viewport-medium";
    }
  };

  return (
    <div
      className={`viewport ${isActive ? "active" : ""} ${getSizeClass()}`}
      onClick={onActivate}
    >
      <div className="viewport-label">{name}</div>

      <Canvas
        camera={{
          position: props.cameraPosition.position,
          fov: props.cameraPosition.fov || 75,
        }}
        className="viewport-canvas"
      >
        <color attach="background" args={[COLORS.BACKGROUND]} />
        <ViewportContent
          object={props.object}
          cameraPosition={props.cameraPosition}
          isActive={props.isActive}
          name={props.name}
          showFrustum={showFrustum}
          frustumColor={frustumColor}
          frustumOpacity={frustumOpacity}
        />
      </Canvas>
    </div>
  );
};

export default Viewport;
