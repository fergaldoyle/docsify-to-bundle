(function () {

  setTimeout(function() {
    var placeholder = 'Search';
    if($docsify.search && $docsify.search.placeholder) {
      placeholder = $docsify.search.placeholder;
    }
    document.querySelector('input[type=search]').setAttribute('placeholder', placeholder);
  }, 50);

})();