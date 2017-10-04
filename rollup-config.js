import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs    from 'rollup-plugin-commonjs';
import uglify      from 'rollup-plugin-uglify'

export default {
  entry: 'tmp/app/main.prod.js',
  dest: 'dist/build.js',
  sourceMap: true,
  sourceMapFile: 'dist/build.js.map',
  format: 'iife',
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
        'node_modules/ngrx-store-localstorage/dist/index.js'
      ]
    }),
    uglify()
  ]
}
