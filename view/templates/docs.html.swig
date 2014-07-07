{% extends 'layouts/base.html.swig' %}

{% block content %}

  {# No item documented #}
  {% if item_count == 0 %}
    <h1 class="sassdoc__section  no-counter">Seems like nothing has been documented yet!</h1>

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
            <h1 class="sassdoc__section" id="{{ type }}">{{ (type + 's') | capitalize }}</h1>
            {% set group_title_displayed = true %}
          {% endif %}
        
          {# Display item #}
          {% set partial = "includes/items/" + type + ".html.swig" %}
          
          <section class="sassdoc__item{% if item.alias %}  sassdoc__item--alias{% endif %}" id="{{ item.context.type }}-{{ item.context.name }}">
            {% include partial with item %}
          </section>

        {% endif %}

      {% endfor %}

    {% endfor %}

  {% endif %}

{% endblock %}

{# Include sidebar #}
{% block sidebar %}
  {% include "includes/sidebar.html.swig" %}
{% endblock %}