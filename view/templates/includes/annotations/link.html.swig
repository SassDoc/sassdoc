{% if item.links.length > 0 %}
  <h3>Links</h3>
  {% for _link in item.links %}
    {% if loop.first %}<ul class="sassdoc__item-links">{% endif %}
    <li><a href="{{ _link.url }}">
      {% if _link.caption %}
        {{ _link.caption }}
      {% else %}
        {{ _link.url }}
      {% endif %}
    </a></li>
    {% if loop.last %}</ul>{% endif %}
  {% endfor %}
{% endif %}