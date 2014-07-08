<h2 class="sidebar__heading">Documentation map</h2>

<div class="sidebar__body">
  <ul class="list-unstyled">
  {# No item documented #}
  {% if item_count == 0 %}
    <li>No documented item.</li>

  {# Some items documented #}
  {% else %}

    {# Loop over data #}
    {% for type, obj in data %}

      {# Group items from object by display type and only keep `true` #}
      {% set obj = (obj | groupby('display'))['true'] %}

      {# If there is at least one item to display, go #}
      {% if obj.length > 0 %}

        <li class="sidebar__sub-heading"><a href="#{{ type }}">{{ (type + 's') | capitalize }}</a></li>
          
        {# Loop over items in current group #}
        {% for item in obj %}

          {# Display item #}
          <li>
            <a href="#{{ item.context.type }}-{{ item.context.name }}">{{ item.context.name }}</a> 
            {% if item.access[0] == "private" %}<span class="sidebar__annotation  sidebar__annotation--private">private</span>{% endif %}
            {% if item.alias != false %}<span class="sidebar__annotation  sidebar__annotation--alias">alias</span>{% endif %}
          </li>

        {% endfor %}

      {% endif %}
      
    {% endfor %}

  {% endif %}
  </ul>
</div>

{% if package.description %}
  <h2 class="sidebar__heading">{{ project_title }}</h2>

  <div class="sidebar__description">
    {{ package.description | markdown }}
  </div>
{% endif %}