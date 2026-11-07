function splitDatasetValues(value) {
  return (value || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeSearch(value) {
  return value.toLowerCase().normalize("NFKD").replace(/\p{M}/gu, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function setupHomeSearch() {
  document.querySelectorAll("[data-home-search]").forEach((searchRoot) => {
    const input = searchRoot.querySelector("input[type='search']");
    const results = searchRoot.querySelector("[data-search-results]");
    const summary = searchRoot.querySelector("[data-search-summary]");
    const empty = searchRoot.querySelector("[data-search-empty]");
    const cards = Array.from(searchRoot.querySelectorAll("[data-resource-card]"));

    if (!input || !results || !summary || !empty || !cards.length) {
      return;
    }

    const searchText = new Map(cards.map((card) => [card, normalizeSearch(card.dataset.search || "")]));
    const updateSearch = () => {
      const words = normalizeSearch(input.value).split(/\s+/).filter(Boolean);

      if (!words.length) {
        results.hidden = true;
        cards.forEach((card) => {
          card.hidden = false;
        });
        empty.hidden = true;
        summary.textContent = "";
        return;
      }

      let visibleCount = 0;
      results.hidden = false;

      cards.forEach((card) => {
        const matches = words.every((word) => searchText.get(card).includes(word));
        card.hidden = !matches;
        if (matches) {
          visibleCount += 1;
        }
      });

      summary.textContent = `${visibleCount} result${visibleCount === 1 ? "" : "s"}`;
      empty.hidden = visibleCount !== 0;
    };

    const saveSearch = () => {
      const url = new URL(window.location.href);
      if (input.value.trim()) {
        url.searchParams.set("resource-search", input.value.trim());
      } else {
        url.searchParams.delete("resource-search");
      }
      window.history.replaceState(null, "", url);
    };
    const restoreSearch = () => {
      input.value = new URLSearchParams(window.location.search).get("resource-search") || "";
      updateSearch();
    };
    const handleSearch = () => {
      updateSearch();
      saveSearch();
    };

    searchRoot.addEventListener("submit", (event) => {
      event.preventDefault();
      handleSearch();
    });
    input.addEventListener("input", handleSearch);
    input.addEventListener("search", handleSearch);
    window.addEventListener("popstate", restoreSearch);
    window.addEventListener("pageshow", restoreSearch);
    restoreSearch();
  });
}

function setupResourceBrowsers() {
  document.querySelectorAll("[data-resource-browser]").forEach((browser) => {
    const cards = Array.from(browser.querySelectorAll("[data-resource-card]"));
    const groups = Array.from(browser.querySelectorAll("[data-resource-group]"));
    const checkboxes = Array.from(browser.querySelectorAll("input[type='checkbox']"));
    const clearButton = browser.querySelector("[data-clear-filters]");
    const count = browser.querySelector("[data-visible-count]");
    const empty = browser.querySelector("[data-browser-empty]");
    const jumpLinks = browser.querySelector(".jump-links");
    const groupLinks = Array.from(browser.querySelectorAll("[data-group-target]"));

    if (!cards.length || !count || !empty) {
      return;
    }

    const updateBrowser = () => {
      const selectedTags = checkboxes
        .filter((input) => input.checked && input.dataset.filterGroup === "tag")
        .map((input) => input.value);
      const selectedFormats = checkboxes
        .filter((input) => input.checked && input.dataset.filterGroup === "format")
        .map((input) => input.value);

      let visibleCount = 0;

      cards.forEach((card) => {
        const tags = splitDatasetValues(card.dataset.tags);
        const formats = splitDatasetValues(card.dataset.formats);
        const tagMatch = !selectedTags.length || selectedTags.some((tag) => tags.includes(tag));
        const formatMatch = !selectedFormats.length || selectedFormats.some((format) => formats.includes(format));
        const showCard = tagMatch && formatMatch;

        card.hidden = !showCard;
        if (showCard) {
          visibleCount += 1;
        }
      });

      groups.forEach((group) => {
        const visibleCards = Array.from(group.querySelectorAll("[data-resource-card]")).some((card) => !card.hidden);
        group.hidden = !visibleCards;
      });

      groupLinks.forEach((link) => {
        const group = groups.find((item) => item.id === link.dataset.groupTarget);
        link.hidden = !group || group.hidden;
      });
      if (jumpLinks) {
        jumpLinks.hidden = !groupLinks.some((link) => !link.hidden);
      }

      count.textContent = String(visibleCount);
      empty.hidden = visibleCount !== 0;

      if (clearButton) {
        clearButton.disabled = !checkboxes.some((input) => input.checked);
      }
    };

    checkboxes.forEach((input) => {
      input.addEventListener("change", updateBrowser);
    });

    if (clearButton) {
      clearButton.addEventListener("click", () => {
        checkboxes.forEach((input) => {
          input.checked = false;
        });
        updateBrowser();
      });
    }

    updateBrowser();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupHomeSearch();
  setupResourceBrowsers();
});
