---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

{% if author.googlescholar %}
  You can also find my articles on <u><a href="{{author.googlescholar}}">my Google Scholar profile</a>.</u>
{% endif %}


[XNLI 2.0: Improving XNLI dataset and performance on Cross Lingual Understanding (XLU)](https://arxiv.org/abs/2301.06527)
------
***Ankit Kumar Upadhyay***, *Harsit Kumar Upadhya*

*A. Kumar Upadhyay and H. Kumar Upadhya, "XNLI 2.0: [Improving XNLI dataset and performance on Cross Lingual Understanding (XLU)](https://ieeexplore.ieee.org/document/10126332)," 2023 IEEE 8th International Conference for Convergence in Technology (I2CT), Lonavla, India, 2023, pp. 1-6, doi: 10.1109/I2CT57861.2023.10126332.*


<div style='text-align: justify;'>
![performance on all languages >](/xnli_image.png)
Natural Language Processing systems are heavily dependent on the availability of annotated data to train practical models. Primarily, models are trained on English datasets. In recent times, significant advances have been made in multilingual understanding due to the steeply increasing necessity of working in different languages. One of the points that stands out is that since there are now so many pre-trained multilingual models, we can utilize them for cross-lingual understanding tasks. Using cross-lingual understanding and Natural Language Inference, it is possible to train models whose applications extend beyond the training language. We can leverage the power of machine translation to skip the tiresome part of translating datasets from one language to another. In this work, we focus on improving the original XNLI dataset by re-translating the MNLI dataset in all of the 14 different languages present in XNLI, including the test and dev sets of XNLI using Google Translate. We also perform experiments by training models in all 15 languages and analyzing their performance on the task of natural language inference. We then expand our boundary to investigate if we could improve performance in low-resource languages such as Swahili and Urdu by training models in languages other than English.
</div>
