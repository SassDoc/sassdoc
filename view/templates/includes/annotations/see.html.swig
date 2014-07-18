{% set title_displayed = false %}
{% for see in item.see %}

  {% if (display.access.indexOf(see.access[0]) != -1) and not (not display.alias and see.alias[0]) %}
    {% if not title_displayed %}
      {% set title_displayed = true %}
      <h3 class="item__sub-heading">See</h3>
      <ul class="list-unstyled">
    {% endif %}

    <li><a href="#{{ see.context.type }}-{{ see.context.name }}"><code>{{ see.context.name }}</code></a></li>
  {% endif %}

{% endfor %}

{% if title_displayed %}
</ul>
{% endif %}
