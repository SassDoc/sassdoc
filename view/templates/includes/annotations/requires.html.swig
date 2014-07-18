{% set title_displayed = false %}
{% for require in item.requires %}

  {% if (display.access.indexOf(require.access[0]) != -1) and not (not display.alias and require.alias[0]) or require.external %}
    {% if not title_displayed %}
      {% set title_displayed = true %}
      <h3 class="item__sub-heading">Requires</h3>
      <ul class="list-unstyled">
    {% endif %}

    {% if require.external %}
      {% if require.url %}
        <li><a href="{{ require.url}}"><code>{{ require.name }}</code></a>  {{ require.description }}</li>
      {% else %}
        <li>{{ require.name }} {{ require.description }}</li>
      {% endif %}
    {% else %}
      <li><a href="#{{ require.context.type }}-{{ require.context.name }}"><code>{{ require.context.name }}</code></a>  {{ require.description }}</li>
    {% endif %}
  {% endif %}

{% endfor %}

{% if title_displayed %}
</ul>
{% endif %}
