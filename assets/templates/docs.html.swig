<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>SassDoc :: Documentation</title>
<link rel="stylesheet" href="css/styles.css" />
</head>
<body class="sassdoc">
  <h1 class="sassdoc__title">SassDoc :: {{ data.length }} items documented</h1>

  <aside class="sassdoc__map">
    <h2>File map ({{ data.length }})</h2>
    {% for item in data %}
      {% if loop.first %}<ul>{% endif %}
        {% if item.alias == false %}
          <li>{{ item.type }} <a href="#sassdoc__item--{{ item.type }}-{{ item.name }}">{{ item.name }}</a></li>
        {% endif %}
      {% if loop.last %}</ul>{% endif %}
    {% endfor %}
  </aside>

  <article class="sassdoc__container">
    {% for item in data %}
      <section class="sassdoc__item  {% if item.alias %}sassdoc__item--alias{% endif %}" id="sassdoc__item--{{ item.type }}-{{ item.name }}">
        
        <h2 class="sassdoc__item-name">
          {% if item.deprecated %}
            <span class="sassdoc__item-deprecated" title="{{ item.deprecated }}">Deprecated</span>
          {% endif %}
          <span class="sassdoc__item-type">{{ item.type }}</span>
          {{ item.name }}

          {% if item.aliased.length > 0 %}
            <span class="sassdoc__item-alias">aliased as 
            {% for _alias in item.aliased %}
              <a href="#sassdoc__item--{{ _alias }}"><code>{{ _alias }}</code></a>
            {% endfor %}
            </span>
          {% endif %}

          {% if item.alias %}
            <span class="sassdoc__item-alias">alias for <a href="#sassdoc__item--{{ item.type }}-{{ item.alias }}">{{ item.alias }}</a></span>
          {% endif %}
        </h2>

        {% if item.alias == false %}

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

          {% if item.returns.type %}
            <h3>Returns</h3>
            <p class="sassdoc__item-description">{% if item.returns.description %}{{ item.returns.description }}: {% endif %}<code>{{ item.returns.type | join('|') }}</code></p>
          {% endif %}

          {% if item.throws.length > 0 %}
            <h3>Throws</h3>
            {% for _throw in item.throws %}
              {% if loop.first %}<ul class="sassdoc__item-throws">{% endif %}
              <li>{{ _throw }}</li>
              {% if loop.last %}</ul>{% endif %}
            {% endfor %}
          {% endif %}

          {% if item.requires.length > 0 %}
            <h3>Requires</h3>
            {% for _require in item.requires %}
              {% if loop.first %}<ul class="sassdoc__item-requires">{% endif %}
              {% if item.type == "function" %}
                {% set require_type = "mixin" %}
              {% else %}
                {% set require_type = "function" %}
              {% endif %}
              <li><a href="#sassdoc__item--{{ require_type }}-{{ _require }}"><code>{{ _require }}</code></a></li>
              {% if loop.last %}</ul>{% endif %}
            {% endfor %}
          {% endif %}

          <h3>Signature</h3>
          <pre class="sassdoc__item-code"><code>@{{ item.type }} {{ item.name }} ({{ parameters_string }}) { ... }</code></pre>

          {% if item.todos.length > 0 %}
            <h3>TODO's</h3>
            {% for _todo in item.todos %}
              {% if loop.first %}<ul class="sassdoc__item-todos">{% endif %}
              <li>{{ _todo }}</li>
              {% if loop.last %}</ul>{% endif %}
            {% endfor %}
          {% endif %}

          {% if item.links.length > 0 %}
            <h3>Links</h3>
            {% for _link in item.links %}
              {% if loop.first %}<ul class="sassdoc__item-links">{% endif %}
              <li><a href="{{ _link.url }}">
                {% if _link.caption %}
                  {{ _link.caption }}
                {% else %}
                  {{ _link.url }}
                {% endif %}
              </a></li>
              {% if loop.last %}</ul>{% endif %}
            {% endfor %}
          {% endif %}

          {% if item.author %}
            <h3>Author</h3>
            <p>{{ item.author }}</p>
          {% endif %}

        {% endif %}

      </section>
    {% endfor %}
  </article>
</body>
</html>