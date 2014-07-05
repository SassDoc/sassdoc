{% if item.example %}
  <h3>Example</h3>
  {% for example in item.example %}
    <pre class="sassdoc__item-code">{{ example | raw }}</pre>
  {% endfor %}
{% endif %}