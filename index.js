const searchInput = document.querySelector(".search__input");
const autocomplete = document.querySelector(".search__autocomplete");
const URL = "https://api.github.com/search/repositories";
const temp = document.getElementById("save-box-elem").content;
const saveBox = document.querySelector(".save-box");

function debounce(func, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function clearAutocomplete() {
  while (autocomplete.firstChild) {
    autocomplete.removeChild(autocomplete.firstChild);
  }
}

function createCard(x) {
  const card = temp.cloneNode(true);
  card.querySelector(".save-box__name").textContent = x.name;
  card.querySelector(".save-box__owner").textContent = x.owner.login;
  card.querySelector(".save-box__stars").textContent = x.stargazers_count;
  saveBox.appendChild(card);
  clearAutocomplete();
  searchInput.value = "";
}

const request = async () => {
  await fetch(`${URL}?q=${searchInput.value}&per_page=5`)
    .then((response) => response.json())
    .then((response) => {
      clearAutocomplete();
      response.items.forEach((x) => {
        const hint = document.createElement("li");
        hint.classList.add("search__hint");
        hint.textContent = x.name;
        autocomplete.appendChild(hint);
        hint.addEventListener("click", () => createCard(x));
      });
    })
    .catch((e) => {
      clearAutocomplete();
    });
};

const reqDebounced = debounce(request, 400);

searchInput.addEventListener("keyup", function () {
  reqDebounced();
});

saveBox.addEventListener("click", function (e) {
  if (e.target.className !== "save-box__delete-btn") return;
  e.target.closest(".save-box__card").remove();
});
