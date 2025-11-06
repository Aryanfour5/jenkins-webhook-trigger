// Update last update time
function updateLastUpdate() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const timeString = `${hours}:${minutes}`;

  const updateElements = document.querySelectorAll("#lastUpdate");
  updateElements.forEach((el) => {
    el.textContent = timeString;
  });
}

// Get current page name
function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split("/").pop();
  return page || "index.html";
}

// Set active navigation link
function setActiveNavLink() {
  const currentPage = getCurrentPage();
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");

    // Handle root path
    if ((currentPage === "" || currentPage === "/") && href === "index.html") {
      link.classList.add("active");
    } else if (href === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded:", getCurrentPage());

  // Update time immediately
  updateLastUpdate();

  // Update every minute
  setInterval(updateLastUpdate, 60000);

  // Set active nav link
  setActiveNavLink();
});

// Also update active link on page visibility change
document.addEventListener("visibilitychange", function () {
  if (!document.hidden) {
    updateLastUpdate();
    setActiveNavLink();
  }
});
