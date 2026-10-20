
const laws = [
  {
    id: "bns",
    title: "Bharatiya Nyaya Sanhita, 2023",
    topics: ["threats", "fraud", "other"],
    description:
      "India's general criminal law includes provisions concerning various offences, including certain forms of violence, intimidation and cheating. The relevant provision depends on the facts.",
    url: "https://www.indiacode.nic.in/bitstream/123456789/20062/1/a2023-45.pdf"
  },
  {
    id: "scst",
    title: "SC/ST (Prevention of Atrocities) Act, 1989",
    topics: ["caste"],
    description:
      "Provides legal protections concerning specified atrocities against members of Scheduled Castes and Scheduled Tribes. The statutory requirements and facts must be assessed.",
    url: "https://www.indiacode.nic.in/handle/123456789/1920?view_type=browse"
  },
  {
    id: "domestic",
    title: "Protection of Women from Domestic Violence Act, 2005",
    topics: ["domestic"],
    description:
      "Provides protections and legal remedies for women affected by domestic violence, subject to the Act's provisions.",
    url: "https://www.indiacode.nic.in/handle/123456789/2021?view_type=search"
  },
  {
    id: "consumer",
    title: "Consumer Protection Act, 2019",
    topics: ["consumer"],
    description:
      "Provides consumer rights and remedies for qualifying consumer disputes. It does not apply to every financial or family disagreement.",
    url: "https://www.indiacode.nic.in/indiacode/handle/123456789/16103?view_type=browse"
  }
];

const categoryNames = {
  threats: "Threats or physical violence",
  caste: "Caste-based discrimination or abuse",
  domestic: "Domestic violence",
  fraud: "Fraud or financial cheating",
  property: "Family property dispute",
  consumer: "Consumer complaint",
  workplace: "Workplace exploitation or harassment",
  corruption: "Corruption or abuse of power",
  other: "Other / not sure"
};

const steps = [...document.querySelectorAll(".form-step")];
const form = document.getElementById("complaintForm");
const category = document.getElementById("category");
const lawCards = document.getElementById("lawCards");
const lawMatch = document.getElementById("lawMatch");

let currentStep = 0;

function renderLawCards() {
  lawCards.replaceChildren();

  laws.forEach((law) => {
    const card = document.createElement("article");
    card.className = "law-card";

    const heading = document.createElement("h3");
    heading.textContent = law.title;

    const description = document.createElement("p");
    description.textContent = law.description;

    const link = document.createElement("a");
    link.href = law.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Read official source ↗";

    card.append(heading, description, link);
    lawCards.appendChild(card);
  });
}

function getMatchedLaws(value) {
  if (value === "threats" || value === "fraud" || value === "other") {
    return laws.filter((law) => law.id === "bns");
  }

  if (value === "caste") {
    return laws.filter((law) => law.id === "scst" || law.id === "bns");
  }

  if (value === "domestic") {
    return laws.filter((law) => law.id === "domestic" || law.id === "bns");
  }

  if (value === "consumer") {
    return laws.filter((law) => law.id === "consumer");
  }

  if (value === "property") {
    return laws.filter((law) => law.id === "bns");
  }

  if (value === "workplace" || value === "corruption") {
    return laws.filter((law) => law.id === "bns");
  }

  return [];
}

function renderLawMatch() {
  const selected = category.value;
  lawMatch.replaceChildren();

  if (!selected) {
    lawMatch.classList.add("hidden");
    return;
  }

  const heading = document.createElement("h4");
  heading.textContent = "General legal information";

  const intro = document.createElement("p");
  intro.textContent =
    "This category is only a starting point. It does not establish that a legal offence occurred or identify every law that might apply.";

  lawMatch.append(heading, intro);

  const matches = getMatchedLaws(selected);

  if (matches.length === 0) {
    const note = document.createElement("p");
    note.textContent =
      "No specific law is mapped here. Consider consulting a qualified lawyer or legal aid service.";
    lawMatch.appendChild(note);
  } else {
    const list = document.createElement("ul");

    matches.forEach((law) => {
      const item = document.createElement("li");
      const link = document.createElement("a");

      link.href = law.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = law.title;
      link.style.color = "#f5b923";

      item.appendChild(link);
      list.appendChild(item);
    });

    lawMatch.appendChild(list);
  }

  lawMatch.classList.remove("hidden");
}

