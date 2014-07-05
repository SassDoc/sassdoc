{% if item.description %}
  <h3>Description</h3>
  <p class="sassdoc__item-description">{{ item.description | markdown | nl2br }}</p>
{% endif %}