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
    {% for item in data %}
      <section class="{{ base_class }}__item">
        <h2 class="{{ base_class }}__item-name"><span class="{{ base_class }}__item-type">{{ item.type }}</span> {{ item.name }}</h2>
        <p class="{{ base_class }}__item-description">{{ item.description | replace('\n', '<br />') | raw }}</p>
          <h3>Parameters</h3>
          {% if item.parameters.length > 0 %}
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
              {% set parameters_string = '' %}
              {% for parameter in item.parameters %}
                {% set value = '$' + parameter.name %}

                {% if parameter.default %}
                  {% set value = value + ': ' + parameter.default %}
                {% endif %}

                {% if loop.first %}
                  {% set parameters_string = value %}
                {% else %}
                  {% set parameters_string = parameters_string + ', ' + value %}
                {% endif %}
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
          {% else %}
            <p>None.</p>
          {% endif %}
          <h3>Returns</h3>
          <p><code>{{ item.return }}</code></p>
          <h3>Signature</h3>
          <pre class="{{ base_class }}__item-code"><code>@{{ item.type }} {{ item.name }} ({{ parameters_string }}) { ... }</code></pre>
      </section>
    {% endfor %}
  </div>
</article>
</body>
</html>