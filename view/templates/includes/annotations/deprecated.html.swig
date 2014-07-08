{% if item.deprecated %}
  <p class="item__deprecated"><strong>Deprecated!</strong>{% if item.deprecated[0] != "" %} {{ item.deprecated[0] }}{% endif %}</p>
{% endif %}