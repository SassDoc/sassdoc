{% set title_displayed = false %}

{% for usedBy in item.usedBy %}

  {% if (display_access.indexOf(usedBy.access[0]) !== -1) and not (not display_alias and usedBy.alias[0]) %}
  
    {% if not title_displayed %}
      {% set title_displayed = true %}
      <h3>Used by</h3>
      <ul class="list-unstyled">
    {% endif %}

    <li><a href="#{{ usedBy.context.type }}-{{ usedBy.context.name }}"><code>{{ usedBy.context.name }}</code></a></li>
  {% endif %}

{% endfor %}

{% if title_displayed %}
</ul>
{% endif %}