<h2 class="item__heading">
  <a class="item__anchor" href="#{{ item.context.type }}-{{ item.context.name }}">#</a>

  {% if item.access[0] != "public" %}
    <span class="item__access">[{{ item.access[0] }}]</span>
  {% endif %}

  <code>{{ item.context.name }}</code>

  {% if display.alias and item.aliased.length > 0 %}
    <span class="item__aliased">(aliased as
    {% for alias in item.aliased %}
      <a href="#{{ item.context.type }}-{{ alias }}"><code>{{ alias }}</code></a>
    {% endfor %}
    )</span>
  {% endif %}

  {% if item.alias %}
    <span class="item__alias">(alias for <a href="#{{ item.context.type }}-{{ item.alias[0] }}"><code>{{ item.alias[0] }}</code></a>)</span>
  {% endif %}

  {% if item.since %}
    <span class="item__since">Since {{ item.since[0] }}</span>
  {% endif %}
</h2>