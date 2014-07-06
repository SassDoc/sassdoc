{% if item.returns %}
  <h3>Returns</h3>
  <p class="sassdoc__item-description">{% if item.returns[0].description %}{{ item.returns[0].description | markdown }}{% endif %}
  {% if item.returns[0].type == '*' %}
    Any
  {% else %}
    <code>{{ item.returns[0].type | split('|') | trim | capitalize | join('</code>, <code>') | raw }}</code>
  {% endif %}
  </p>
{% endif %}