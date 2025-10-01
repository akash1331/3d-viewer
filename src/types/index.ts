import * as THREE from "three";

// ===== ENUMS =====

export enum CameraViewName {
  FRONT = "Front",
  BACK = "Back",
  TOP = "Top",
  BOTTOM = "Bottom",
  LEFT = "Left",
  RIGHT = "Right",
  MAIN = "Main",
  PERSPECTIVE = "Perspective",
  ISOMETRIC = "Isometric"
}

export enum CameraType {
  PERSPECTIVE = "perspective",
  ORTHOGRAPHIC = "orthographic"
}

export enum ModelType {
  CUBE = "cube",
  GLTF = "gltf",
  OBJ = "obj",
  FBX = "fbx",
  STL = "stl"
}

export enum ViewportSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large"
}

export enum ViewportLayoutType {
  SINGLE = "single",
  QUAD = "quad",
  CUSTOM = "custom"
}

export enum AnimationEasing {
  LINEAR = "linear",
  EASE_IN_OUT = "easeInOut",
  EASE_IN = "easeIn",
  EASE_OUT = "easeOut"
}

export enum TabType {
  OBJECT = "object",
  CAMERAS = "cameras",
  ANIMATION = "animation"
}

// ===== CONSTANTS =====

export const COLORS = {
  BACKGROUND: "#0a0a0a",
  GRID_PRIMARY: "#444",
  GRID_SECONDARY: "#222",
  FRUSTUM_DEFAULT: "#ff4444",
  PRIMARY_ACCENT: "#007acc",
  SUCCESS: "#4caf50",
  ERROR: "#d32f2f",
  WARNING: "#ff9800",
  TEXT_PRIMARY: "#ffffff",
  TEXT_SECONDARY: "#cccccc",
  TEXT_DISABLED: "#888888"
} as const;

export const CAMERA_LIMITS = {
  FOV: {
    MIN: 30,
    MAX: 120,
    DEFAULT: 75
  },
  NEAR: {
    MIN: 0.1,
    DEFAULT: 0.1
  },
  FAR: {
    MIN: 1,
    MAX: 1000,
    DEFAULT: 100
  },
  ANIMATION_DURATION: {
    MIN: 1,
    MAX: 60,
    DEFAULT: 5
  },
  FRUSTUM_OPACITY: {
    MIN: 0,
    MAX: 1,
    DEFAULT: 0.2
  }
} as const;

export const GRID_CONFIG = {
  SIZE: 10,
  DIVISIONS: 10
} as const;

export const DEFAULT_POSITIONS = {
  FRONT: [0, 0, 5] as [number, number, number],
  BACK: [0, 0, -5] as [number, number, number],
  TOP: [0, 5, 0] as [number, number, number],
  BOTTOM: [0, -5, 0] as [number, number, number],
  LEFT: [-5, 0, 0] as [number, number, number],
  RIGHT: [5, 0, 0] as [number, number, number],
  MAIN: [5, 5, 5] as [number, number, number],
  ISOMETRIC: [3, 3, 3] as [number, number, number]
} as const;

export const DEFAULT_ROTATIONS = {
  FRONT: [0, 0, 0] as [number, number, number],
  BACK: [0, Math.PI, 0] as [number, number, number],
  TOP: [-Math.PI / 2, 0, 0] as [number, number, number],
  BOTTOM: [Math.PI / 2, 0, 0] as [number, number, number],
  LEFT: [0, -Math.PI / 2, 0] as [number, number, number],
  RIGHT: [0, Math.PI / 2, 0] as [number, number, number],
  MAIN: [0, 0, 0] as [number, number, number],
  ISOMETRIC: [0, 0, 0] as [number, number, number]
} as const;

export const UI_LABELS = {
  THREEDIM_VIEWER: "🎥 3D Viewer",
  LOAD_3D_OBJECT: "Load 3D Object",
  FIELD_OF_VIEW: "Field of View",
  NEAR_PLANE: "Near Plane",
  FAR_PLANE: "Far Plane",
  SHOW_FRUSTUM: "Show Frustum",
  FRUSTUM_COLOR: "Frustum Color",
  FRUSTUM_OPACITY: "Frustum Opacity",
  ANIMATION_DURATION: "Duration (seconds)",
  START_ANIMATION: "Start Animation",
  STOP_ANIMATION: "Stop Animation",
  CREATE_CAMERA: "Create Camera",
  REMOVE_CAMERA: "Remove",
  VIEW_CAMERA: "View",
  CAMERA_NAME_PLACEHOLDER: "Camera name...",
  TAB_3D_OBJECT: "3D Object",
  TAB_CAMERAS: "Cameras",
  TAB_ANIMATION: "Animation"
} as const;

