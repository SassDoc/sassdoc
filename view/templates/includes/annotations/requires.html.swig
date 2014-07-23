{% set title_displayed = false %}
{% for required in item.requires %}

  {% if (display.access.indexOf(required.item.access[0]) != -1) and not (not display.alias and required.item.alias[0]) or required.external %}
    {% if not title_displayed %}
      {% set title_displayed = true %}
      <h3 class="item__sub-heading">Requires</h3>
      <ul class="list-unstyled">
    {% endif %}

    {% if required.external %}
      <li>
        {% if required.url %}
          <a href="{{ required.url}}"><code>{{ required.name }}</code></a>
        {% else %}
          <code>{{ required.name }}</code>
        {% endif %}
        {% if required.description %}
          <div class="item__requires-description">{{ required.description | markdown | nl2br }}</div>
        {% endif %}
      </li>
    {% else %}
      <li>
        <a href="#{{ required.item.context.type }}-{{ required.item.context.name }}"><code>{{ required.item.context.name }}</code></a>
        {% if required.description %}
          <div class="item__requires-description">{{ required.description | markdown | nl2br }}</div>
        {% endif %}
    {% endif %}
  {% endif %}

{% endfor %}

{% if title_displayed %}
</ul>
{% endif %}
