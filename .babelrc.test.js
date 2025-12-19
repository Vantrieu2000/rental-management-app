module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-typescript', { onlyRemoveTypeImports: true }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [
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
  ],
};
