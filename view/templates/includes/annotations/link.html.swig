{% if item.link.length > 0 %}
  <h3 class="item__sub-heading">Links</h3>

  <ul class="list-unstyled">
  {% for link in item.link %}
    <li>
      <a href="{{ link.url }}">
        {% if link.caption %}
          {{ link.caption }}
        {% else %}
          {{ link.url }}
        {% endif %}
      </a>
    </li>
  {% endfor %}
  </ul>
{% endif %}