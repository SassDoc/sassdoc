{% if item.datatype %}
  <h3>Type</h3>
  <p>{% if item.datatype[0] == "*" %}Any{% else %}<code>{{ item.datatype[0] }}</code>{% endif %}</p>
{% endif %}