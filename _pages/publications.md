---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

{% if author.googlescholar %}
  You can also find my articles on <u><a href="{{author.googlescholar}}">my Google Scholar profile</a>.</u>
{% endif %}

{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}

+ [XNLI 2.0: Improving XNLI dataset and performance on Cross Lingual Understanding (XLU)](https://arxiv.org/abs/2301.06527)
======