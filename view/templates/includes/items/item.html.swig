{% include '../annotations/name.html.swig' %}

{% include '../annotations/deprecated.html.swig' %}

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
<pre class="item__code"><code class="language-scss">@{{ item.context.type }} {{ item.context.name }}({{ parameters_string }}) { ... }</code></pre>

{% if not item.alias %}

  {% include '../annotations/deprecated.html.swig' %}
  
  {% include '../annotations/description.html.swig' %}

  {% include '../annotations/parameters.html.swig' %}

  {% include '../annotations/returns.html.swig' %}

  {% include '../annotations/example.html.swig' %}

  {% include '../annotations/throws.html.swig' %}

  {% include '../annotations/requires.html.swig' %}

  {% include '../annotations/usedby.html.swig' %}

  {% include '../annotations/see.html.swig' %}

  {% include '../annotations/todo.html.swig' %}

  {% include '../annotations/link.html.swig' %}

  {% include '../annotations/author.html.swig' %}

  {% include '../annotations/location.html.swig' %}

{% else %}

  <p>Refer to <a href="#{{ item.context.type }}-{{ item.alias[0] }}">{{ item.alias[0] }}</a>.</p>

{% endif %}
