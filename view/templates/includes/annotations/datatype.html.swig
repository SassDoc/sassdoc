{% if item.datatype %}
  <h3>Type</h3>

  <p>
  {% if item.datatype[0] == "*" %}
    Any
  {% else %}
    <code>{{ item.datatype[0] | split('|') | trim | capitalize | join('</code>, <code>') | safe }}</code>
  {% endif %}
  </p>
{% endif %}