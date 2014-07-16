<h3 class="item__sub-heading">Parameters</h3>

{% if item.parameters.length > 0 %}

  <table class="item__parameters">
    <thead>
      <tr>
        <th scope="col"><span class="visually-hidden">{{ item.type }} parameter </span>Name</th>
        <th scope="col"><span class="visually-hidden">{{ item.type }} parameter </span>Description</th>
        <th scope="col"><span class="visually-hidden">{{ item.type }} parameter </span>Type</th>
        <th scope="col"><span class="visually-hidden">{{ item.type }} parameter </span>Default value</th>
      </tr>
    </thead>
    <tbody>
      {% for parameter in item.parameters %}
        <tr class="item__parameter">
          <th scope="row" data-label="name"><code>${{ parameter.name }}</code></th>
          <td data-label="desc">{{ parameter.description | markdown | default('&mdash;<span class="visually-hidden"> none</span>') | safe }}</td>
          <td data-label="type">
          {% if parameter.type == '*' %}
            Any
          {% else %}
            {{ parameter.type | split('|') | trim | capitalize | join(', ')}}
          {% endif %}
          </td>
          <td data-label="default">
          {% if not parameter.default %}
            &mdash;<span class="visually-hidden"> none</span>
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