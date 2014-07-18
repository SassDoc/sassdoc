<!doctype html>

{% set project_title = package.title ? package.title : (package.name | capitalize) %}
{% set project_title = project_title | default('SassDoc') %}

{# Count how many items will be displayed #}
{% set item_count = 0 %}

{# To avoid repeating the same condition over and over again, 
 # do it once and add a `display` key to items 
 #}
{% for group, object in data %}
  {% for item in object %}
    {% if (display.access.indexOf(item.access[0]) != -1) and not (not display.alias and item.alias[0]) %}
      {% set item_count = item_count + 1 %}
      {% set item['display'] = true %}
    {% else %}
      {% set item['display'] = false %}
    {% endif %}
  {% endfor %}
{% endfor %}

<html lang="en">
<head>
  {# Include head content #}
  {% include "../includes/partials/head.html.swig" with project_title %}
</head>
<body>

  {# Sidebar #}
  <aside class="sidebar" role="nav">
    {% block sidebar %}{% endblock %}
  </aside>

  {# Main container #}
  <article class="main" role="main">

    {# Include top navbar #}
    {% include "../includes/partials/header.html.swig" with project_title %}

    <div class="container">
    {% block content %}{% endblock %}
    </div>

    {# Include footer #}
    {% include "../includes/partials/footer.html.swig" with project_title %}
  </article>


  {# Include scripts #}
  {% include "../includes/partials/scripts.html.swig" %}
</body>
</html>