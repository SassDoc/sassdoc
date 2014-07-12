<h3 class="item__sub-heading">Parameters</h3>

{% if item.parameters.length > 0 %}

  <table class="item__parameters">
    <caption class="sr-only">Parameters for the {{ item.name }} {{ item.type }}</caption>
    <thead>
      <tr>
        <th scope="col"><i class="sr-only">{{ item.type }} Parameter </i>Name</th>
        <th scope="col"><i class="sr-only">{{ item.type }} Parameter </i>Description</th>
        <th scope="col"><i class="sr-only">{{ item.type }} Parameter </i>Type</th>
        <th scope="col"><i class="sr-only">{{ item.type }} Parameter </i>Default value</th>
      </tr>
    </thead>
    <tbody>
      {% for parameter in item.parameters %}
        <tr class="item__parameter">
          <th scope="row" data-label="name"><code>${{ parameter.name }}</code></th>
          <td data-label="desc">{{ parameter.description | markdown | default('&mdash;<i class="sr-only"> none</i>') | safe }}</td>
          <td data-label="type">
          {% if parameter.type == '*' %}
            Any
          {% else %}
            {{ parameter.type | split('|') | trim | capitalize | join(', ')}}
          {% endif %}
          </td>
          <td data-label="default">
          {% if not parameter.default %}
            &mdash;<i class="sr-only"> none</i>
          {% else %}
            <code>{{ parameter.default }}</code>
          {% endif %}
          </td>
        </tr>
      {% endfor %}
    </tbody>
  </table>

{% else %}

  <p>None.</p>

{% endif %}