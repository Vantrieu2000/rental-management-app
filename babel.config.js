module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Temporarily disabled for web compatibility
      // 'nativewind/babel',
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@features': './src/features',
            '@shared': './src/shared',
            '@infrastructure': './src/infrastructure',
            '@store': './src/store',
            '@core': './src/core',
          },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      ],
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};
