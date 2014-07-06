{% set title_displayed = false %}
{% for require in item.requires %}
  {% set display_access_okay = display_access.indexOf(require.access[0]) != -1 %}
  {% set display_alias_okay  = not (require.alias and not display_alias) %}

  {% if display_access_okay and display_alias_okay %}
    {% if not title_displayed %}
      {% set title_displayed = true %}
      <h3>Requires</h3>
      <ul class="sassdoc__item-requires">
    {% endif %}

    <li><a href="#{{ require.context.type }}-{{ require.context.name }}"><code>{{ require.context.name }}</code></a></li>
  {% endif %}

{% endfor %}

{% if title_displayed %}
</ul>
{% endif %}