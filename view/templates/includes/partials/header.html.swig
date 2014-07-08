<header class="header" role="banner">
  <div class="container">
    <h1 class="header__title">
      {% if package.homepage %}
        <a href="{{ package.homepage }}">{{ project_title }}{% if package.version %} - v{{ package.version }}{% endif %}</a>
      {% else %}
        {{ project_title }}{% if version %} - {{ version }}{% endif %}
      {% endif %}
    </h1>
    <p class="header__item-count">{{ item_count }} item{% if item_count > 1 %}s{% endif %} documented</p>
  </div>
</header>