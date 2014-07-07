{% if item.author %}
  <h3>Author{% if item.author.length > 1 %}s{% endif %}</h3>

  <ul class="list-unstyled">
    {% for author in item.author %}
      <li>{{ author | markdown }}</li>
    {% endfor %}
  </ul>
{% endif %}