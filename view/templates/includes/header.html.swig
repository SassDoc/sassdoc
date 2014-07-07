<header class="sassdoc__header">
  <div class="container">
    <h1 class="sassdoc__title">
      {% if package.homepage %}
        <a href="{{ package.homepage }}">{{ project_title }}{% if version %} - {{ version }}{% endif %}</a>
      {% else %}
        {{ project_title }}{% if version %} - {{ version }}{% endif %}
      {% endif %}
    </h1>
    <p class="sassdoc__count">{{ item_count }} item{% if item_count > 1 %}s{% endif %} documented</p>
  </div>
</header>