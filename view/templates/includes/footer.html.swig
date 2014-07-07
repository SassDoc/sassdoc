{% if package.name or display.watermark %}
  <footer class="sassdoc__footer" role="contentinfo">
    <div class="container">
      {% if package.name %}
        <div class="sassdoc__footer-project  project-info">
          <!-- Name and URL -->
          {% if package.homepage %}
            <a class="project-info__name" href="{{ package.homepage }}">{{ package.name | capitalize }}</a>
          {% else %}
            <span class="project-info__name">{{ package.name | capitalize }}</span>
          {% endif %}

          <!-- Version -->
          {% if package.version %}<span class="project-info__version"> - v{{ package.version }}</span>{% endif %}

          <!-- License -->
          {% if package.license %}<span class="project-info__license">, under {{ package.license }}</span>{% endif %}
        </div>
      {% endif %}

      {% if display.watermark %}
        <span class="sassdoc__footer-watermark">Built with <a href="https://github.com/HugoGiraudel/SassDoc">SassDoc</a>.</span>
      {% endif %}
    </div>
  </footer>
{% endif %}