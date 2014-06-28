<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>SassDoc :: Documentation</title>
  <link rel="stylesheet" href="assets/css/styles.css" />
  <link rel='stylesheet' href='http://fonts.googleapis.com/css?family=Ubuntu'>
  <meta name="viewport" content="width=device-width">
</head>
<body>
  <div class="sassdoc">

    <header class="sassdoc__header">
      <div class="container">
        <h1 class="sassdoc__title">SassDoc</h1>
        <p class="sassdoc__count">{{ data.functions.length + data.mixins.length + data.variables.length }} items documented</p>
      </div>
    </header>

    <div class="container">

      <aside class="sassdoc__map">
        {% block sidebar %}{% endblock %}
      </aside>

      <article class="sassdoc__container">
        {% block content %}{% endblock %}
      </article>

    </div>
  </div>
</body>
</html>