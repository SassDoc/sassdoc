<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>SassDoc :: {{ title }}</title>
<link rel="stylesheet" href="css/styles.css" />
</head>
<body>
<article class="{{ base_class }}">
  <h1 class="{{ base_class }}__title">SassDoc :: {{ title }}</h1>
  <div class="{{ base_class }}__container">
    {% for item in data.functions %}
      <section class="{{ base_class }}__item">
        <h2 class="{{ base_class }}__item-name">{{ item.name }}</h2>
        <p class="{{ base_class }}__item-description">{{ item.description }}</p>
        {% if item.parameters.length > 0 %}
          <h3>Parameters</h3>
          <table class="{{ base_class }}__item-parameters">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Type</th>
                <th>Default value</th>
              </tr>
            </thead>
            <tbody>
              {% for parameter in item.parameters %}
                <tr class="{{ base_class }}__item-parameter">
                  <td>{{ parameter.name }}</td>
                  <td>{{ parameter.description }}</td>
                  <td><code>{{ parameter.type }}</code></td>
                  {% if parameter.default %}
                    <td>{{ parameter.default }}</td>
                  {% else %}
                    <td>&mdash;</td>
                  {% endif %}
                </tr>
              {% endfor %}
            </tbody>
          </table>
        {% endif %}
      </section>
    {% endfor %}
  </div>
</article>
</body>
</html>