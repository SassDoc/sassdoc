{% if item.example %}
  <h3>Example</h3>

  {% for example in item.example %}
    <pre class="sassdoc__item-code"><code class="language-{{ example.type }}">{{ example.code | escape | safe }}</code></pre>
  {% endfor %}
{% endif %}