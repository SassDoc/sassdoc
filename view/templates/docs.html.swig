{% extends 'layouts/base.html.swig' %}

{% block content %}
  {% if 
    (not data.function or data.function.length === 0) and 
    (not data.mixin or data.mixin.length === 0) and
    (not data.variable or data.variable.length === 0) 
  %}
    <h1 class="sassdoc__section  no-counter">Seems like nothing has been documented yet!</h1>
  {% else %}

    {% for type, obj in data %}
      {% if obj.length > 0 %}
        <h1 class="sassdoc__section" id="{{ type }}">{{ (type + 's') | capitalize }}</h1>
        {% for item in obj %}
          {% set partial = "includes/" + type + ".html.swig" %}
          {% if (display_access.indexOf(item.access[0]) !== -1) and not (not display_alias and item.alias[0]) %}
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