{% if item.description %}
  <h3 class="item__sub-heading">Description</h3>
  
  <p class="item__description">{{ item.description | markdown | nl2br }}</p>
{% endif %}