import { useState, useCallback } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { LoadedModel, ModelType } from "../types";

export const useModelLoader = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadModel = useCallback(
    async (url: string, fileType: ModelType): Promise<LoadedModel | null> => {
      setLoading(true);
      setError(null);

      try {
        console.log(`Loading ${fileType} model from:`, url);

        let scene: THREE.Group;
        let animations: THREE.AnimationClip[] = [];

        switch (fileType) {
          case ModelType.OBJ: {
            console.log('Loading OBJ file from URL:', url);
            const loader = new OBJLoader();
            const object = await new Promise<THREE.Group>((resolve, reject) => {
              loader.load(
                url,
                (obj) => {
                  console.log('OBJ loaded successfully:', obj);
                  console.log('OBJ children count:', obj.children.length);
                  
                  // Apply default material to OBJ models (they often don't have materials)
                  let meshCount = 0;
                  obj.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                      meshCount++;
                      console.log(`Processing mesh ${meshCount}:`, child.name || 'unnamed');
                      
                      if (!child.material || (child.material as THREE.Material).name === "") {
                        child.material = new THREE.MeshStandardMaterial({
                          color: 0x888888,
                          metalness: 0.1,
                          roughness: 0.7,
                        });
                        console.log(`Applied default material to mesh ${meshCount}`);
                      }
                      
                      // Ensure geometry has normals for proper lighting
                      if (!child.geometry.attributes.normal) {
                        child.geometry.computeVertexNormals();
                        console.log(`Computed vertex normals for mesh ${meshCount}`);
                      }
                    }
                  });
                  
                  console.log(`Total meshes processed: ${meshCount}`);
                  resolve(obj);
                },
                (progress) => {
                  const percent = progress.total > 0 ? (progress.loaded / progress.total * 100) : 0;
                  console.log(`OBJ loading progress: ${percent.toFixed(1)}% (${progress.loaded}/${progress.total} bytes)`);
                },
                (error) => {
                  console.error('Error loading OBJ:', error);
                  reject(new Error(`Failed to load OBJ file: ${error instanceof Error ? error.message : String(error)}`));
                }
              );
            });
            scene = object;
            break;
          }

          case ModelType.GLTF: {
            const loader = new GLTFLoader();
            const gltf = await new Promise<any>((resolve, reject) => {
              loader.load(
                url,
                (gltf) => resolve(gltf),
                (progress) => {
                  console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
                },
                (error) => reject(error)
              );
            });
            scene = gltf.scene;
            animations = gltf.animations || [];
            break;
          }

          case ModelType.FBX: {
            const loader = new FBXLoader();
            const fbx = await new Promise<THREE.Group>((resolve, reject) => {
              loader.load(
                url,
                (object) => resolve(object),
                (progress) => {
                  console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
                },
                (error) => reject(error)
              );
            });
            scene = fbx;
            animations = fbx.animations || [];
            break;
          }

          case ModelType.STL: {
            const loader = new STLLoader();
            const geometry = await new Promise<THREE.BufferGeometry>((resolve, reject) => {
              loader.load(
                url,
                (geometry) => resolve(geometry),
                (progress) => {
                  console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
                },
                (error) => reject(error)
              );
            });
            
            const material = new THREE.MeshStandardMaterial({
              color: 0x888888,
              metalness: 0.1,
              roughness: 0.7,
            });
            const mesh = new THREE.Mesh(geometry, material);
            scene = new THREE.Group();
            scene.add(mesh);
            break;
          }

          case ModelType.CUBE:
          default: {
            // Fallback: Create a sample cube
            scene = new THREE.Group();
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshStandardMaterial({
              color: 0x00ff88,
              metalness: 0.3,
              roughness: 0.4,
            });
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            break;
          }
        }

        return {
          scene,
          animations,
        };
      } catch (err) {
        console.error('Model loading error:', err);
        setError(`Failed to load ${fileType} model: ${err}`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loadModel, loading, error };
};
