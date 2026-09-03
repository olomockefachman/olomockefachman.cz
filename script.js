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
      const formData = new FormData(form);
      const { error } = await forminit.submit(FORM_ID, formData);

      if (error) {
        success.querySelector("strong").textContent = "Poptávku se nepodařilo odeslat.";
        success.querySelector("span").textContent = "Zkuste to prosím za chvíli znovu, případně mi zavolejte na +420 722 237 203.";
        success.classList.add("show");
        return;
      }

      form.reset();
      success.querySelector("strong").textContent = "Díky! Poptávka je u Fachmana.";
      success.querySelector("span").textContent = "Poptávka byla úspěšně odeslána. Ozvu se Vám co nejdříve.";
      success.classList.add("show");
      success.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (error) {
      success.querySelector("strong").textContent = "Poptávku se nepodařilo odeslat.";
      success.querySelector("span").textContent = "Zkontrolujte prosím připojení k internetu a zkuste to znovu.";
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
