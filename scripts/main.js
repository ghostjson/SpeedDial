window.addEventListener("keyup", (event) => {
  if (event.altKey && event.key === "1") {
    document.querySelector("#nav-home").click();
  }
});
window.addEventListener("keyup", (event) => {
  if (event.altKey && event.key === "2") {
    document.querySelector("#nav-keywords").click();
  }
});
window.addEventListener("keyup", (event) => {
  if (event.altKey && event.key === "3") {
    document.querySelector("#nav-settings").click();
  }
});
