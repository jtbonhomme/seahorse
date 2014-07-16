(function(){
  'use strict';
  function listen(config, port) {
    console.log("config " + JSON.stringify(config));
    console.log("listen " + port);
  }
  module.exports.listen = listen;
})();
