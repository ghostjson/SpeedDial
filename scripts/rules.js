const addRuleButton = document.querySelector("#add-rule");
const closeButton = document.querySelector("#close-dialog");
const addRuleSubmit = document.querySelector("#add-rule-button");
const rulesList = document.querySelector("#rules-list");

// open add rule dialog
addRuleButton.addEventListener("click", () => {
  document.querySelector("dialog").setAttribute("open", "");
});

// close add rule dialog
closeButton.addEventListener("click", () => {
  document.querySelector("dialog").removeAttribute("open");
});

// add a new rule
addRuleSubmit.addEventListener("click", () => {
  const keywords = document.querySelector("#keywords").value;
  const url = document.querySelector("#url").value;

  chrome.storage.sync.get(["rules"], (result) => {
    const rules = result["rules"] || {};
    rules[keywords] = url;

    chrome.storage.sync.set({ rules: rules });

    document.querySelector("dialog").removeAttribute("open");

    updateRulesList();
  });
});

// load rules
chrome.storage.sync.get(["rules"], (item) => {
  updateRulesList(item["rules"]);
});

// list all rules
const updateRulesList = (rules) => {
  rulesList.innerHTML = "";

  chrome.storage.sync.get(["rules"], (result) => {
    const rules = result["rules"];
    Object.keys(rules).forEach((keyword) => {
      rulesList.innerHTML += `<tr>
            <td>${keyword}</td>
            <td>${rules[keyword]}</td>
            <td class='delete' id='delete-${keyword}' keyword=${keyword}>
              X
            </td>
          </tr>`;
    });

    Object.keys(rules).forEach((keyword) => {
      document
        .querySelector(`#delete-${keyword}`)
        .addEventListener("click", function () {
          const keyword = this.getAttribute("keyword");
          delete rules[keyword];

          chrome.storage.sync.set({ rules: rules });
          updateRulesList();
        });
    });
  });
};
