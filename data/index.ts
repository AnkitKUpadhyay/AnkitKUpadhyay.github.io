export interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  venueShort: string;
  year: number;
  type: "oral" | "poster" | "journal" | "preprint";
  venueType: "workshop" | "conference" | "journal" | "preprint";
  abstract: string;
  links: { label: string; url: string }[];
  area: string[];
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  links: { label: string; url: string }[];
  gradient: string;
  area: string;
  featured: boolean;
}

export interface Experience {
  id: string;
  role: string;
  org: string;
  orgFull: string;
  location: string;
  start: string;
  end: string;
  type: "research" | "teaching" | "industry";
  bullets: string[];
}

export interface ResearchArea {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  icon: string;
  gradient: string;
}

export const publications: Publication[] = [
  {
    id: "fawn-2026",
    title:
      "FAWN: Foundation Model based Attribute Classification for Wildlife Re-Identification",
    authors: "Ankit Upadhyay, et al.",
    venue: "CV4Animals Workshop @ CVPR 2026",
    venueShort: "CV4Animals @ CVPR 2026",
    year: 2026,
    type: "poster",
    venueType: "workshop",
    abstract:
      "We introduce FAWN, a foundation-model pipeline for label-efficient attribute classification in wildlife re-identification. By leveraging large vision-language models and cross-species transfer, FAWN achieves strong performance on fine-grained animal traits under limited supervision, enabling scalable ecological monitoring across long-tailed species distributions.",
    links: [],
    area: ["animal-reid", "foundation-models"],
  },
  {
    id: "kg-fact-2026",
    title:
      "Evidence Grounding vs. Memorization: Why Semantics Matter for KG Fact Verification",
    authors: "Ankit Upadhyay, et al.",
    venue: "FEVER Workshop @ EACL 2026",
    venueShort: "FEVER @ EACL 2026",
    year: 2026,
    type: "oral",
    venueType: "workshop",
    abstract:
      "We investigate the interplay between evidence grounding and parametric memorization in knowledge graph fact verification, demonstrating that semantic understanding—not surface pattern matching—is the key driver of robust verification. Our analysis reveals systematic failure modes in existing models and proposes semantics-aware training objectives that significantly improve out-of-distribution generalization.",
    links: [
      {
        label: "Paper",
        url: "https://github.com/AnkitKUpadhyay/kg-fact-verification-semantics",
      },
    ],
    area: ["nlp"],
  },
  {
    id: "mavric-2025",
    title:
      "MAVRIC: Multiview Representative Annotation Clustering for Drone-Based Animal Re-Id",
    authors: "Ankit Upadhyay, et al.",
    venue:
      "International Journal of Computer Vision (IJCV), Special Issue — Under Review",
    venueShort: "IJCV 2025 (Under Review)",
    year: 2025,
    type: "journal",
    venueType: "journal",
    abstract:
      "MAVRIC is an end-to-end semi-automated pipeline for video-based animal re-identification from drone footage. Combining viewpoint classification, information asymmetry scoring, and the Local Clusters and Alternatives algorithm, MAVRIC achieves near-perfect precision (often 1.0) across 14 evaluation datasets spanning three animal species, significantly reducing manual annotation burden for wildlife surveys.",
    links: [],
    area: ["animal-reid", "foundation-models"],
  },
  {
    id: "multiview-reid-2025",
    title:
      "Animal Re-Identification via Multiview Spatio-Temporal Track Clustering",
    authors: "Ankit Upadhyay, et al.",
    venue: "CV4Animals Workshop @ CVPR 2025",
    venueShort: "CV4Animals @ CVPR 2025",
    year: 2025,
    type: "poster",
    venueType: "workshop",
    abstract:
      "We present a multiview spatio-temporal track clustering approach for animal re-identification in the wild. By aggregating multi-perspective tracklets and leveraging temporal consistency, our method handles occlusions and viewpoint variations inherent to drone-based ecological surveys, achieving robust identity matching across extended observation windows.",
    links: [],
    area: ["animal-reid"],
  },
  {
    id: "xnli2-2023",
    title:
      "XNLI 2.0: Improving XNLI Dataset and Performance on Cross-Lingual Understanding",
    authors: "Ankit Upadhyay, et al.",
    venue: "IEEE 2023 8th International Conference for Convergence in Technology",
    venueShort: "IEEE I2CT 2023",
    year: 2023,
    type: "oral",
    venueType: "conference",
    abstract:
      "We improve the XNLI benchmark by re-translating the MultiNLI dataset across all 14 languages using modern neural machine translation, and explore the use of high-resource non-English languages as pivot sources for cross-lingual NLI. Our findings reveal that language choice for cross-lingual transfer substantially impacts performance on low-resource languages including Swahili and Urdu.",
    links: [],
    area: ["nlp"],
  },
];

