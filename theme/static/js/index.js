(function() {

  var doc = document.documentElement
  var body = document.body
  var aside = document.getElementById('aside')

  // listen for scroll event to do positioning
  window.addEventListener('scroll', toggleAsideClass, false)
  window.addEventListener('resize', toggleAsideClass, false)

  // init smooth scroll
  smoothScroll.init({
    speed: 400,
    offset: window.innerWidth > 720
      ? 40
      : 58
  })

  function toggleAsideClass() {
    if (!aside.classList) {
      return
    }

    var top = doc && doc.scrollTop || body.scrollTop

    if (top > 70) {
      aside.classList.add('fixed')
    } else {
      aside.classList.remove('fixed')
    }
  }

})()
