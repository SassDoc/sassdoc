{% extends '../layouts/base.html.swig' %}

{% block content %}

  {# No item documented #}
  {% if item_count == 0 %}
    <section class="main__section">
      <h1 class="main__heading">Seems like nothing has been documented yet!</h1>
    </section>

  {# Some items documented #}
  {% else %}

    {# Loop over data #}
    {% for type, obj in data %}

      {# Group items from object by display type and only keep `true` #}
      {% set object = (obj | groupby('display'))['true'] %}

      {# If there is at least one item to display, go #}
      {% if object.length > 0 %}
        <section class="main__section">
          <h1 class="main__heading" id="{{ type }}">{{ (type + 's') | capitalize }}</h1>

          {# Loop over items in current group #}
          {% for item in object %}

            {# Display item #}
            {% set partial = "../includes/items/" + type + ".html.swig" %}
            
            <section class="main__item  item{% if item.alias %}  item--alias{% endif %}{% if item.deprecated %}  item--deprecated{% endif %}" id="{{ item.context.type }}-{{ item.context.name }}">
              {% include partial with { item: item, display: display } %}
            </section>

          {% endfor %}
        </section>

      {% endif %}

    {% endfor %}

  {% endif %}

{% endblock %}

{# Include sidebar #}
{% block sidebar %}
  {% include "../includes/partials/sidebar.html.swig" %}
{% endblock %}