export const projects: Project[] = [
  {
    id: "mavric",
    title: "MAVRIC",
    subtitle: "Drone-Based Animal Re-Identification Pipeline",
    description:
      "End-to-end semi-automated deep learning system for video-based animal re-identification from aerial drone footage. Combines EfficientNet B4 viewpoint classification, ResNet50 IA scoring, and the LCA graph algorithm to achieve near-perfect precision across 14 datasets and 3 species.",
    tech: ["PyTorch", "EfficientNet", "ResNet50", "LCA Algorithm", "Python", "OpenCV"],
    links: [],
    gradient: "from-blue-600 to-teal-500",
    area: "Animal Re-ID",
    featured: true,
  },
  {
    id: "fawn",
    title: "FAWN",
    subtitle: "Foundation Model Wildlife Attribute Classifier",
    description:
      "Label-efficient attribute classification pipeline for wildlife re-identification using foundation models. Leverages large vision-language models and cross-species transfer learning to classify fine-grained animal attributes under minimal supervision.",
    tech: ["PyTorch", "DINOv3", "SAM3", "HuggingFace", "ViT", "Python"],
    links: [],
    gradient: "from-violet-600 to-blue-500",
    area: "Foundation Models",
    featured: true,
  },
  {
    id: "retrovision",
    title: "RetroVision",
    subtitle: "AI Living Time Machine — HackRPI 2025 Winner",
    description:
      "MLH Best Use of ElevenLabs prize winner at HackRPI 2025. Turns Troy historical records and archival documents into short narrated videos with AI-generated narration, breathing life into history through multimodal generation.",
    tech: ["ElevenLabs API", "Python", "LLM", "Video Generation", "React"],
    links: [],
    gradient: "from-amber-500 to-rose-500",
    area: "Generative AI",
    featured: true,
  },
  {
    id: "distributed-miewid",
    title: "Distributed MiewID",
    subtitle: "Multi-GPU Distributed Training Pipeline",
    description:
      "Implemented DistributedDataParallel (DDP) training for MiewID across 2–3 GPUs, achieving 1.5–2× speedup while maintaining accuracy. Engineered synchronized training with process-group setup, epoch/validation barriers, and linear LR scaling.",
    tech: ["PyTorch DDP", "CUDA", "NCCL", "Python", "HPC"],
    links: [{ label: "Code", url: "https://github.com/AnkitKUpadhyay/miew_id_trial" }],
    gradient: "from-green-500 to-teal-600",
    area: "Distributed ML",
    featured: false,
  },
  {
    id: "funky-funkos",
    title: "Funky Funkos",
    subtitle: "Text-to-3D Animation Pipeline",
    description:
      "End-to-end pipeline generating animated Funko Pop videos from text prompts. Fine-tuned Stable Diffusion v1.5 on 657 curated images, integrated Plug-and-Play Diffusion Features for attribute editing, and used SyncDreamer + Stable Video Diffusion for 3D animation.",
    tech: ["Stable Diffusion", "SyncDreamer", "Zero123++", "Python", "PyTorch"],
    links: [],
    gradient: "from-pink-500 to-violet-500",
    area: "Generative AI",
    featured: false,
  },
  {
    id: "xnli3",
    title: "XNLI 3.0",
    subtitle: "Cross-Lingual Transfer Learning for NLU",
    description:
      "Undergraduate thesis awarded a KSCST grant. Extended XNLI by re-translating MNLI across 14 languages and exploring non-English pivot languages for cross-lingual NLI, with a focus on improving performance on Indian low-resource languages.",
    tech: ["XLM-R", "HuggingFace", "PyTorch", "Cross-Lingual NLP", "Python"],
    links: [],
    gradient: "from-cyan-500 to-blue-600",
    area: "NLP",
    featured: false,
  },
];

export const experience: Experience[] = [
  {
    id: "rpi-research",
    role: "Graduate Research Assistant",
    org: "RPI",
    orgFull: "Rensselaer Polytechnic Institute",
    location: "Troy, NY",
    start: "Aug 2023",
    end: "Present",
    type: "research",
    bullets: [
      "Developing MAVRIC, an end-to-end pipeline for drone-based animal re-identification, achieving near-perfect precision (often 1.0) across 14 datasets covering three species.",
      "Designed the Universal Comparability Algorithm combining SAM3 segmentation with DINOv3 visual features for foreground-aware, species-agnostic identity matching.",
      "Engineered viewpoint classification (EfficientNet B4) and IA scoring (ResNet50) workflows robust to occlusions and extreme viewpoint variation in the wild.",
      "Building FAWN, a foundation-model pipeline for label-efficient wildlife attribute classification using cross-species transfer and large vision-language models.",
    ],
  },
  {
    id: "rpi-ta",
    role: "Graduate Teaching Assistant — AI for Conservation",
    org: "RPI",
    orgFull: "Rensselaer Polytechnic Institute",
    location: "Troy, NY",
    start: "Aug 2025",
    end: "Present",
    type: "teaching",
    bullets: [
      "Teaching Assistant for AI for Conservation; designed homework assignments and rubrics for 40 undergraduate and graduate students.",
      "Conducted weekly office hours and provided technical mentorship on computer vision and machine learning applications to conservation challenges.",
      "Guided students through semester-long course projects applying deep learning to real-world ecological monitoring problems.",
    ],
  },
  {
    id: "vtu-thesis",
    role: "Undergraduate Research — Cross-Lingual NLU",
    org: "VTU",
    orgFull: "Visvesvaraya Technological University",
    location: "Bengaluru, India",
    start: "Aug 2022",
    end: "Jun 2023",
    type: "research",
    bullets: [
      "Improved XNLI by re-translating MNLI across 14 languages using neural MT and analyzed the impact on XLM-R cross-lingual NLI performance.",
      "Explored non-English high-resource languages as pivot sources for low-resource language inference tasks (Swahili, Urdu, Indian languages).",
      "Awarded Rs. 4,000 grant by the Karnataka State Council for Science and Technology (KSCST) under the Student Project Programme.",
    ],
  },
];

