<header class="sassdoc__header">
  <div class="container">
    <h1 class="sassdoc__title">{{ package.name | capitalize | default('SassDoc') }}{% if version %} - {{ version }}{% endif %}</h1>
    <p class="sassdoc__count">{{ item_count }} item{% if item_count > 1 %}s{% endif %} documented</p>
  </div>
</header>