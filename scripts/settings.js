const searchEngineName = document.querySelector("#search-engine-name");
const searchEngineURL = document.querySelector("#search-engine-url");
const searchEngineButton = document.querySelector("#search-engine-button");
const searchList = document.querySelector("#search-list");

chrome.storage.sync.get(["search"], (item) => {
  const searches = item["search"];

  updateSearchList(searches);
});

searchEngineButton.addEventListener("click", () => {
  const name = searchEngineName.value;
  const url = searchEngineURL.value;

  chrome.storage.sync.get(["search"], (item) => {
    const search = item["search"] || {};
    search[name] = url;
    chrome.storage.sync.set({ search: search });

    updateSearchList(search);
  });
});

const updateSearchList = (searches) => {
  searchList.innerHTML = "";
  Object.keys(searches).forEach((key) => {
    searchList.innerHTML += `<li style='display:flex'>${key} - ${searches[key]}
      <div class='delete' id='delete-${key}' keyword=${key}>
        X
      </div> 
    </li>`;
  });

  Object.keys(searches).forEach((key) => {
    document
      .querySelector(`#delete-${key}`)
      .addEventListener("click", function () {
        const key = this.getAttribute("keyword");
        delete searches[key];

        chrome.storage.sync.set({ search: searches });
        updateSearchList(searches);
      });
  });
};
