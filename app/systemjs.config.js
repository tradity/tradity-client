(function (global) {
  System.config({
    paths: {
      'npm:': 'node_modules/'
    },
    map: {
      'app': 'app',
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      '@ngrx/core': 'npm:@ngrx/core/bundles/core.umd.js',
      '@ngrx/store': 'npm:@ngrx/store/bundles/store.umd.js',
      '@ngrx/effects': 'npm:@ngrx/effects/bundles/effects.umd.js',
      '@ngrx/store-devtools': 'npm:@ngrx/store-devtools/bundles/store-devtools.umd.js',
      'ngrx-store-localstorage': 'npm:ngrx-store-localstorage/dist/index.js',
      'chart.js': 'npm:chart.js/dist/Chart.bundle.js',
      'rxjs': 'npm:rxjs',
      'rxjs/operators': 'npm:rxjs/operators'
    },
    packages: {
      'app': {
        main: './main.dev.js',
        defaultExtension: 'js'
      },
      'rxjs': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      'rxjs/operators': {
        main: 'index.js',
        defaultExtension: 'js'
      }
    }
  });
})(this);
