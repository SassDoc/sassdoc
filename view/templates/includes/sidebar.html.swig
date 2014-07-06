<h2 class="sassdoc__map-heading">Documentation map</h2>
<div class="sassdoc__map-container">
{% if 
  (not data.function or data.function.length === 0) and 
  (not data.mixin or data.mixin.length === 0) and
  (not data.variable or data.variable.length === 0) 
%}
  <ul><li>No item yet.</li></ul>
{% else %}

  <ul>
  {% for type, obj in data %}
    {% set is_title_displayed = false %}

    {% for item in obj %}
      {% if (display_access.indexOf(item.access[0]) !== -1) 
      and not (not display_alias and item.alias[0]) %}

        {% if not is_title_displayed %}
          <li class="sassdoc__map-section"><a href="#{{ type }}">{{ (type + 's') | capitalize }}</a></li>
          {% set is_title_displayed = true %}
        {% endif %}
        
        <li>
          <a href="#{{ item.context.type }}-{{ item.context.name }}">{{ item.context.name }}</a> 
          {% if item.access[0] == "private" %}<span class="annotation">private</span>{% endif %}
          {% if item.alias != false %}<span class="annotation">alias</span>{% endif %}
        </li>
      {% endif %}
    {% endfor %}
    
  {% endfor %}
  </ul>

{% endif %}
</div>