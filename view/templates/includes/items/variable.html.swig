{% include '../annotations/name.html.swig' %}

{% include '../annotations/deprecated.html.swig' %}

<pre class="sassdoc__item-code  language-scss"><code>${{ item.context.name }}: {{ item.context.value | safe }}{% if item.context.scope !== "private" %} !{{ item.context.scope }}{% endif %};</code></pre>

{% if not item.alias %}  

  {% include '../annotations/description.html.swig' %}

  {% include '../annotations/type.html.swig' %}

  {% include '../annotations/requires.html.swig' %}

  {% include '../annotations/usedby.html.swig' %}

  {% include '../annotations/todo.html.swig' %}

  {% include '../annotations/link.html.swig' %}

  {% include '../annotations/author.html.swig' %}

  {% include '../annotations/location.html.swig' %}

{% else %}

  <p>Refer to <a href="#{{ item.context.type }}-{{ item.alias[0] }}">{{ item.alias[0] }}</a>.</p>

{% endif %}
