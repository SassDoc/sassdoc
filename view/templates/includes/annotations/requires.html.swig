{% if item.requires.length > 0 %}
  <h3>Requires</h3>
  {% for require in item.requires %}
    {% if loop.first %}<ul class="sassdoc__item-requires">{% endif %}
    <li><a href="#{{ require.type }}-{{ require.name }}"><code>{{ require.name }}</code></a></li>
    {% if loop.last %}</ul>{% endif %}
  {% endfor %}
{% endif %}