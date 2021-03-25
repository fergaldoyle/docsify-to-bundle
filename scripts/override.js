(function () {
  var basePath = location.pathname.split('/');
  basePath.pop();
  basePath = basePath.join('/');

  var proxied = window.XMLHttpRequest.prototype.open;
  window.XMLHttpRequest.prototype.open = function () {
    if (arguments && arguments[1] && (arguments[1] + '').indexOf('.md') !== -1) {
      var filename = arguments[1].replace(basePath + '/', '');

      this.send = function(){};

      this.addEventListener = function(event, cb) {
        switch (event) {
          case 'loadend':
            cb({});
            break;
          case 'load':
            var el = document.querySelector('[data-md="' + filename + '"]');

            if(!el) {
              cb({
                target: {
                  status: 400
                }
              });
              break;
            }

            cb({
              target: {
                status: 200,
                response: el.innerText
              }
            });
            break;
        }
      }

    }
    return proxied.apply(this, [].slice.call(arguments));
  };

})();