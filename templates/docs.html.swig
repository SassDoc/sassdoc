{% extends 'layouts/base.html.swig' %}

{% block content %}
  {% for type, obj in data %}
    <h1 class="sassdoc__section" id="{{ type }}">{{ type | capitalize }}</h1>
    {% for item in obj %}
      {% set partial = "includes/" + type + ".html.swig" %}
      {% include partial with item %}
    {% endfor %}
  {% endfor %}
{% endblock %}

{% block sidebar %}
  {% include "includes/sidebar.html.swig" with data %}
{% endblock %}