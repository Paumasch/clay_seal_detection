translatePage();

const languageButton = document.getElementById("languageButton");
const languageMessage = document.getElementById("languageMessage");

function toggleLanguageMessage(event) {
  event.stopPropagation();

  const isHidden = languageMessage.hidden;
  languageMessage.textContent = STRINGS[currentLanguage].languagePlaceholder;
  languageMessage.hidden = !isHidden;
  languageButton.setAttribute("aria-expanded", String(isHidden));
}

function hideLanguageMessage() {
  languageMessage.hidden = true;
  languageButton.setAttribute("aria-expanded", "false");
}

languageButton.addEventListener("click", toggleLanguageMessage);
document.addEventListener("click", hideLanguageMessage);
