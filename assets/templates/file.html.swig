<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>SassDoc :: {{ title }}</title>
<link rel="stylesheet" href="css/styles.css" />
</head>
<body class="sassdoc">
  <h1 class="sassdoc__title">SassDoc :: {{ title }}</h1>

  <aside class="sassdoc__map">
    <h2>File map</h2>
    {% for item in data %}
      {% if loop.first %}<ul>{% endif %}
      <li><a href="#sassdoc__item--{{ item.name }}">{{ item.name }}</a></li>
      {% if loop.last %}</ul>{% endif %}
    {% endfor %}
  </aside>

  <article class="sassdoc__container">
    {% for item in data %}
      <section class="sassdoc__item" id="sassdoc__item--{{ item.name }}">
        <h2 class="sassdoc__item-name">
          {% if item.deprecated %}
            <span class="sassdoc__item-deprecated" title="{{ item.deprecated }}">Deprecated</span>
          {% endif %}
          <span class="sassdoc__item-type">{{ item.type }}</span>
          {{ item.name }}
          {% if item.alias.length %}
            <span class="sassdoc__item-alias">aliased as <code>{{ item.alias | join(', ') }}</code></span>
          {% endif %}
        </h2>

        {% if item.description %}
          <h3>Description</h3>
          <p class="sassdoc__item-description">{{ item.description | replace('\n', '<br />') | raw }}</p>
        {% endif %}

        {% if item.access != "public" %}
          <h3>Access</h3>
          <p class="sassdoc__item-access">{{ item.access }}</p>
        {% endif %}

        <h3>Parameters</h3>
        {% if item.parameters.length > 0 %}
        <table class="sassdoc__item-parameters">
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
              <tr class="sassdoc__item-parameter">
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

        {% if item.throws.length > 0 %}
          <h3>Throws</h3>
          {% for _throw in item.throws %}
            {% if loop.first %}<ul>{% endif %}
            <li>{{ _throw }}</li>
            {% if loop.last %}</ul>{% endif %}
          {% endfor %}
        {% endif %}

        {% if item.todos.length > 0 %}
          <h3>TODO's</h3>
          {% for todo in item.todos %}
            {% if loop.first %}<ul>{% endif %}
            <li>{{ todo }}</li>
            {% if loop.last %}</ul>{% endif %}
          {% endfor %}
        {% endif %}

        <h3>Signature</h3>
        <pre class="sassdoc__item-code"><code>@{{ item.type }} {{ item.name }} ({{ parameters_string }}) { ... }</code></pre>

        {% if item.author %}
          <h3>Author</h3>
          <p>{{ item.author }}</p>
        {% endif %}

      </section>
    {% endfor %}
  </article>
</body>
</html>