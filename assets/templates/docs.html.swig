{% extends 'base.html.swig' %}

{% block content %}
  {% for type, obj in data %}
    <h1 class="sassdoc__section" id="{{ type }}">{{ type | capitalize }}</h1>
    {% for item in obj %}
      {% set partial = type + ".html.swig" %}
      {% include partial with item %}
    {% endfor %}
  {% endfor %}
{% endblock %}

{% block sidebar %}
<h2 class="sassdoc__map-heading">File map</h2>
  <div class="sassdoc__map-container">
  <ul>
  {% for type, obj in data %}
    <li class="sassdoc__map-section"><a href="#{{ type }}">{{ type | capitalize }}</a></li>
    {% for item in obj %}
      {% if item.alias == false %}
        <li><a href="#{{ item.type }}-{{ item.name }}">{{ item.name }}</a></li>
      {% endif %}
    {% endfor %}
  {% endfor %}
  </ul>
  </div>
{% endblock %}