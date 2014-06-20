<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>SassDoc :: Index</title>
<link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <article class="sassdoc">
  <h1 class="sassdoc__title">Files</h1>
  {% for file in files %}
    {% if loop.first %}<ul>{% endif %}
    <li><a href="{{ file }}">{{ file }}</a></li>
    {% if loop.last %}</ul>{% endif %}
  {% endfor %}
  </article>
</body>
</html>