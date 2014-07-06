<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>{{ title }}</title>
  <link rel="stylesheet" href="assets/css/main.css" />
  <link rel='stylesheet' href='http://fonts.googleapis.com/css?family=Ubuntu:400,500,700'>
  <meta name="viewport" content="width=device-width">
  <meta content="IE=edge, chrome=1" http-equiv="X-UA-Compatible">
  
  <!-- Thanks for Sass-lang.com for the icons -->
  <link href="/assets/img/ico/apple-touch-icon-144x144-precomposed-e674ce95.png" rel="apple-touch-icon-precomposed" sizes="144x144">
  <link href="/assets/img/ico/apple-touch-icon-114x114-precomposed-19f81edf.png" rel="apple-touch-icon-precomposed" sizes="114x114">
  <link href="/assets/img/ico/apple-touch-icon-72x72-precomposed-363e5ff9.png" rel="apple-touch-icon-precomposed" sizes="72x72">
  <link href="/assets/img/ico/apple-touch-icon-57x57-precomposed-f3752e86.png" rel="apple-touch-icon-precomposed">
  <link href="/assets/img/ico/favicon-0ccd2d9d.png" rel="shortcut icon">
</head>
<body>
  <div class="sassdoc">

    {% set item_count = 0 %}

    {% for group, object in data %}
      {% for item in object %}
          {% if (display_access.indexOf(item.access[0]) !== -1) and not (not display_alias and item.alias[0]) %}
          {% set item_count = item_count + 1 %}
        {% endif %}
      {% endfor %}
    {% endfor %}

    {% include "../includes/header.html.swig" %}

    <div class="container">

      <aside class="sassdoc__map">
        {% block sidebar %}{% endblock %}
      </aside>

      <article class="sassdoc__container">
        {% block content %}{% endblock %}
      </article>

    </div>
  </div>

  <script src="assets/js/prism.min.js"></script>
</body>
</html>