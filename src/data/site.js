export const profile = {
  name: "Ankit Upadhyay",
  role: "PhD Candidate in Computer Science",
  institution: "Rensselaer Polytechnic Institute",
  location: "Troy, NY",
  advisor: "Charles V. Stewart",
  bio: "I build vision foundation-model systems that identify individual animals and understand wildlife behavior in the field — alongside equitable NLP for underrepresented languages.",
  support: "Supported by the NSF HDR Imageomics Institute (#2118240) and NSF AI Institute ICICLE (#2112606).",
  cvUrl: "/files/Ankit_Upadhyay_CV.pdf",
  email: "upadha2@rpi.edu",
  socials: [
    { label: "Scholar", href: "https://scholar.google.com/citations?user=dNClByYAAAAJ&hl=en" },
    { label: "GitHub", href: "https://github.com/AnkitKUpadhyay" },
    { label: "Hugging Face", href: "https://huggingface.co/ankitkupadhyay" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ankit-kumar-upadhyay-b332b8186/" },
    { label: "Medium", href: "https://medium.com/rpi-phd-diary" },
  ],
};

export const researchPillars = [
  {
    index: "01",
    title: "Evidence-Aware Wildlife Re-ID",
    text: "Separating true individual biometric signals from environmental shortcuts across camera traps, drones, and asymmetric viewpoints.",
  },
  {
    index: "02",
    title: "Label-Efficient Ecological Behavior",
    text: "Adapting frozen vision and video foundation models (SAM 3, DINOv3, V-JEPA 2.1) to long-tailed species distributions with minimal supervision.",
  },
  {
    index: "03",
    title: "Equitable & Grounded Language AI",
    text: "Advancing cross-lingual transfer for low-resource languages and evidence-grounded verification over structured knowledge graphs.",
  },
];

export const experience = [
  {
    period: "2023 — Present",
    role: "Graduate Research Assistant",
    org: "Rensselaer Polytechnic Institute · Imageomics & ICICLE",
    detail:
      "PhD in Computer Science (M.S. awarded Dec 2024). Developing foundation-model pipelines for animal re-identification, counterfactual evaluation, and frozen V-JEPA 2.1 wildlife behavior recognition across long-tailed ecological datasets.",
  },
  {
    period: "Fall 2025",
    role: "Graduate Teaching Assistant — AI for Conservation",
    org: "Rensselaer Polytechnic Institute",
    detail:
      "Designed assignments and rubrics, led weekly office hours for 40 students, and mentored semester-long computer vision projects addressing conservation problems.",
  },
  {
    period: "2022 — 2023",
    role: "Undergraduate Research Thesis — XNLI 3.0",
    org: "Visvesvaraya Technological University · Bengaluru",
    detail:
      "B.E. in Computer Science & Engineering. Investigated cross-lingual transfer learning and non-English pivot selection for Indian and global low-resource languages; awarded a KSCST Student Project grant.",
  },
];

export const projects = [
  {
    title: "Distributed MiewID Training",
    year: "Fall 2025",
    context: "OpenACC & NVIDIA Open Hackathon",
    summary:
      "Engineered PyTorch DistributedDataParallel (DDP) training with linear LR scaling and synchronized validation barriers, cutting Grévy's zebra training time to 99% mAP in half across multi-GPU nodes.",
    tags: ["PyTorch DDP", "CUDA / NCCL", "MiewID"],
    links: [
      { label: "Presentation", href: "https://drive.google.com/file/d/1wl9dQ9wWFfP9-W8pVNm44uBWxIXD-csv/view?usp=sharing" },
    ],
  },
  {
    title: "Funky Funkos: Text-to-3D Pipeline",
    year: "Spring 2025",
    context: "Generative Vision Project",
    summary:
      "End-to-end text-to-animated-3D workflow combining fine-tuned Stable Diffusion v1.5, Plug-and-Play diffusion feature editing, SyncDreamer / Zero123++, and Stable Video Diffusion.",
    tags: ["Diffusion", "3D Synthesis", "Video Generation"],
    links: [
      { label: "Demo & Report", href: "https://drive.google.com/file/d/114r7Osw8DGyGcmQZRJgUAkfWvEJOzo9v/view?usp=sharing" },
    ],
  },
  {
    title: "RetroVision",
    year: "2025",
    context: "HackRPI · MLH Best Use of ElevenLabs",
    summary:
      "An AI \"living time machine\" turning historical archives of Troy, New York into short narrated visual documentaries.",
    tags: ["Archival AI", "ElevenLabs", "Storytelling"],
    links: [
      { label: "GitHub", href: "https://github.com/AnkitKUpadhyay" },
    ],
  },
];

export const honors = [
  "Oral presentation, CV4Ecology Workshop @ ECCV (2026)",
  "Invited submission, IJCV Special Issue following CVPR 2025",
  "Poster presentation, First Imageomics Conference (2026)",
  "MLH Best Use of ElevenLabs Prize, HackRPI (2025)",
  "Full Scholarship, NSF HDR Imageomics Funcapalooza (2025)",
  "2nd Prize in Prose & Honorable Mention in Poetry, RPI McKinney Writing Contest (2024)",
  "Top Performer & Best Outgoing Student, Class of 210 (2023)",
  "Full Scholarship, Neuromatch Academy Deep Learning Summer School (2022)",
  "Cohort Fellow, Clinton Global Initiative University & Tilting Futures (2022)",
];

export const service = [
  "Reviewer, CV4Ecology @ ECCV 2026 & Smithsonian Conservation Biology Institute",
  "Application Reader & Interviewer, Take Action Lab at Tilting Futures (2026 — Present)",
  "Student Advisory Council Member, RPI Provost of Student Experience (2024 — 2025)",
  "Computer Science Graduate Council Representative, RPI (2023 — 2024)",
  "Invited Panelist, RPI Graduate Student Roundtable (Fall 2024, Fall 2025)",
  "Lead Application Reviewer, Climatematch Academy Inaugural Class (2023)",
  "Director of Communications & Outreach, Neuromatch Conference (2022)",
  "Undergraduate Student Body President, Class of 2023",
];
