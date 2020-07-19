import nodeResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';

export default {
  input: 'tmp/app/main.prod.js',
  output: {
    file: 'dist/build.js',
    format: 'iife',
    sourcemap: true,
    sourcemapFile: 'dist/build.js.map'
  },
  onwarn: (warning, warn) => {
    // skip warnings about this being rewritten to undefined
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    warn(warning);
  },
  plugins: [
    nodeResolve({jsnext: true, module: true}),
    terser(),
    visualizer({ filename: 'dist/bundle-stats.html' })
  ]
}
