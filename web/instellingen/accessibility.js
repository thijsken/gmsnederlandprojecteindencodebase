// accessibility.js
document.addEventListener("DOMContentLoaded", () => {
  const ACCESS_KEY = "accessibilitySettings";

  function applySettings(settings) {
    if (settings.contrast === "hoog") {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }

    document.documentElement.style.fontSize = settings.fontSize === "groot" ? "18px" :
                                               settings.fontSize === "extra" ? "20px" : "16px";
  }

  function loadSettings() {
    const settings = JSON.parse(localStorage.getItem(ACCESS_KEY));
    if (settings) {
      applySettings(settings);
    }
  }

  loadSettings();
});
