const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");
const yearNode = document.querySelector("#year");
const mailButton = document.querySelector("#email-cta");
const formNote = document.querySelector("#form-note");
const currencySelect = document.querySelector("#currency-select");
const conversionNote = document.querySelector("#conversion-note");
const gbpLock = document.querySelector("#gbp-lock");
const fxLastUpdated = document.querySelector("#fx-last-updated");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (mailButton) {
  mailButton.addEventListener("click", () => {
    const name = document.querySelector("#name")?.value.trim();
    const email = document.querySelector("#email")?.value.trim();
    const message = document.querySelector("#message")?.value.trim();

    if (!name || !email || !message) {
      if (formNote) {
        formNote.textContent = "Please complete all fields before sending.";
      }
      return;
    }

    const subject = encodeURIComponent(`Contract support inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nProject brief:\n${message}`
    );
    window.location.href = `mailto:jake_yewdell@live.co.uk?subject=${subject}&body=${body}`;
    if (formNote) {
      formNote.textContent = "Opening your email app to send the inquiry.";
    }
  });
}

const fxRates = {
  GBP: 1,
  USD: 1.28,
  EUR: 1.17,
  THB: 45.7
};
const fxUpdatedAt = new Date("2026-03-02T00:00:00");

const currencyFormatters = {
  GBP: new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }),
  USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
  EUR: new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
  THB: new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 })
};

function renderRates(currency = "GBP") {
  const prices = document.querySelectorAll(".price[data-rate-gbp]");
  const rate = fxRates[currency] || 1;
  const formatter = currencyFormatters[currency] || currencyFormatters.GBP;

  prices.forEach((priceNode) => {
    const gbpValue = Number(priceNode.dataset.rateGbp || "0");
    const fromText = priceNode.dataset.from === "true" ? "from " : "";
    const unit = priceNode.dataset.unit || "";
    const converted = gbpValue * rate;
    priceNode.textContent = `${fromText}${formatter.format(converted)}${unit}`;
  });

  if (conversionNote) {
    if (currency === "GBP") {
      conversionNote.textContent = "Rates shown in GBP.";
    } else {
      conversionNote.textContent = `Converted from GBP using a fixed reference rate (${currency}). Final invoicing remains in GBP by default unless agreed in writing.`;
    }
  }
}

function applyCurrencyMode() {
  if (!currencySelect) return;
  const locked = Boolean(gbpLock?.checked);

  if (locked) {
    currencySelect.value = "GBP";
    currencySelect.disabled = true;
    renderRates("GBP");
    if (conversionNote) {
      conversionNote.textContent = "Rates locked to GBP billing display.";
    }
  } else {
    currencySelect.disabled = false;
    renderRates(currencySelect.value);
  }
}

if (fxLastUpdated) {
  const labelDate = fxUpdatedAt.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  fxLastUpdated.textContent = `Reference exchange rates last updated: ${labelDate} (manual update).`;
}

if (currencySelect && gbpLock) {
  applyCurrencyMode();
  gbpLock.addEventListener("change", applyCurrencyMode);
  currencySelect.addEventListener("change", (event) => {
    if (gbpLock.checked) return;
    renderRates(event.target.value);
  });
} else if (currencySelect) {
  renderRates(currencySelect.value);
}

const animatedNodes = document.querySelectorAll("section, .card, .price-card, .timeline article");
animatedNodes.forEach((node) => node.setAttribute("data-animate", ""));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
      }
    });
  },
  { threshold: 0.2 }
);

animatedNodes.forEach((node) => observer.observe(node));
