// react-native.config.js
module.exports = {
  // Add 'project' key for modern RN versions (often implicitly handled but good to be explicit)
  project: {
    ios: {},
    android: {},
  },
  // Extend the assets array to include both fonts and images
  assets: [
    './src/assets/fonts',    // Your existing font path
    './src/assets/images',   // <-- Add this line for your images
  ],
  // Keep these lines if you are still relying on react-native-typescript-transformer
  // but be aware that for modern RN projects, they might not be necessary.
  getTransformModulePath() {
    return require.resolve('react-native-typescript-transformer');
  },
  getSourceExts() {
    return ['ts', 'tsx'];
  },
};