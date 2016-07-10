(function (global) {
  var map = {
    'app':                'app',    
    '@angular':           'node_modules/@angular',
    'rxjs':               'node_modules/rxjs',    
    '@angular2-material': 'node_modules/@angular2-material'
  };
  
  var packages = {
    'app':                        { main: 'main.js', defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' }
  };
  
  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'forms',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router'
  ];
  
  // Individual files (~300 requests):
  function packIndex(pkgName) {
    packages['@angular/' + pkgName] = { main: 'index.js', defaultExtension: 'js' };
  }
  // Bundled (~40 requests):
  function packUmd(pkgName) {
    packages['@angular/' + pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
  }
  // Most environments should use UMD; some (Karma) need the individual index files
  var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
  // Add package entries for angular packages
  ngPackageNames.forEach(setPackageConfig);
  
  var ngMaterialPackageNames = [
    'core',
    'input',
    'button',
    'sidenav'
  ];
  
  ngMaterialPackageNames.forEach(function (pkgName) {
    packages['@angular2-material/' + pkgName] = { main: pkgName + '.js', format: 'cjs', defaultExtension: 'js' };
  });
  
  var config = {
    map: map,
    packages: packages
  }
  
  System.config(config);
})(this);