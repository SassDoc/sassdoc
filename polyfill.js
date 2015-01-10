require('core-js/shim');
require('regenerator/runtime');

// Fix a bug with traceur in sass-convert
global.Symbol = undefined;
