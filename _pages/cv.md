---
layout: page
permalink: /experience/
title: Experience
nav: true
nav_order: 3
description: Awards, work, and education.
---

{% comment %}
  Rendered here, not by a CV plugin: the al_folio_cv plugin's fixed date-badge rows were not the look this site wants, so it was removed. Each section of _data/cv.yml becomes a card; an entry with `year` is an award (title left, year right), an entry with `line` is a plain bullet. See the header of _data/cv.yml.
{% endcomment %}

<style>
  /* Local to this page: the compact CV style of the v0 site. Colours come from the theme's variables, so dark mode follows the site. */
  .xp-card {
    background-color: var(--global-card-bg-color);
    border: 1px solid var(--global-divider-color);
    border-radius: 0.35rem;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08), 0 2px 10px 0 rgba(0, 0, 0, 0.06);
    padding: 1rem 1.25rem;
    margin-top: 1rem;
  }
  .xp-card h2 {
    font-size: 1.6rem;
    font-weight: 300;
    color: var(--global-text-color);
    margin: 0 0 0.6rem;
  }
  .xp-list {
    list-style: disc outside;
    padding-left: 1.25rem;
    margin: 0;
    font-weight: 300;
    color: var(--global-text-color);
  }
  .xp-list li + li {
    margin-top: 0.35rem;
  }
  .xp-list strong {
    font-weight: 700;
  }
  .xp-award {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.25rem 1rem;
  }
  .xp-year {
    flex: 0 0 auto;
    /* --local-year-color (_sass/_local.scss): 5.7:1 on white; the theme's --global-text-color-light is only 3.8:1. */
    color: var(--local-year-color);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
</style>

{% for section in site.data.cv.cv.sections %}
<section class="xp-card" id="{{ section[0] | slugify }}">
  <h2>{{ section[0] }}</h2>
  <ul class="xp-list">
    {% for entry in section[1] %}
      {% if entry.year %}
        <li><div class="xp-award"><span>{{ entry.title | markdownify | remove: '<p>' | remove: '</p>' | strip }}</span><span class="xp-year">{{ entry.year }}</span></div></li>
      {% else %}
        <li>{{ entry.line | markdownify | remove: '<p>' | remove: '</p>' | strip }}</li>
      {% endif %}
    {% endfor %}
  </ul>
</section>
{% endfor %}
