{% extends 'base.html.swig' %}

{% block content %}
  <h1 class="sassdoc__section">Variables</h1>
  {% for item in data.variables %}
    {% include 'var.html.swig' with item %}
  {% endfor %}
  <h1 class="sassdoc__section">Functions</h1>
  {% for item in data.functions %}
    {% include 'item.html.swig' with item %}
  {% endfor %}
  <h1 class="sassdoc__section">Mixins</h1>
  {% for item in data.mixins %}
    {% include 'item.html.swig' with item %}
  {% endfor %}
{% endblock %}

{% block sidebar %}
<h2 class="sassdoc__map-heading">File map</h2>
  <div class="sassdoc__map-container">
  <ul>
  {% for item in data.variables %}
    <li>{{ item.type | capitalize }} <a href="#{{ item.type }}-{{ item.name }}">{{ item.name }}</a></li>
  {% endfor %}
  {% for item in data.functions %}
    {% if item.alias == false %}
      <li>{{ item.type | capitalize }} <a href="#{{ item.type }}-{{ item.name }}">{{ item.name }}</a></li>
    {% endif %}
  {% endfor %}
  {% for item in data.mixins %}
    {% if item.alias == false %}
      <li>{{ item.type | capitalize }} <a href="#{{ item.type }}-{{ item.name }}">{{ item.name }}</a></li>
    {% endif %}
  {% endfor %}
  </ul>
  </div>
{% endblock %}