export const researchAreas: ResearchArea[] = [
  {
    id: "animal-reid",
    title: "Animal Re-Identification",
    description:
      "Building scalable, species-agnostic pipelines for identifying individual animals across drone footage, camera traps, and multi-camera deployments. Focus on handling real-world challenges: occlusions, viewpoint variation, long-tailed distributions, and minimal labeled data.",
    keywords: ["MAVRIC", "Track Clustering", "LCA Algorithm", "Drone Imagery", "Multi-Species"],
    icon: "🦓",
    gradient: "from-blue-500/20 to-teal-500/20",
  },
  {
    id: "foundation-models",
    title: "Foundation Models for Ecology",
    description:
      "Adapting large-scale vision and vision-language models for ecological AI. Developing label-efficient attribute classifiers (FAWN), foreground-aware embeddings with SAM + DINOv3, and cross-species generalization strategies for deployment in ecologically diverse field settings.",
    keywords: ["DINOv3", "SAM3", "FAWN", "Cross-Species Transfer", "Low-Supervision"],
    icon: "🧠",
    gradient: "from-violet-500/20 to-blue-500/20",
  },
  {
    id: "nlp",
    title: "Multilingual NLP",
    description:
      "Democratizing NLP for low-resource languages by developing robust cross-lingual transfer learning systems. Building and benchmarking multilingual datasets and models that extend state-of-the-art capabilities to historically underrepresented linguistic communities.",
    keywords: ["XLM-R", "XNLI", "Cross-Lingual Transfer", "Low-Resource Languages", "NLI"],
    icon: "🌐",
    gradient: "from-teal-500/20 to-cyan-500/20",
  },
  {
    id: "conservation-ai",
    title: "AI for Conservation",
    description:
      "Applying machine learning to biodiversity monitoring at scale — from semi-automated wildlife surveys and behavior understanding to tools that reduce annotation burden for field ecologists. Emphasis on deployment in ecologically diverse, resource-constrained settings.",
    keywords: ["Biodiversity", "Wildlife Surveys", "Behavior Understanding", "Field Deployment"],
    icon: "🌿",
    gradient: "from-green-500/20 to-teal-500/20",
  },
];

export const awards = [
  { year: 2025, title: "MLH Best Use of ElevenLabs", event: "HackRPI 2025" },
  { year: 2025, title: "IJCV Special Issue Invitation", event: "CVPR 2025 Extended" },
  { year: 2025, title: "Funcapalooza — Full Scholarship", event: "NSF HDR Imageomics Institute" },
  { year: 2025, title: "Research Poster Presentation", event: "CV4Animals @ CVPR 2025" },
  { year: 2024, title: "2nd Prize in Prose, Hon. Mention in Poetry", event: "McKinney Writing Contest, RPI" },
  { year: 2023, title: "Top Performer & Best Outgoing Student", event: "VTU — Class of 2023 (210 students)" },
  { year: 2023, title: "Best Undergraduate Project", event: "VTU — Cross-Lingual NLI Thesis" },
  { year: 2022, title: "Full Scholarship — Deep Learning Summer School", event: "Neuromatch Academy" },
  { year: 2022, title: "Silver Medal — Top 15%", event: "International Youth Math Challenge (5,500 participants)" },
  { year: 2022, title: "Clinton Global Initiative University", event: "Cohort of 400 students globally" },
  { year: 2022, title: "Full Scholarship — Global Citizen Year Academy", event: "260 students globally" },
  { year: 2019, title: "Silver Award", event: "Queen's Commonwealth Essay Competition" },
];

export const socialLinks = [
  { label: "GitHub", url: "https://github.com/AnkitKUpadhyay", icon: "github" },
  { label: "LinkedIn", url: "https://linkedin.com/in/ankitkupadhyay", icon: "linkedin" },
  { label: "Google Scholar", url: "https://scholar.google.com", icon: "scholar" },
  { label: "HuggingFace", url: "https://huggingface.co/AnkitKUpadhyay", icon: "huggingface" },
  { label: "Email", url: "mailto:upadha2@rpi.edu", icon: "mail" },
];
