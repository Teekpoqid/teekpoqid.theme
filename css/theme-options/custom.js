(function () {
  const CUSTOM_LOGO_URL = "https://teekpoqid.github.io/resources/ap.jpg"; // Change this

  const waitForElement = (selector, root = document, timeout = 10000) =>
    new Promise((resolve, reject) => {
      const interval = 100;
      let elapsed = 0;
      const timer = setInterval(() => {
        const element = root.querySelector(selector);
        if (element) {
          clearInterval(timer);
          resolve(element);
        }
        elapsed += interval;
        if (elapsed >= timeout) {
          clearInterval(timer);
          reject(`Timeout waiting for: ${selector}`);
        }
      }, interval);
    });

  const modifyHeader = async () => {
    // Remove header logo and link
    const header = document.querySelector("#header");
    if (header) header.style.display = "none";

    // Add custom logo elsewhere (optional)
    const newLogo = document.createElement("img");
    newLogo.src = CUSTOM_LOGO_URL;
    newLogo.alt = "My Logo";
    newLogo.style.height = "32px";
    newLogo.style.marginRight = "12px";

    // Add to footer
    const footer = document.querySelector("#footer");
    if (footer) {
      footer.prepend(newLogo);
    }
  };

  const moveUptimeToFooter = async () => {
    const userProfileEl = await waitForElement("unraid-user-profile");

    const attemptMove = () => {
      const shadow = userProfileEl.shadowRoot;
      if (!shadow) return false;

      const uptimeP = shadow.querySelector('p[title^="Server Up Since"]');
      const footer = document.querySelector("#footer");

      if (uptimeP && footer && !document.getElementById("custom-uptime")) {
        const cloned = uptimeP.cloneNode(true);
        cloned.id = "custom-uptime";
        cloned.style.marginLeft = "auto";
        cloned.style.fontSize = "12px";
        cloned.style.color = "#aaa";
        footer.appendChild(cloned);
        return true;
      }
      return false;
    };

    const maxAttempts = 30;
    let attempts = 0;
    const interval = setInterval(() => {
      if (attemptMove() || attempts++ > maxAttempts) {
        clearInterval(interval);
      }
    }, 300);
  };

  // Kick everything off
  window.addEventListener("DOMContentLoaded", () => {
    modifyHeader();
    moveUptimeToFooter();
  });
})();

const removeFooterCopyright = () => {
  const footer = document.querySelector("#footer");
  if (!footer) return;

  const spanElements = footer.querySelectorAll("span");
  spanElements.forEach((el) => {
    if (
      el.textContent.includes("Unraid") ||
      el.textContent.includes("Lime Technology") ||
      el.textContent.toLowerCase().includes("manual")
    ) {
      el.remove(); // Completely remove the element
    }
  });
};

window.addEventListener("DOMContentLoaded", () => {
  modifyHeader();
  moveUptimeToFooter();
  removeFooterCopyright(); // Add this
});

