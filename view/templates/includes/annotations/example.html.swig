{% if item.example %}
  <h3 class="item__sub-heading">Example</h3>

  {% for example in item.example %}
    <pre class="item__example"><code class="language-{{ example.type }}">{{ example.code | escape | safe }}</code></pre>
  {% endfor %}
{% endif %}