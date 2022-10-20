const searchButton = document.querySelector("a#search-button");
const listButton = document.querySelector("a#list-button");
const searchInput = document.querySelector("input#search-input");
const resultsContainer = document.querySelector(".results-container");
const resultsList = document.querySelector("#results");

/**
 * Search
 */
searchButton.addEventListener("click", () => {
  const query = searchInput.value;

  chrome.storage.sync.get(["rules"], (result) => {
    rules = result["rules"];
    if (query in rules) {
      chrome.tabs.create({ url: rules[query] });
      return;
    } else {
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

            chrome.tabs.create({ url });
            return;
          } else {
            chrome.tabs.create({
              url: `https://www.google.com/search?q=${query}`,
            });
          }
        }
      );
    }
  });
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
          console.log(result);
          resultsList.innerHTML += `<li>
					<a href='${result.url}'>${result.title}</a>	
				</li>`;
        });
      } else {
      }
    }
  );
});
