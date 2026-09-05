const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const form = document.getElementById("inquiryForm");
const success = document.getElementById("formSuccess");
const submitButton = form?.querySelector('button[type="submit"]');
const photoInput = form?.querySelector('input[type="file"][name="fi-file-photos[]"]');
const fileSelected = document.getElementById("fileSelected");
let selectedPhotos = [];

const syncPhotoInput = () => {
  if (!photoInput || typeof DataTransfer === "undefined") return;

  const dataTransfer = new DataTransfer();
  selectedPhotos.forEach((file) => dataTransfer.items.add(file));
  photoInput.files = dataTransfer.files;
};

const renderSelectedPhotos = () => {
  if (!fileSelected) return;

  fileSelected.replaceChildren();

  if (!selectedPhotos.length) {
    fileSelected.hidden = true;
    return;
  }

  fileSelected.hidden = false;
  const countText = selectedPhotos.length === 1
    ? "Vybrána 1 fotografie:"
    : `Vybráno ${selectedPhotos.length} fotografií:`;

  const count = document.createElement("span");
  count.textContent = countText;
  fileSelected.appendChild(count);

  selectedPhotos.forEach((file, index) => {
    const item = document.createElement("span");
    item.className = "file-selected-item";

    const name = document.createElement("span");
    name.textContent = file.name;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "file-remove";
    removeButton.setAttribute("aria-label", `Odstranit fotografii ${file.name}`);
    removeButton.title = "Odstranit fotografii";
    removeButton.textContent = "×";
    removeButton.addEventListener("click", () => {
      selectedPhotos.splice(index, 1);
      syncPhotoInput();
      renderSelectedPhotos();
    });

    item.append(name, removeButton);
    fileSelected.appendChild(item);
  });
};

if (photoInput && fileSelected) {
  fileSelected.hidden = true;

  photoInput.addEventListener("change", () => {
    const newFiles = [...photoInput.files];
    const existing = new Set(
      selectedPhotos.map((file) => `${file.name}|${file.size}|${file.lastModified}`)
    );

    newFiles.forEach((file) => {
      const key = `${file.name}|${file.size}|${file.lastModified}`;
      if (!existing.has(key)) {
        selectedPhotos.push(file);
        existing.add(key);
      }
    });

    syncPhotoInput();
    renderSelectedPhotos();
  });
}

if (form && success && submitButton) {
  const forminit = new Forminit();
  const FORM_ID = "ko87qh4n5ua";
  const originalButtonText = submitButton.textContent;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    success.classList.remove("show");
    submitButton.disabled = true;
    submitButton.textContent = "Odesílám…";

    try {
      const phoneInput = form.querySelector('input[name="fi-sender-phone"]');
      if (phoneInput) {
        let normalizedPhone = phoneInput.value.trim().replace(/[\s().-]+/g, "");
        if (normalizedPhone.startsWith("00")) normalizedPhone = "+" + normalizedPhone.slice(2);
        phoneInput.value = normalizedPhone;
      }

      const formData = new FormData(form);
      const { error } = await forminit.submit(FORM_ID, formData);

      if (error) {
        console.error("Forminit error:", error);
        const errorMessage = error.message || "Telefonní číslo nebo některý z údajů není ve správném formátu.";
        const isPhoneError = error.error === "FI_RULES_PHONE_INVALID" || /phone number.*invalid/i.test(errorMessage);
        success.querySelector("strong").textContent = "Poptávku se nepodařilo odeslat.";
        success.querySelector("span").textContent = isPhoneError
          ? "Zkontrolujte prosím telefonní číslo. Zadejte ho v mezinárodním formátu, například +420 123 456 789."
          : "Zkontrolujte prosím vyplněné údaje a zkuste to znovu. Pokud problém přetrvá, zavolejte mi na +420 722 237 203.";
        success.classList.add("show");
        return;
      }

      form.reset();
      selectedPhotos = [];
      if (fileSelected) {
        fileSelected.textContent = "";
        fileSelected.hidden = true;
      }
      success.querySelector("strong").textContent = "Díky! Poptávka je u Fachmana.";
      success.querySelector("span").textContent = "Poptávka byla úspěšně odeslána. Ozvu se Vám co nejdříve.";
      success.classList.add("show");
      success.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (error) {
      console.error("Forminit submit error:", error);
      success.querySelector("strong").textContent = "Poptávku se nepodařilo odeslat.";
      success.querySelector("span").textContent = "Zkontrolujte prosím připojení k internetu a zkuste to znovu. Pokud problém přetrvá, zavolejte mi na +420 722 237 203.";
      success.classList.add("show");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}

document.querySelectorAll("[data-placeholder-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    alert("Sem doplníme přesný odkaz na profil Olomóckého Fachmana.");
  });
});

const sectionLinks = [...document.querySelectorAll(".side-nav a")];
const trackedSections = sectionLinks
  .map((link) => document.getElementById(link.dataset.section))
  .filter(Boolean);

const setActiveSection = () => {
  const marker = window.innerHeight * 0.42;
  let active = trackedSections[0];
  trackedSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= marker) active = section;
  });
  sectionLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.section === active?.id);
  });
};

window.addEventListener("scroll", setActiveSection, { passive: true });
window.addEventListener("resize", setActiveSection);
setActiveSection();


const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = lightbox?.querySelector(".lightbox-close");

document.querySelectorAll(".portfolio-photo").forEach((button) => {
  button.addEventListener("click", () => {
    const img = button.querySelector("img");
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  });
});

const closeLightbox = () => {
  lightbox?.classList.remove("open");
  lightbox?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  if (lightboxImage) lightboxImage.src = "";
};
lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeLightbox(); });
