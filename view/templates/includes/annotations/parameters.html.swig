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
          <td data-label="name"><code>${{ parameter.name }}</code></td>
          <td data-label="desc">{{ parameter.description | markdown | default('&mdash;') | safe }}</td>
          <td data-label="type">
          {% if parameter.type == '*' %}
            Any
          {% else %}
            <code>{{ parameter.type | split('|') | trim | capitalize | join('</code>, <code>') | raw }}</code>
          {% endif %}
          </td>
          <td data-label="default">{{ parameter.default | default('&mdash;') | safe }}</td>
        </tr>
      {% endfor %}
    </tbody>
  </table>

{% else %}

  <p>None.</p>

{% endif %}