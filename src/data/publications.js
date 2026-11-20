export const publicationFilters = [
  { id: "all", label: "All" },
  { id: "Wildlife Vision", label: "Wildlife Vision" },
  { id: "NLP & Knowledge", label: "NLP & Knowledge" },
  { id: "preprints", label: "Under Review" },
];

export const publications = [
  {
    id: "cfr-2027",
    title: "CounterFactual Retrieval for Evidence-Aware Individual Animal Identification",
    authors: [
      "Ankit Kumar Upadhyay",
      "Aleksandr Algasov",
      "Ekaterina Nepovinnykh",
      "Fedor Zolotarev",
      "Tuomas Eerola",
      "Heikki Kälviäinen",
      "Charles V. Stewart",
      "Lukáš Picek",
    ],
    venue: "IEEE/CVF WACV",
    year: "2027",
    badge: "Accepted",
    area: "Wildlife Vision",
    status: "published",
    takeaway:
      "Introduces Counterfactual Foreground Retrieval (CFR) and ~500K masks across 34 wildlife datasets to separate biometric animal matching from background shortcuts.",
    abstract:
      "Standard individual animal re-identification benchmarks evaluate models solely by retrieval accuracy, which can mask reliance on environmental shortcuts such as vegetation, terrain, or camera-trap backgrounds. We introduce Counterfactual Foreground Retrieval (CFR) and the Shortcut Sensitivity Index (SSI), an evidence-aware evaluation protocol contrasting full-image, foreground-only, and shortcut-only views across 34 animal re-identification datasets (~0.5M segmentation masks) to characterize whether models truly rely on individual biometric evidence.",
    links: [
      { label: "arXiv", href: "https://arxiv.org/abs/2611.06864" },
      { label: "Code", href: "https://github.com/Imageomics/cfr" },
      { label: "Dataset", href: "https://huggingface.co/datasets/imageomics/cfr-wildlife-masks" },
    ],
  },
  {
    id: "cv4e-2026",
    title: "Data-Efficient Attribute Classification for Wildlife Re-Identification with Vision Foundation Models",
    authors: [
      "Ankit Kumar Upadhyay",
      "Fedor Zolotarev",
      "Ekaterina Nepovinnykh",
      "David Kimiti",
      "Martha Fischer",
      "Daniel Rubenstein",
      "Charles V. Stewart",
    ],
    venue: "CV4Ecology @ ECCV",
    year: "2026",
    badge: "Oral",
    area: "Wildlife Vision",
    status: "published",
    takeaway:
      "Demonstrates that frozen vision foundation models (SAM 3 + DINOv3) match fine-tuned CNNs for viewpoint and census-annotation classification with far fewer labels.",
    abstract:
      "Photographic wildlife re-identification depends on upstream viewpoint and census-annotation classifiers to ensure individuals are compared from compatible sides with clearly visible markings. We show that combining concept segmentation with frozen DINOv3 representations and lightweight classifiers reaches parity with fine-tuned CNNs while drastically reducing species-specific annotation requirements and improving out-of-region transfer.",
    links: [
      { label: "OpenReview", href: "https://openreview.net/forum?id=DXtNhEX8U7" },
    ],
  },
  {
    id: "fawn-2026",
    title: "FAWN: Foundation Model based Attribute Classification for Wildlife Re-Identification via Data-Efficient Classical Machine Learning",
    authors: [
      "Ankit Kumar Upadhyay",
      "Fedor Zolotarev",
      "Ekaterina Nepovinnykh",
      "David Kimiti",
      "Martha Fischer",
      "Daniel Rubenstein",
      "Charles V. Stewart",
    ],
    venue: "CV4Animals @ CVPR",
    year: "2026",
    badge: "Poster",
    area: "Wildlife Vision",
    status: "published",
    takeaway:
      "Pairs text-prompted segmentation and frozen foundation embeddings with CPU-trainable shallow classifiers that transfer zero-shot across unseen counties.",
    abstract:
      "FAWN replaces dedicated end-to-end CNN training for wildlife re-ID attribute classification with SAM 3 text-prompted concept segmentation, frozen DINOv3 CLS embeddings on masked detections, and lightweight shallow classifiers that train in seconds on CPU hardware. Evaluated across Grevy's zebra, plains zebra, and Masai giraffe, FAWN converges within 0.03 of full-data macro F1 using as few as 5% of census-annotation labels and transfers zero-shot across four unseen counties, with background masking serving as the key driver of cross-domain robustness.",
    links: [
      { label: "OpenReview", href: "https://openreview.net/pdf?id=gmZLncO9zM" },
      { label: "PDF", href: "/files/fawn-2026.pdf" },
    ],
  },
  {
    id: "fever-2026",
    title: "Evidence Grounding vs. Memorization: Why Neural Semantics Matter for Knowledge Graph Fact Verification",
    authors: [
      "Ankit Kumar Upadhyay",
      "John S. Erickson",
      "Deborah L. McGuinness",
    ],
    venue: "FEVER @ EACL",
    year: "2026",
    badge: "Oral",
    area: "NLP & Knowledge",
    status: "published",
    takeaway:
      "Disentangles symbolic structure, neural semantics, and explicit KG grounding versus LLM memorization across 108K claims on FACTKG.",
    abstract:
      "We systematically compare symbolic baselines, graph neural networks, linearized-subgraph transformers, and LLMs on FACTKG (108,675 claims). Token-level neural semantics (BERT at 92.68%) substantially outperform both hand-crafted symbolic features (66.54%) and GNN message passing (~70%). Controlled filtering experiments show that semantic relevance governs learnability, while explicit KG-grounded chain-of-thought reasoning boosts GPT-4o-mini and GPT-4.1-mini by 12.67 and 9.33 points over claim-only memorization.",
    links: [
      { label: "ACL Anthology", href: "https://aclanthology.org/2026.fever-1.3/" },
      { label: "DOI", href: "https://doi.org/10.18653/v1/2026.fever-1.3" },
    ],
  },
  {
    id: "cv4a-2025",
    title: "Animal Re-Identification via Multiview Spatio-Temporal Track Clustering",
    authors: [
      "Ankit K. Upadhyay",
      "Ekaterina Nepovinnykh",
      "S. M. Rayeed",
      "Aidan Westphal",
      "Lawrence Miao",
      "Julian M. Bain",
      "Jaeseok Kang",
      "Tuomas Eerola",
      "Heikki Kälviäinen",
      "Charles V. Stewart",
    ],
    venue: "CV4Animals @ CVPR",
    year: "2025",
    badge: "Poster",
    area: "Wildlife Vision",
    status: "published",
    takeaway:
      "Links complementary left- and right-flank detections across long drone tracks via representative sampling and multiview embedding clustering.",
    abstract:
      "We introduce a video-first framework for identifying individual animals across long in-the-wild image sequences despite occlusion and viewpoint shifts. High-identifiability detections are sampled across viewpoints, embedded with MiewID, clustered per view, and linked across left and right flanks using intra-track consistency constraints with targeted manual review.",
    links: [
      { label: "OpenReview", href: "https://openreview.net/pdf?id=hHbRvzQRHI" },
    ],
  },
  {
    id: "xnli-2023",
    title: "XNLI 2.0: Improving XNLI Dataset and Performance on Cross Lingual Understanding (XLU)",
    authors: ["Ankit Kumar Upadhyay", "Harsit Kumar Upadhya"],
    venue: "IEEE I2CT",
    year: "2023",
    badge: "Oral",
    area: "NLP & Knowledge",
    status: "published",
    takeaway:
      "Re-translates MNLI/XNLI across 14 languages and evaluates non-English pivot transfer for low-resource languages such as Swahili and Urdu.",
    abstract:
      "We re-translate the MNLI and XNLI benchmarks across all 14 non-English XNLI languages and systematically train cross-lingual natural language inference models across all 15 source languages, analyzing when non-English pivot languages improve transfer into underrepresented languages such as Swahili and Urdu.",
    links: [
      { label: "IEEE", href: "https://ieeexplore.ieee.org/document/10126332" },
      { label: "arXiv", href: "https://arxiv.org/abs/2301.06527" },
      { label: "Hugging Face", href: "https://huggingface.co/papers/2301.06527" },
    ],
  },
  {
    id: "mavric-ijcv",
    title: "MAVRIC: A Modular Pipeline for Identity Resolution in Drone Video of Patterned Animals",
    authors: [
      "Ankit Kumar Upadhyay",
      "Ekaterina Nepovinnykh",
      "Aidan Westphal",
      "Maksim Kholiavchenko",
      "Tuomas Eerola",
      "Heikki Kälviäinen",
      "Tanya Berger-Wolf",
      "Daniel Rubenstein",
      "Charles V. Stewart",
    ],
    venue: "IJCV Special Issue",
    year: "2026",
    badge: "Under Review",
    area: "Wildlife Vision",
    status: "preprint",
    takeaway:
      "Semi-automated drone-video identity resolution pipeline cutting expert comparisons by ~97% across three patterned wildlife species.",
    abstract:
      "MAVRIC selects compact Representative Annotations from drone tracks using a learned identifiability scorer, clusters MiewID embeddings via Local Clusters and Alternatives (LCA), resolves cross-viewpoint track inconsistencies, and requests human verification only where algorithmic confidence is low—achieving high accuracy with an order-of-magnitude reduction in manual effort.",
    links: [
      { label: "Preprint PDF", href: "/files/mavric-2025.pdf" },
    ],
  },
  {
    id: "beta-stability-2026",
    title: "β-Stability: Efficient Curation of Individual Animal Identification",
    authors: [
      "Ekaterina Nepovinnykh",
      "Timm Haucke",
      "Fedor Zolotarev",
      "Aleksandr Algasov",
      "Ankit Kumar Upadhyay",
      "Daniel Rubenstein",
      "Tanya Berger-Wolf",
      "Tuomas Eerola",
      "Heikki Kälviäinen",
      "Pavel Zemčík",
      "Sara Beery",
      "Charles V. Stewart",
    ],
    venue: "Methods in Ecology and Evolution",
    year: "2026",
    badge: "Under Review",
    area: "Wildlife Vision",
    status: "preprint",
    takeaway:
      "Graph-based human-in-the-loop curation modeling individual animal identities via signed, confidence-weighted match graphs.",
    abstract:
      "We formulate individual animal identity curation as a signed graph partitioning problem over image detections and ranked candidate matches, focusing expert review strictly on unstable boundaries to produce reliable individual catalogs with minimal manual effort.",
    links: [
      { label: "bioRxiv", href: "https://doi.org/10.64898/2026.10.19.760261" },
    ],
  },
  {
    id: "kabr-scidata",
    title: "The KABR Collection of In Situ Drone Video, Telemetry, and Behavior Data for African Ungulates at the Mpala Research Centre",
    authors: [
      "Jenna Kline",
      "Elizabeth Campolongo",
      "Ankit Kumar Upadhyay",
      "Charles V. Stewart",
      "Tanya Berger-Wolf",
      "Daniel Rubenstein",
    ],
    venue: "Scientific Data (Nature Portfolio)",
    year: "2026",
    badge: "Under Review",
    area: "Wildlife Vision",
    status: "preprint",
    takeaway:
      "Open in-situ drone video, flight telemetry, and frame-level behavior benchmark for reticulated giraffes, plains zebras, and Grévy's zebras.",
    abstract:
      "An open, ecologically grounded multimodal collection captured at Mpala Research Centre in Laikipia, Kenya, pairing high-resolution drone videos and telemetry with curated individual tracks and fine-grained behavioral annotations across three wild African ungulate species.",
    links: [
      { label: "Dataset", href: "https://huggingface.co/datasets/imageomics/KABR" },
      { label: "Project", href: "https://kabrdata.xyz/" },
    ],
  },
  {
    id: "cross-view-2026",
    title: "Cross-Viewpoint Identity Retrieval in Bilaterally Asymmetric Patterned Animals",
    authors: [
      "Ankit Kumar Upadhyay",
      "Ekaterina Nepovinnykh",
      "Fedor Zolotarev",
      "Charles V. Stewart",
      "Sara Beery",
    ],
    venue: "CVPR 2027 Target",
    year: "2026",
    badge: "In Preparation",
    area: "Wildlife Vision",
    status: "preprint",
    takeaway:
      "Explores cross-viewpoint individual matching for patterned wildlife whose left and right flanks exhibit distinct biometric markings.",
    abstract:
      "Many patterned wildlife species exhibit bilateral asymmetry, breaking standard image-retrieval assumptions when individuals are photographed from opposite sides. This manuscript investigates cross-viewpoint representation learning and token-level geometric matching to bridge disjoint flank observations.",
    links: [],
  },
];
