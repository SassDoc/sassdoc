{% extends 'layouts/base.html.swig' %}

{% block content %}
  {% if data.functions.length === 0 and data.mixins.length === 0 and data.variables.length === 0 %}
    <h1 class="sassdoc__section  no-counter">Seems like nothing has been documented yet!</h1>
  {% else %}

    {% for type, obj in data %}
      {% if obj.length > 0 %}
        <h1 class="sassdoc__section" id="{{ type }}">{{ type | capitalize }}</h1>
        {% for item in obj %}
          {% set partial = "includes/" + type + ".html.swig" %}
          {% if (display.alias == false and item.alias != false) or (display.private == false and item.access == "private") %}{% else %}
            {% include partial with item %}
          {% endif %}
        {% endfor %}
      {% endif %}
    {% endfor %}

  {% endif %}
{% endblock %}

{% block sidebar %}
  {% include "includes/sidebar.html.swig" with data %}
{% endblock %}