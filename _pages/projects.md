---
layout: page
title: Research
permalink: /projects/
description: A growing collection of your cool projects.
nav: true
nav_order: 3
display_categories: [work, fun]
horizontal: false
---

<div class="row">
  <div class="col-md-6 mb-3 mb-md-0">
    <div class="alert alert-info h-100 mb-0">
      <p class="text-center font-weight-bold mb-3">Research Overview</p>
      <div markdown="1">
My research interests are in **generative AI**, **diffusion models**, **trustworthy decision-making**, and **cyber-physical systems**.

For publications, see the [Publications](/publications/) page.
      </div>
    </div>
  </div>
  <div class="col-md-6">
    <div class="alert alert-info h-100 mb-0">
      <p class="text-center font-weight-bold mb-3">Invited Talk &amp; Presentation</p>
      <div markdown="1">
- **[2026/04]** Presentation at *CS Expo 2026*, Florida State University: *Event-Level Explainable Extreme-Enhanced Time Series Generation*.
- **[2025/08]** Oral presentation at *IJCAI 2025*, covering *Human-Centered Ride-Hailing* and *Equitable Post-Disaster Power Restoration*.
- **[2025/04]** Presentation at *CS Expo 2025*, Florida State University: *An Uncertainty-Aware Predict-Then-Optimize Framework for Equitable Post-Disaster Power Restoration*.
- **[2023/08]** Oral presentation at *KDD 2023*: *A Fairness-Aware Concurrent Dispatch System for Large-Scale Instant Delivery Services*.
      </div>
    </div>
  </div>
</div>

<!-- pages/projects.md -->
<div class="projects">
{% if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {% for category in page.display_categories %}
  <a id="{{ category }}" href=".#{{ category }}">
    <h2 class="category">{{ category }}</h2>
  </a>
  {% assign categorized_projects = site.projects | where: "category", category %}
  {% assign sorted_projects = categorized_projects | sort: "importance" %}
  <!-- Generate cards for each project -->
  {% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
  {% endfor %}

{% else %}

<!-- Display projects without categories -->

{% assign sorted_projects = site.projects | sort: "importance" %}

  <!-- Generate cards for each project -->

{% if page.horizontal %}

  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
{% endif %}
</div>
