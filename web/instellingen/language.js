// language.js - Centrale taalmanager voor GMSNederland

// ------------------
// Vertalingen
// ------------------
const translations = {
  nl: {
    pageTitle: "Account Instellingen",
    saveBtn: "Opslaan",
    logout: "Uitloggen",
    language: "Taal",
    security: "Beveiliging",
    accessibility: "Toegankelijkheid",
    appearance: "Vormgeving",
    unlockProducts: "Unlock Producten",
    about: "Over | GMSNederland",
    back: "Terug",
    currentPassword: "Huidig wachtwoord",
    newPassword: "Nieuw wachtwoord",
    confirmPassword: "Bevestig wachtwoord",
    changePassword: "Wachtwoord wijzigen",
    resetPassword: "Wachtwoord Reset",
    twoFactor: "Tweestapsverificatie activeren",
    deviceManagement: "Apparaten beheren",
    chooseLanguage: "Kies uw taal",
    selectLanguage: "Selecteer Taal",
    restoreDefault: "Herstel Standaard",
    profileSettings: "Profiel Instellingen",
    updateProfile: "Profiel bijwerken",
    noProducts: "U heeft nog geen producten aangeschaft.",
    buyNow: "Koop Nu",
    upgradePackage: "Upgrade naar een uitgebreider pakket",
    cancelProduct: "Product opzeggen",
    accessibilityTitle: "Toegankelijkheidsinstellingen",
    fontSize: "Lettergrootte",
    contrast: "Hoog contrast modus",
    screenReader: "Schermlezer ondersteuning"
  },
  en: {
    pageTitle: "Account Settings",
    saveBtn: "Save",
    logout: "Logout",
    language: "Language",
    security: "Security",
    accessibility: "Accessibility",
    appearance: "Appearance",
    unlockProducts: "Unlock Products",
    about: "About | GMSNederland",
    back: "Back",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    changePassword: "Change Password",
    resetPassword: "Reset Password",
    twoFactor: "Enable Two-Factor Authentication",
    deviceManagement: "Manage Devices",
    chooseLanguage: "Choose your language",
    selectLanguage: "Select Language",
    restoreDefault: "Restore Default",
    profileSettings: "Profile Settings",
    updateProfile: "Update Profile",
    noProducts: "You haven’t purchased any products yet.",
    buyNow: "Buy Now",
    upgradePackage: "Upgrade to a higher package",
    cancelProduct: "Cancel Product",
    accessibilityTitle: "Accessibility Settings",
    fontSize: "Font Size",
    contrast: "High Contrast Mode",
    screenReader: "Screen Reader Support"
  }
};

// ------------------
// Functies
// ------------------

/**
 * Huidige taal ophalen.
 * @returns {string} Taalcode
 */
function getCurrentLanguage() {
  const lang = localStorage.getItem("userLanguage");
  return lang && translations[lang] ? lang : "nl";
}

/**
 * Taal instellen en vertalingen toepassen.
 * @param {string} lang - Taalcode
 */
function setLanguage(lang) {
  if (!translations[lang]) {
    console.warn(`[language.js] Taal "${lang}" bestaat niet. Standaard wordt "nl" gebruikt.`);
    lang = "nl";
  }
  localStorage.setItem("userLanguage", lang);
  applyTranslations();
}

/**
 * Vertalingen toepassen op elementen met data-i18n attribuut.
 */
function applyTranslations() {
  const lang = getCurrentLanguage();
  const t = translations[lang] || translations.nl;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) {
      el.textContent = t[key];
    } else {
      console.warn(`[language.js] Geen vertaling gevonden voor key "${key}" in taal "${lang}"`);
      el.textContent = translations.nl[key] || key; // fallback
    }
  });
}

// ------------------
// Auto toepassen bij DOM load
// ------------------
document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();
});

// Maak functies globaal beschikbaar
window.getCurrentLanguage = getCurrentLanguage;
window.setLanguage = setLanguage;
window.applyTranslations = applyTranslations;
window.translations = translations;
