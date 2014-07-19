<div class="sidebar__header">
  <h1 class="sidebar__title">
    {% if package.homepage %}
      <a href="{{ package.homepage }}">{{ project_title }}{% if package.version %} - v{{ package.version }}{% endif %}</a>
    {% else %}
      {{ project_title }}{% if version %} - {{ version }}{% endif %}
    {% endif %}
  </h1>
</div>

<div class="sidebar__body">
  <ul class="list-unstyled">
  {# No item documented #}
  {% if item_count == 0 %}
    <li class="sidebar__link">No documented item.</li>

  {# Some items documented #}
  {% else %}

    {# Loop over data #}
    {% for type, obj in data %}

      {# Group items from object by display type and only keep `true` #}
      {% set object = (obj | groupby('display'))['true'] %}

      {# If there is at least one item to display, go #}
      {% if object.length > 0 %}

        <li class="sidebar__sub-heading"><a class="sidebar__link" href="#{{ type }}">{{ (type + 's') | capitalize }}</a></li>

        {# Loop over items in current group #}
        {% for item in object %}

          {# Display item #}
          <li class="sidebar__item" data-name="{{item.context.name}}" data-type="{{item.context.type}}">
            <a class="sidebar__link" href="#{{ item.context.type }}-{{ item.context.name }}">{{ item.context.name }}
            {% if item.access[0] == "private" %}<span class="sidebar__annotation  sidebar__annotation--private">private</span>{% endif %}
            {% if item.alias != false %}<span class="sidebar__annotation  sidebar__annotation--alias">alias</span>{% endif %}
            </a>
          </li>

        {% endfor %}

      {% endif %}

    {% endfor %}

  {% endif %}
  </ul>
</div>
