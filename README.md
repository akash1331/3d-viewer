# 🎥 3D Viewer

A modern, interactive 3D model viewer built with React, Three.js, and TypeScript. This application provides advanced camera controls, multiple viewport layouts, and comprehensive 3D model loading capabilities.

## 🌟 Features

### 🎯 **Core Functionality**
- **Multi-format 3D Model Support**: Load OBJ, GLTF/GLB, FBX, STL, and PLY files
- **Interactive 3D Viewport**: Real-time 3D rendering with orbit controls
- **Advanced Camera System**: Multiple camera positions with smooth transitions
- **Camera Animation**: Create custom camera animations with keyframes
- **Responsive Design**: Optimized for different screen sizes

### 📸 **Camera Management**
- **Preset Camera Views**: Front, Back, Top, Left, Right views
- **Custom Camera Positions**: Create and save custom viewing angles
- **Camera Settings**: Adjustable FOV, near/far planes, and frustum visualization
- **Smooth Transitions**: Animated camera movements between positions
- **Camera Frustum Visualization**: Visual representation of camera viewing area

### 🎬 **Animation System**
- **Keyframe Animation**: Create smooth camera animations between multiple positions
- **Easing Options**: Linear, ease-in, ease-out, and ease-in-out transitions
- **Duration Control**: Customizable animation timing (1-60 seconds)
- **Real-time Preview**: Live animation playback with stop/start controls

### 🎨 **User Interface**
- **Tabbed Interface**: Organized controls for 3D Objects, Cameras, and Animation
- **Visual Feedback**: Loading states, error indicators, and progress tracking
- **Accessibility**: ARIA labels and keyboard navigation support
- **Modern Design**: Clean, professional interface with hover effects

## 🏗️ Architecture

### 📁 **Project Structure**
```
src/
├── components/           # React components
│   ├── css/             # Component-specific CSS files
│   ├── App.tsx          # Main application component
│   ├── ControlsPanel.tsx # Main control interface
│   ├── Viewport.tsx     # 3D rendering viewport
│   ├── ViewportManager.tsx # Viewport layout management
│   ├── ObjectLoader.tsx # 3D model file loading
│   ├── CameraManager.tsx # Camera position management
│   ├── AdvancedCameraControls.tsx # Camera settings
│   ├── CameraAnimator.tsx # Animation controls
│   └── CameraFrustum.tsx # Camera frustum visualization
├── hooks/               # Custom React hooks
│   └── useModelLoader.ts # 3D model loading logic
├── types/               # TypeScript definitions
│   └── index.ts         # Type definitions and constants
└── main.tsx            # Application entry point
```

### 🔧 **Technology Stack**
- **React 19.1.1**: Modern React with hooks and functional components
- **TypeScript 5.9.3**: Type safety and enhanced development experience
- **Three.js 0.180.0**: 3D graphics rendering and model loading
- **React Three Fiber 9.3.0**: React renderer for Three.js
- **React Three Drei 10.7.6**: Useful helpers and components for R3F
- **Vite 7.1.7**: Fast build tool and development server

### 🎨 **Design Patterns**
- **Component Composition**: Modular, reusable components
- **Custom Hooks**: Separated business logic (useModelLoader)
- **Type Safety**: Comprehensive TypeScript definitions
- **Constants Centralization**: All hardcoded values in centralized constants
- **CSS Modules**: Component-scoped styling

## 🚀 Getting Started

### 📋 **Prerequisites**
- Node.js (version 20 or higher)
- npm or yarn package manager
- Modern web browser with WebGL support

### 💿 **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd 3d-viewer

# Install dependencies
npm install

