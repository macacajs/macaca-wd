(function() {

  var doc = document.documentElement
  var body = document.body
  var sidebar = document.getElementById('sidebar')

  // listen for scroll event to do positioning
  window.addEventListener('scroll', toggleSidebarClass, false)
  window.addEventListener('resize', toggleSidebarClass, false)
  toggleSidebarClass()

  // init smooth scroll
  smoothScroll.init({
    speed: 400,
    offset: window.innerWidth > 720 ? 40 : 58
  })

  function toggleSidebarClass() {
    if (!sidebar || !sidebar.classList) {
      return
    }

    var top = doc && doc.scrollTop || body.scrollTop

    if (top > 70) {
      sidebar.classList.add('fixed')
    } else {
      sidebar.classList.remove('fixed')
    }
  }

  var lang_button = document.getElementById('lang-button')
  lang_button.addEventListener('click', swichLang, false)
  var current_lang = document.getElementById('lang').value

  function swichLang(e) {
    e.preventDefault()
    var dist = location.protocol + '//' + location.host

    if (current_lang === 'en') {
      dist += '/zh' + location.pathname
    } else {
      dist += location.pathname.replace('/zh', '')
    }
    location.href = dist
  }

  function renderNav() {
    var container = document.querySelector('.container article');
    if (!container) {
      return;
    }

    var list = container.querySelectorAll('h1,h2');

    var navHtml = '';
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      var nodeName = item.nodeName;
      navHtml += item.outerHTML.replace('id', 'data-id');
      item.addEventListener('click', function(e) {
        var dataId = e.currentTarget.id;
        location.hash = '#' + dataId;
        location.href = '#' + dataId;
      }, false);
    }

    var nav_fix = document.createElement('div');
    nav_fix.id = 'nav-fix';
    nav_fix.className = 'nav-fix';
    nav_fix.innerHTML = navHtml;

    nav_fix.addEventListener('click', function(e) {
      var target = e.target;
      var dataId = target.getAttribute('data-id');
      location.hash = '#' + dataId;
      location.href = '#' + dataId;
    }, false);
    container.appendChild(nav_fix);
  };

  renderNav();

  var hash = location.hash;
  if (hash) {
    var element = document.getElementById(hash.replace('#', ''));
    if (element) {
      location.href = hash;
    }
  }

})()
