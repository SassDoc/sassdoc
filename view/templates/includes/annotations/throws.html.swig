{% if item.throws.length > 0 %}
  <h3>Throws</h3>
  {% for _throw in item.throws %}
    {% if loop.first %}<ul class="sassdoc__item-throws">{% endif %}
    <li>{{ _throw | markdown }}</li>
    {% if loop.last %}</ul>{% endif %}
  {% endfor %}
{% endif %}