# Start development server
npm run dev
```

### 🏃‍♂️ **Running the Application**
```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:3000`

## 📖 Usage Guide

### 🎯 **Loading 3D Models**
1. Navigate to the **"3D Object"** tab in the controls panel
2. Click **"Upload 3D Model"** to select a file from your computer
3. Supported formats: `.obj`, `.gltf`, `.glb`, `.fbx`, `.stl`, `.ply`
4. Or click **"Load Sample Cube"** to load a test object

### 📷 **Managing Cameras**
1. Switch to the **"Cameras"** tab
2. **Predefined Views**: Click any preset button (Front, Back, Top, etc.)
3. **Custom Cameras**: 
   - Enter a name in the text field
   - Click "Create Camera" to add a custom position
   - Use "View" to switch to that camera
   - Use "Remove" to delete unwanted positions

### 🎬 **Creating Animations**
1. Go to the **"Animation"** tab
2. Select at least 2 camera positions from the list
3. Adjust the duration (1-60 seconds)
4. Click **"Start Animation"** to begin playback
5. Use **"Stop Animation"** to halt playback

### ⚙️ **Camera Settings**
- **Field of View**: Adjust the camera's viewing angle (30-120°)
- **Near/Far Planes**: Control rendering distance
- **Show Frustum**: Visualize the camera's viewing area
- **Frustum Color/Opacity**: Customize frustum appearance

## 🎨 Customization

### 🎯 **Adding New Model Types**
To support additional 3D model formats, modify:
1. `src/types/index.ts` - Add new `ModelType` enum value
2. `src/components/ObjectLoader.tsx` - Update `getModelType()` function
3. `src/hooks/useModelLoader.ts` - Add loader implementation

### 🌈 **Theming**
All colors and styling constants are centralized in `src/types/index.ts`:
```typescript
export const COLORS = {
  BACKGROUND: "#0a0a0a",
  GRID_PRIMARY: "#444",
  FRUSTUM_DEFAULT: "#ff4444",
  // ... more colors
} as const;
```

### 📐 **Camera Settings**
Adjust default limits and values in `src/types/index.ts`:
```typescript
export const CAMERA_LIMITS = {
  FOV: { MIN: 30, MAX: 120, DEFAULT: 75 },
  ANIMATION_DURATION: { MIN: 1, MAX: 60, DEFAULT: 5 },
  // ... more limits
} as const;
```

## 🔍 Troubleshooting

### 🐛 **Common Issues**

**Model not appearing:**
- Check browser console for error messages
- Verify file format is supported
- Try zooming out (model might be very large/small)
- Test with the sample cube first

**Loading errors:**
- Ensure file is not corrupted
- Check file size (very large files may timeout)
- Verify browser supports WebGL

**Performance issues:**
- Reduce model complexity
- Lower polygon count
- Check available system memory

### 🔧 **Debug Features**
- Open browser developer tools (F12)
- Check Console tab for detailed loading logs
- Monitor Network tab for file loading issues
- Use the sample cube to verify system functionality

## 🎯 Model Attribution

**Note**: Any 3D models used for testing or demonstration purposes in this project are sourced from [Free3D.com](https://free3d.com/), a platform providing free 3D models for educational and commercial use. Please respect the individual licensing terms of each model when using them in your projects.

## 📊 Performance Characteristics

- **Startup Time**: ~2-3 seconds on modern hardware
- **Model Loading**: Varies by file size (typically 1-10 seconds)
- **Memory Usage**: ~50-200MB depending on model complexity
- **Supported Model Sizes**: Up to ~50MB files (browser dependent)

## 🔒 Browser Compatibility

- **Chrome**: ✅ Fully supported (recommended)
- **Firefox**: ✅ Fully supported
- **Safari**: ✅ Supported with minor limitations
- **Edge**: ✅ Fully supported
- **Mobile**: ⚠️ Limited support (touch controls may vary)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the package.json file for details.

## 🙏 Acknowledgments

- **Three.js Community** - For the excellent 3D graphics library
- **React Three Fiber Team** - For the React integration
- **Free3D.com** - For providing free 3D models for testing
- **Open Source Community** - For the various tools and libraries used

## 🆘 Support

For issues, questions, or contributions:
1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information
4. Include browser version, file types, and error messages

---

**Happy 3D Modeling! 🚀**