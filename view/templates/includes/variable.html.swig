<section class="sassdoc__item  {% if item.alias %}sassdoc__item--alias{% endif %}" id="{{ item.context.type }}-{{ item.context.name }}">

  {% include 'annotations/name.html.swig' %}
  <pre class="sassdoc__item-code  language-scss"><code>${{ item.context.name }}: {{ item.context.value | safe }}{% if item.context.scope !== "private" %} !{{ item.context.scope }}{% endif %};</code></pre>

  {% if item.alias == false %}

    {% include 'annotations/description.html.swig' %}

    {% include 'annotations/datatype.html.swig' %}

    {% include 'annotations/requires.html.swig' %}

    {% include 'annotations/usedby.html.swig' %}

    {% include 'annotations/todo.html.swig' %}

    {% include 'annotations/link.html.swig' %}

    {% include 'annotations/author.html.swig' %}

    {% include 'annotations/location.html.swig' %}

  {% else %}

    <p>Refer to <a href="#{{ item.context.type }}-{{ item.alias[0] }}">{{ item.alias[0] }}</a>.</p>

  {% endif %}
</section>
