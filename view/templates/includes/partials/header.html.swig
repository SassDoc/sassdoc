<header class="header" role="banner">
  <div class="container">
    <h1 class="header__title">
      {% if package.homepage %}
        <a href="{{ package.homepage }}">{{ project_title }}{% if package.version %} - v{{ package.version }}{% endif %}</a>
      {% else %}
        {{ project_title }}{% if version %} - {{ version }}{% endif %}
      {% endif %}
    </h1>
    <div class="sassdoc__searchbar  searchbar">
       <label for="js-search-input">Search</label>
       <div class="searchbar__form" id="js-search">
         <input name="search" type="search" class="searchbar__field" autocomplete="off" autofocus id="js-search-input" />
         <ul class="searchbar__suggestions" id="js-search-suggestions"></ul>
       </div>
     </div>
    <p class="header__item-count">{{ item_count }} item{% if item_count > 1 %}s{% endif %} documented</p>
  </div>
</header>