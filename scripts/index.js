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

  // if the search has in
  if (query.includes("in") && (await searchInEngine(query))) {
    url = await searchInEngine(query);
  } else if (await serachInRules(query)) {
    // if it is keyword
    url = await serachInRules(query);
  } else {
    // if not a keyword search in recent history if not found, search in google
    url = await searchInHistory(query);
  }

  chrome.tabs.update({ url });
});

/**
 * List from history
 */
listButton.addEventListener("click", () => {
  const query = searchInput.value;
  resultsContainer.style.display = "block";
  resultsList.innerHTML = "";

  chrome.history.search(
    {
      text: query,
    },
    (results) => {
      if (results.length > 0) {
        results.forEach((result) => {
          resultsList.innerHTML += `<li>
					<a href='${result.url}'>${result.title}</a>	
				</li>`;
        });
      } else {
      }
    }
  );
});

// on load
window.onload = () => {
  // if enter key is pressed
  searchInput.addEventListener("keydown", (event) => {
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
const searchInHistory = async (query) => {
  return new Promise((resolve, reject) => {
    chrome.history.search(
      {
        text: query,
      },
      (results) => {
        if (results.length > 0) {
          const urlParts = results[0].url.split("/");

          let url = `${urlParts[0]}/`;

          const urlUpto = 2;
          for (let i = 2; i < 2 + urlUpto; i++) {
            url += "/" + urlParts[i];
          }

          resolve(url);
        } else {
          resolve(`https://www.google.com/search?q=${query}`);
        }
      }
    );
  });
};
