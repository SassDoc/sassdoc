{% if item.todos.length > 0 %}
  <h3>TODO's</h3>
  {% for _todo in item.todos %}
    {% if loop.first %}<ul class="sassdoc__item-todos">{% endif %}
    <li>{{ _todo | markdown }}</li>
    {% if loop.last %}</ul>{% endif %}
  {% endfor %}
{% endif %}	