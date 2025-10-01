import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CameraPosition, COLORS } from "../types";

interface CameraFrustumProps {
  cameraPosition: CameraPosition;
  show: boolean;
  color?: string;
  opacity?: number;
}

const CameraFrustum: React.FC<CameraFrustumProps> = ({
  cameraPosition,
  show = true,
  color = COLORS.FRUSTUM_DEFAULT,
}) => {
  const cameraHelperRef = useRef<THREE.CameraHelper>(null);

  useFrame(() => {
    if (!show || !cameraHelperRef.current) return;

    // Create a temporary camera to calculate frustum
    const tempCamera = new THREE.PerspectiveCamera(
      cameraPosition.fov || 75,
      1, // aspect ratio
      0.1, // near
      10 // far
    );

    tempCamera.position.set(...cameraPosition.position);
    tempCamera.rotation.set(...cameraPosition.rotation);
    tempCamera.updateMatrixWorld();

    cameraHelperRef.current.update();
  });

  if (!show) return null;

  return (
    <group>
      {/* Camera Position Indicator */}
      <mesh position={cameraPosition.position}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Camera Direction Arrow - Fixed syntax */}
      <group
        position={cameraPosition.position}
        rotation={new THREE.Euler(...cameraPosition.rotation)}
      >
        <arrowHelper
          args={[
            new THREE.Vector3(0, 0, -1), // direction
            new THREE.Vector3(0, 0, 0), // origin
            1, // length
            color, // color
          ]}
        />
      </group>

      {/* Camera Frustum Visualization */}
      <cameraHelper
        ref={cameraHelperRef}
        args={[
          new THREE.PerspectiveCamera(cameraPosition.fov || 75, 1, 0.1, 5),
        ]}
      />
    </group>
  );
};

export default CameraFrustum;
