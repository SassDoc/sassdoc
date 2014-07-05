{% if item.author %}
  <h3>Author{% if item.author.length > 1 %}s{% endif %}</h3>
  {% for author in item.author %}
    <p>{{ author }}</p>
  {% endfor %}
{% endif %}