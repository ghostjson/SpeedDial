const searchButton = document.querySelector("a#search-button");
const listButton = document.querySelector("a#list-button");
const searchInput = document.querySelector("input#search-input");
const resultsContainer = document.querySelector(".results-container");
const resultsList = document.querySelector("#results");

/**
 * Search
 */
searchButton.addEventListener("click", async () => {
  const query = searchInput.value;
  let url = null;

  // if the search has in history
  if (query.includes("in") && query.includes("history")) {
    const q = query.replace("in", "").replace("history", "");
    console.log(q);
    searchInHistory(q);
  }
  // if the search has in
  else if (query.includes("in") && (await searchInEngine(query))) {
    url = await searchInEngine(query);
  } else if (await serachInRules(query)) {
    // if it is keyword
    url = await serachInRules(query);
  } else {
    // if not a keyword search in recent history if not found, search in google
    url = await searchInGoogle(query);
  }

  chrome.tabs.update({ url });
});

/**
 * List from history
 */
listButton.addEventListener("click", () => {
  const query = searchInput.value;

  searchInHistory(query);
});

// on load
window.onload = () => {
  // if enter key is pressed
  window.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      searchButton.click();
    }
  });
};

// search in given search engine
const searchInEngine = async (query) => {
  return new Promise((resolve, reject) => {
    let url = null;
    chrome.storage.sync.get(["search"], (result) => {
      const searches = result["search"];
      Object.keys(searches).forEach((key) => {
        if (query.includes(key)) {
          const newQuery = query.replace("in", "").replace(key, "");
          url = searches[key].replace("$1", newQuery);
        }
      });
      url ? resolve(url) : resolve(false);
    });
  });
};

// search in given keywords
const serachInRules = async (query) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["rules"], async (result) => {
      console.log(result);
      rules = result["rules"];
      if (query in rules) {
        resolve(rules[query]);
      } else {
        resolve(false);
      }
    });
  });
};

// search in history or fallback to google
const searchInGoogle = async (query) => {
  return new Promise((resolve, reject) => {
    resolve(`https://www.google.com/search?q=${query}`);
  });
};

const searchInHistory = async (query) => {
  resultsContainer.style.display = "block";
  resultsList.innerHTML = "";
  chrome.history.search(
    {
      text: query.trim(),
    },
    (results) => {
      console.log(results);
      if (results.length > 0) {
        results.forEach((result) => {
          resultsList.innerHTML += `<li>
					<a href='${result.url}'>${result.title}</a>	
				</li>`;
        });
      } else {
        resultsList.innerHTML += "No results found";
      }
    }
  );
};