function showStep(index) {
  currentStep = index;

  steps.forEach((step, i) => {
    step.classList.toggle("active", i === index);
  });

  document.getElementById("stepLabel").textContent =
    `Step ${index + 1} of ${steps.length}`;

  const percent = Math.round(((index + 1) / steps.length) * 100);
  document.getElementById("percent").textContent = `${percent}%`;
  document.getElementById("progressBar").style.width = `${percent}%`;

  document.getElementById("backButton")
    .classList.toggle("hidden", index === 0);

  document.getElementById("nextButton")
    .classList.toggle("hidden", index === steps.length - 1);

  document.getElementById("createButton")
    .classList.toggle("hidden", index !== steps.length - 1);

  if (index === 2) {
    renderReview();
  }
}

function getValue(id) {
  return document.getElementById(id).value.trim();
}

function renderReview() {
  const container = document.getElementById("reviewContent");
  container.replaceChildren();

  const items = [
    ["Category", categoryNames[category.value] || "Not selected"],
    ["Date", getValue("incidentDate") || "Not provided"],
    ["General location", getValue("location")],
    ["Person / organization", getValue("accused") || "Not provided"],
    ["Incident details", getValue("details")],
    ["Immediate danger", getValue("danger")],
    ["Witness / context", getValue("witness") || "Not provided"],
    ["Requested help", getValue("nextStep")],
    [
      "Evidence filename",
      document.getElementById("evidence").files[0]?.name || "No file selected"
    ]
  ];

  items.forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "review-item";

    const heading = document.createElement("strong");
    heading.textContent = label;

    const text = document.createElement("p");
    text.textContent = value;

    item.append(heading, text);
    container.appendChild(item);
  });
}

function createDraft() {
  const date = getValue("incidentDate") || "Not provided";
  const evidence =
    document.getElementById("evidence").files[0]?.name || "None provided";

  const matched = getMatchedLaws(category.value);

  const legalReferences = matched.length
    ? matched.map((law) => `${law.title}\n${law.url}`).join("\n\n")
    : "No specific law mapped. Seek qualified legal guidance.";

  const draft = [
    "HIFPJ — COMPLAINT DRAFT",
    "=======================",
    "",
    "This is an unsubmitted draft prepared using a demonstration website.",
    "",
    "Complaint category: " + (categoryNames[category.value] || "Not selected"),
    "Incident date: " + date,
    "General location: " + getValue("location"),
    "Person / organization named: " + (getValue("accused") || "Not provided"),
    "Immediate danger: " + getValue("danger"),
    "",
    "DESCRIPTION OF INCIDENT",
    getValue("details"),
    "",
    "ADDITIONAL CONTEXT",
    getValue("witness") || "Not provided",
    "",
    "EVIDENCE FILENAME",
    evidence,
    "",
    "REQUESTED HELP",
    getValue("nextStep"),
    "",
    "POTENTIALLY RELEVANT LEGAL SOURCES",
    legalReferences,
    "",
    "IMPORTANT",
    "This draft does not establish guilt or determine which laws apply.",
    "Review the facts and seek qualified legal advice where appropriate.",
    "This website has not sent this report to any authority.",
    "No secure storage or anonymity is provided by this prototype."
  ].join("\n");

  document.getElementById("draftOutput").value = draft;
  document.getElementById("draftResult").classList.remove("hidden");
  document.getElementById("copyStatus").textContent = "";
}

category.addEventListener("change", renderLawMatch);

document.getElementById("nextButton").addEventListener("click", () => {
  if (currentStep === 0) {
    const requiredIds = ["category", "location", "details"];
    let valid = true;

    for (const id of requiredIds) {
      const field = document.getElementById(id);

      if (!field.checkValidity()) {
        field.reportValidity();
        valid = false;
        break;
      }
    }

    if (!valid) return;
  }

  showStep(Math.min(currentStep + 1, steps.length - 1));
});

document.getElementById("backButton").addEventListener("click", () => {
  showStep(Math.max(currentStep - 1, 0));
});

document.getElementById("createButton").addEventListener("click", () => {
  if (!document.getElementById("confirmReview").checked) {
    alert("Please confirm that you understand this is only a draft.");
    return;
  }

  createDraft();
});

document.getElementById("copyButton").addEventListener("click", async () => {
  const output = document.getElementById("draftOutput");
  const status = document.getElementById("copyStatus");

  try {
    await navigator.clipboard.writeText(output.value);
    status.textContent = "Draft copied successfully.";
  } catch {
    output.focus();
    output.select();

    const copied = document.execCommand("copy");
    status.textContent = copied
      ? "Draft copied."
      : "Copy was unavailable. Select the text and press Ctrl+C.";
  }
});

document.getElementById("downloadButton").addEventListener("click", () => {
  const text = document.getElementById("draftOutput").value;
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "HIFPJ-complaint-draft.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
});

renderLawCards();
showStep(0);
