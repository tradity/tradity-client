(function (global) {
  var map = {
    'app':                'app',    
    '@angular':           'node_modules/@angular',
    'rxjs':               'node_modules/rxjs',    
    '@angular2-material': 'node_modules/@angular2-material'
  };
  
  var packages = {
    'app':                        { main: 'main.js', defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { defaultExtension: 'js' },
  };
  
  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router'
  ];
  
  ngPackageNames.forEach(function (pkgName) {
    packages['@angular/' + pkgName] = { main: pkgName + '.umd.js', defaultExtension: 'js' };
  });
  
  var ngMaterialPackageNames = [
    'core',
    'input',
    'button'
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