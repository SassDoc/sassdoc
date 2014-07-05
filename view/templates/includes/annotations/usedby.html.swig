{% if item.usedBy.length > 0 %}
  <h3>Used by</h3>
  {% for usedBy in item.usedBy %}
    {% if loop.first %}<ul class="sassdoc__item-usedby">{% endif %}
    <li><a href="#{{ usedBy.type }}-{{ usedBy.item }}"><code>{{ usedBy.item }}</code></a></li>
    {% if loop.last %}</ul>{% endif %}
  {% endfor %}
{% endif %}