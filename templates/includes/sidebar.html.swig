<h2 class="sassdoc__map-heading">Documentation map</h2>
<div class="sassdoc__map-container">
{% if data.functions.length === 0 and data.mixins.length === 0 and data.variables.length === 0 %}
  <ul><li>No item yet.</li></ul>
{% else %}

  <ul>
  {% for type, obj in data %}
    <li class="sassdoc__map-section"><a href="#{{ type }}">{{ type | capitalize }}</a></li>
    {% for item in obj %}
      {% if (display.alias == false and item.alias != false) or (display.private == false and item.access == "private") %} 

      {% else %}
        {% set item_title = item.name %}
          <li>
          <a href="#{{ item.type }}-{{ item.name }}">{{ item.name }}</a> 
          {% if item.access == "private" %}<span class="annotation">private</span>{% endif %}
          {% if item.alias != false %}<span class="annotation">alias</span>{% endif %}
          </li>
      {% endif %}
    {% endfor %}
  {% endfor %}
  </ul>

{% endif %}
</div>