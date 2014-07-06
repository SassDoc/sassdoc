{% set title_displayed = false %}

{% for usedBy in item.usedBy %}
  {% set display_access_okay = display_access.indexOf(usedBy.access[0]) != -1 %}
  {% set display_alias_okay  = not (usedBy.alias and not display_alias) %}

  {% if display_access_okay and display_alias_okay %}
    {% if not title_displayed %}
      {% set title_displayed = true %}
      <h3>Used by</h3>
      <ul class="sassdoc__item-usedby">
    {% endif %}

    <li><a href="#{{ usedBy.context.type }}-{{ usedBy.context.name }}"><code>{{ usedBy.context.name }}</code></a></li>
  {% endif %}

{% endfor %}

{% if title_displayed %}
</ul>
{% endif %}