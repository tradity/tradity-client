import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs    from 'rollup-plugin-commonjs';
import uglify      from 'rollup-plugin-uglify';

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
    commonjs({
      include: [
        'node_modules/rxjs/**',
        'node_modules/ngrx-store-localstorage/dist/index.js',
        'node_modules/chart.js/dist/Chart.bundle.js'
      ],
      namedExports: {
        'node_modules/chart.js/dist/Chart.bundle.js': ['Chart']
      }
    }),
    uglify()
  ]
}