export const ARIA_LABELS = {
  TOGGLE_ANIMATOR: "Toggle camera animator",
  STOP_ANIMATION: "Stop animation",
  START_ANIMATION: "Start animation",
  REMOVE_CAMERA: "Remove camera position",
  VIEW_CAMERA: "View camera position",
  FILE_INPUT: "Select 3D model file"
} as const;

// ===== INTERFACES =====

export interface CameraPosition {
  position: [number, number, number];
  rotation: [number, number, number];
  name: string;
  fov?: number;
  type?: CameraType;
}

export interface ThreeDObject {
  url: string;
  name: string;
  scale?: number;
  type: ModelType;
}

export interface ViewportConfig {
  id: string;
  camera: CameraPosition;
  isActive: boolean;
  name: string;
}

export interface LoadedModel {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
}

export interface Viewport {
  id: string;
  name: string;
  cameraPosition: CameraPosition;
  isActive: boolean;
  size: ViewportSize;
}

export interface ViewportLayout {
  type: ViewportLayoutType;
  viewports: Viewport[];
}

export interface CameraAnimation {
  id: string;
  name: string;
  duration: number;
  keyframes: CameraPosition[];
  easing: AnimationEasing;
}

export interface CameraFrustum {
  show: boolean;
  color: string;
  opacity: number;
}

export interface CameraSettings {
  fov: number;
  near: number;
  far: number;
  showFrustum: boolean;
  frustumColor: string;
  frustumOpacity: number;
}

// ===== FACTORY FUNCTIONS =====

export const createDefaultCameraPosition = (
  name: CameraViewName,
  customPosition?: [number, number, number],
  customRotation?: [number, number, number]
): CameraPosition => {
  const positionMap = {
    [CameraViewName.FRONT]: DEFAULT_POSITIONS.FRONT,
    [CameraViewName.BACK]: DEFAULT_POSITIONS.BACK,
    [CameraViewName.TOP]: DEFAULT_POSITIONS.TOP,
    [CameraViewName.BOTTOM]: DEFAULT_POSITIONS.BOTTOM,
    [CameraViewName.LEFT]: DEFAULT_POSITIONS.LEFT,
    [CameraViewName.RIGHT]: DEFAULT_POSITIONS.RIGHT,
    [CameraViewName.MAIN]: DEFAULT_POSITIONS.MAIN,
    [CameraViewName.PERSPECTIVE]: DEFAULT_POSITIONS.MAIN,
    [CameraViewName.ISOMETRIC]: DEFAULT_POSITIONS.ISOMETRIC
  };

  const rotationMap = {
    [CameraViewName.FRONT]: DEFAULT_ROTATIONS.FRONT,
    [CameraViewName.BACK]: DEFAULT_ROTATIONS.BACK,
    [CameraViewName.TOP]: DEFAULT_ROTATIONS.TOP,
    [CameraViewName.BOTTOM]: DEFAULT_ROTATIONS.BOTTOM,
    [CameraViewName.LEFT]: DEFAULT_ROTATIONS.LEFT,
    [CameraViewName.RIGHT]: DEFAULT_ROTATIONS.RIGHT,
    [CameraViewName.MAIN]: DEFAULT_ROTATIONS.MAIN,
    [CameraViewName.PERSPECTIVE]: DEFAULT_ROTATIONS.MAIN,
    [CameraViewName.ISOMETRIC]: DEFAULT_ROTATIONS.ISOMETRIC
  };

  return {
    name,
    position: customPosition || positionMap[name],
    rotation: customRotation || rotationMap[name],
    fov: CAMERA_LIMITS.FOV.DEFAULT,
    type: CameraType.PERSPECTIVE
  };
};

export const createDefaultCameraSettings = (): CameraSettings => ({
  fov: CAMERA_LIMITS.FOV.DEFAULT,
  near: CAMERA_LIMITS.NEAR.DEFAULT,
  far: CAMERA_LIMITS.FAR.DEFAULT,
  showFrustum: false,
  frustumColor: COLORS.FRUSTUM_DEFAULT,
  frustumOpacity: CAMERA_LIMITS.FRUSTUM_OPACITY.DEFAULT
});

export const getPresetCameraPositions = (): CameraPosition[] => [
  createDefaultCameraPosition(CameraViewName.FRONT),
  createDefaultCameraPosition(CameraViewName.BACK),
  createDefaultCameraPosition(CameraViewName.TOP),
  createDefaultCameraPosition(CameraViewName.LEFT),
  createDefaultCameraPosition(CameraViewName.RIGHT)
];
