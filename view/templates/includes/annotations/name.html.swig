<h2 class="sassdoc__item-name">
  <a class="sassdoc__item-anchor" href="#{{ item.context.type }}-{{ item.context.name }}">#</a>

  {% if item.access[0] != "public" %}
    <span class="sassdoc__item-access">[{{ item.access[0] }}]</span>
  {% endif %}

  <code>{{ item.context.name }}</code>

  {% if display_alias and item.aliased.length > 0 %}
    <span class="sassdoc__item-alias">(aliased as
    {% for alias in item.aliased %}
      <a href="#{{ item.context.type }}-{{ alias }}"><code>{{ alias }}</code></a>
    {% endfor %}
    )</span>
  {% endif %}

  {% if item.alias %}
    <span class="sassdoc__item-alias">(alias for <a href="#{{ item.context.type }}-{{ item.alias[0] }}"><code>{{ item.alias[0] }}</code></a>)</span>
  {% endif %}

  {% if item.since %}
    <span class="sassdoc__item-since">Since {{ item.since[0] }}</span>
  {% endif %}
</h2>