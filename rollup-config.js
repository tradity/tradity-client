import nodeResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';
import gzip from 'rollup-plugin-gzip';
import { brotliCompressSync } from 'zlib';

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
    gzip(),
    gzip({
      customCompression: content => brotliCompressSync(Buffer.from(content)),
      fileName: '.br'
    }),
    visualizer({ filename: 'dist/bundle-stats.html', sourcemap: true })
  ]
}
