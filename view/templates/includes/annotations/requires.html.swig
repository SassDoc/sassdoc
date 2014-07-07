{% set title_displayed = false %}
{% for require in item.requires %}

  {% if (display_access.indexOf(require.access[0]) !== -1) and not (not display_alias and require.alias[0]) %}
    {% if not title_displayed %}
      {% set title_displayed = true %}
      <h3>Requires</h3>
      <ul class="list-unstyled">
    {% endif %}

    <li><a href="#{{ require.context.type }}-{{ require.context.name }}"><code>{{ require.context.name }}</code></a></li>
  {% endif %}

{% endfor %}

{% if title_displayed %}
</ul>
{% endif %}

