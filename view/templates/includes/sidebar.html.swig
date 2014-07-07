<h2 class="sassdoc__map-heading">Documentation map</h2>

<div class="sassdoc__map-container">
  <ul>
  {# No item documented #}
  {% if item_count == 0 %}
    <li>No item yet.</li>

  {# Some items documented #}
  {% else %}

    {# Loop over data #}
    {% for type, obj in data %}

      {# Store whether or not title has been displayed yet #}
      {% set group_title_displayed = false %}

      {# Loop over items in current group #}
      {% for item in obj %}

        {# If item should be displayed #}
        {% if item['display'] == true  %}

          {# If title has not been displayed yet, display it #}
          {% if not group_title_displayed %}
            <li class="sassdoc__map-section"><a href="#{{ type }}">{{ (type + 's') | capitalize }}</a></li>
            {% set group_title_displayed = true %}
          {% endif %}
          
          {# Display item #}
          <li>
            <a href="#{{ item.context.type }}-{{ item.context.name }}">{{ item.context.name }}</a> 
            {% if item.access[0] == "private" %}<span class="annotation">private</span>{% endif %}
            {% if item.alias != false %}<span class="annotation">alias</span>{% endif %}
          </li>

        {% endif %}

      {% endfor %}
      
    {% endfor %}

  {% endif %}
  </ul>
</div>

{% if package.description %}
<h2 class="sassdoc__map-heading">{{ package.name | capitalize }}</h2>

{{ package.description | markdown }}
{% endif %}