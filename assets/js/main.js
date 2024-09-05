// Funzione per caricare un componente in una specifica destinazione
function loadComponent(targetId, filePath) {
  fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Errore nel caricamento del componente: ${filePath}`);
      }
      return response.text();
    })
    .then((data) => {
      // Inserisce il contenuto del componente all'ID specificato
      document.getElementById(targetId).innerHTML = data;
    })
    .catch((error) => {
      console.error("Errore:", error);
    });
}

// Funzione per gestire la navigazione verso una pagina specifica
function navigateTo(page, addToHistory = true) {
  const contentElement = document.getElementById("content");
  const pagePath = `components/${page}.html`;

  fetch(pagePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Errore nel caricamento della pagina: ${pagePath}`);
      }
      return response.text();
    })
    .then((data) => {
      // Inserisce il contenuto della pagina in "#content"
      contentElement.innerHTML = data;
      // Aggiorna l'URL della pagin e aggiunge l'entry alla cronologia del browser
      if (addToHistory) {
        history.pushState({ page: page }, null, page); // Aggiorna l'URL senza il #
      }
    })
    .catch((error) => {
      console.error("Errore:", error);
    });
}

// Listener sul body che intercetta tutti i click sui link con l'attributo data-page, utilizzando la delegazione degli eventi.
//  (Listener su elemento padre anzichè su ogni link. Event bubbling: i click si propagano verso l'alto e vengono catturati dall'elemento padre)
document.body.addEventListener("click", function (event) {
  const target = event.target.closest("a[data-page]");
  // Se un link con l'attributo data-page è stato cliccato (quindi esiste "target"), procede con la navigazione
  if (target) {
    event.preventDefault(); // Previene il comportamento di default del link
    const page = target.getAttribute("data-page"); // Recupera il valore dell'attributo data-page
    navigateTo(page);

    // Chiudi la navbar se è aperta (in mobile)
    const navbarCollapse = document.querySelector(".navbar-collapse");
    if (navbarCollapse.classList.contains("show")) {
      const bsCollapse = new bootstrap.Collapse(navbarCollapse);
      bsCollapse.hide();
    }
  }
});

// Gestisce la navigazione con i pulsanti avanti/indietro
window.addEventListener("popstate", function (event) {
  // Usa info memorizzate con history.pushState
  if (event.state && event.state.page) {
    // Naviga alla pagina senza aggiungerla di nuovo alla cronologia
    navigateTo(event.state.page, false);
  }
});

// Carica navbar, footer e la home al caricamento della pagina
loadComponent("navbar", "components/navbar.html");
loadComponent("footer", "components/footer.html");
navigateTo("home");
