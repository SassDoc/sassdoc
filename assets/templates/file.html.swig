<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>SassDoc :: {{ title }}</title>
<link rel="stylesheet" href="{{ asset_path }}" />
</head>
<body class="{{ base_class }}">
  <h1 class="{{ base_class }}__title">SassDoc :: {{ title }}</h1>
  <aside class="{{ base_class }}__map">
    <h2>File map</h2>
    {% for item in data %}
      {% if loop.first %}<ul>{% endif %}
      <li><a href="#{{ base_class }}__item--{{ item.name }}">{{ item.name }}</a></li>
      {% if loop.last %}</ul>{% endif %}
    {% endfor %}
  </aside>
  <article class="{{ base_class }}__container">
    {% for item in data %}
      <section class="{{ base_class }}__item" id="{{ base_class }}__item--{{ item.name }}">
        <h2 class="{{ base_class }}__item-name">
          {% if item.deprecated %}
            <span class="{{ base_class }}__item-deprecated" title="{{ item.deprecated }}">Deprecated</span>
          {% endif %}
          <span class="{{ base_class }}__item-type">{{ item.type }}</span>
          {{ item.name }}
        </h2>
        <h3>Description</h3>
        <p class="{{ base_class }}__item-description">{{ item.description | replace('\n', '<br />') | raw }}</p>
          <h3>Scope</h3>
          <p class="{{ base_class }}__item-scope">{{ item.scope }}</p>

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

                {% if parameter.type | lower === "arglist" %}
                  {% set value = value + '...' %}
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

          {% if item.return %}
            <h3>Returns</h3>
            {% if item.return.description %}
            <p>{{ item.return.description }}</p>
            {% endif %}
            <p><code>{{ item.return.type | join('|') }}</code></p>
          {% endif %}

          <h3>Signature</h3>
          <pre class="{{ base_class }}__item-code"><code>@{{ item.type }} {{ item.name }} ({{ parameters_string }}) { ... }</code></pre>
      </section>
    {% endfor %}
  </article>
</body>
</html>