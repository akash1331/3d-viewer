import React, { useRef } from "react";
import { ThreeDObject, ModelType } from "../types";
import "./css/ObjectLoader.css";

interface ObjectLoaderProps {
  onObjectLoad: (object: ThreeDObject | null) => void;
}

const ObjectLoader: React.FC<ObjectLoaderProps> = ({ onObjectLoad }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getModelType = (filename: string): ModelType => {
    const extension = filename.toLowerCase().split('.').pop();
    switch (extension) {
      case 'obj':
        return ModelType.OBJ;
      case 'gltf':
      case 'glb':
        return ModelType.GLTF;
      case 'fbx':
        return ModelType.FBX;
      case 'stl':
        return ModelType.STL;
      default:
        return ModelType.GLTF;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const detectedType = getModelType(file.name);
    console.log(`File selected: ${file.name}, size: ${file.size} bytes, detected type: ${detectedType}`);

    const object: ThreeDObject = {
      url: URL.createObjectURL(file),
      name: file.name,
      scale: 1,
      type: detectedType,
    };

    console.log('Loading object:', object);
    onObjectLoad(object);
  };

  const handleLoadSample = () => {
    // Load a sample object (cube for now)
    const sampleObject: ThreeDObject = {
      url: "sample-cube",
      name: "Sample Cube",
      scale: 1,
      type: ModelType.CUBE,
    };
    onObjectLoad(sampleObject);
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".gltf,.glb,.obj,.fbx,.stl,.ply"
        className="object-loader-file-input"
        aria-label="Upload 3D Model File"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="object-loader-button object-loader-button-primary"
      >
        Upload 3D Model
      </button>

      <button
        onClick={handleLoadSample}
        className="object-loader-button object-loader-button-secondary"
      >
        Load Sample Cube
      </button>

      <div className="object-loader-info">
        Supports: .gltf, .glb, .obj, .fbx, .stl, .ply
      </div>
    </div>
  );
};

export default ObjectLoader;
