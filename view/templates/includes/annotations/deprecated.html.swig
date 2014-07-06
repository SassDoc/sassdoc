{% if item.deprecated %}
  <p class="sassdoc__deprecated"><strong>Deprecated!</strong> {% if item.deprecated[0] != "" %}{{ item.deprecated[0] }}{% endif %}</p>
{% endif %}