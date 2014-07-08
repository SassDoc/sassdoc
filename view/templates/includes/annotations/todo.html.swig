{% if item.todos.length > 0 %}
  <h3 class="item__sub-heading">TODO's</h3>

  <ul class="list-unstyled">
    {% for todo in item.todos %}
      <li>{{ todo | markdown }}</li>
    {% endfor %}
  </ul>
{% endif %}	