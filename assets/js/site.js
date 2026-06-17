function splitDatasetValues(value) {
  return (value || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
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

    const updateSearch = () => {
      const query = input.value.trim().toLowerCase();

      if (!query) {
        results.hidden = true;
        cards.forEach((card) => {
          card.hidden = false;
        });
        empty.hidden = true;
        summary.textContent = "0 results";
        return;
      }

      let visibleCount = 0;
      results.hidden = false;

      cards.forEach((card) => {
        const matches = (card.dataset.search || "").includes(query);
        card.hidden = !matches;
        if (matches) {
          visibleCount += 1;
        }
      });

      summary.textContent = `${visibleCount} result${visibleCount === 1 ? "" : "s"}`;
      empty.hidden = visibleCount !== 0;
    };

    input.addEventListener("input", updateSearch);
    input.addEventListener("search", updateSearch);
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
