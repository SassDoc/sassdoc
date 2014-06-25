<section class="sassdoc__item  {% if item.alias %}sassdoc__item--alias{% endif %}" id="{{ item.type }}-{{ item.name }}">
  <h2 class="sassdoc__item-name">
    {% if item.deprecated %}
      <span class="sassdoc__item-deprecated" title="{{ item.deprecated }}">[Deprecated]</span>
    {% endif %}
    <span class="sassdoc__item-type">[{{ item.type }}]</span>
    <code>{{ item.name }}</code>

    {% if item.aliased.length > 0 %}
      <span class="sassdoc__item-alias">(aliased as 
      {% for _alias in item.aliased %}
        <a href="#{{ item.type }}-{{ _alias }}"><code>{{ _alias }}</code></a>
      {% endfor %}
      )</span>
    {% endif %}

    {% if item.alias %}
      <span class="sassdoc__item-alias">alias for <a href="#{{ item.type }}-{{ item.alias }}"><code>{{ item.alias }}</code></a></span>
    {% endif %}
  </h2>

  {% if item.alias == false %}

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
    {% endfor %}
    <pre class="sassdoc__item-code">@{{ item.type }} {{ item.name }} ({{ parameters_string }}) { ... }  </pre>

    {% if item.description %}
      <h3>Description</h3>
      <p class="sassdoc__item-description">{{ item.description | replace('\n', '<br />') | markdown }}</p>
    {% endif %}

    {% if item.access != "public" %}
      <h3>Access</h3>
      <p class="sassdoc__item-access">{{ item.access }}</p>
    {% endif %}

    {% if item.since %}
      <h3>Since</h3>
      <p>{{ item.since }}</p>
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
        {% for parameter in item.parameters %}
          <tr class="sassdoc__item-parameter">
            <td><code>${{ parameter.name }}</code></td>
            <td>{% if parameter.description %}{{ parameter.description }}{% else %}&mdash;{% endif %}</td>
            <td>{% if parameter.type == "*" %}Any{% else %}<code>{{ parameter.type }}</code>{% endif %}</td>
            <td>{% if parameter.default %}{{ parameter.default }}{% else %}&mdash;{% endif %}</td>
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
        <li>{{ _throw | markdown }}</li>
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
        <li><a href="#{{ require_type }}-{{ _require }}"><code>{{ _require }}</code></a></li>
        {% if loop.last %}</ul>{% endif %}
      {% endfor %}
    {% endif %}

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