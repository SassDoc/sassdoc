'use strict';
var typeRegEx =  /^\s*(?:\{(.*?)\})?\s*(?:\$(\w+))?\s*(?:\((.*?)\))?\s*(?:-?\s*(.*))?$/m;
module.exports = function( text ){
  var parsed = typeRegEx.exec(text);
  var obj = {};
  if ( parsed[1] ) {
    obj.type = parsed[1];
  }
  if ( parsed[2] ) {
    obj.variable  = { name : parsed[2], default : parsed[3] };
  }
  if ( parsed[4] ) {
    obj.description = parsed[4];
  }
  return obj;
};

module.exports.alias = ['return'];