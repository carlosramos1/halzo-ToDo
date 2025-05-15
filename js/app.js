class Task {
  constructor(description) {
    this.description = description;
    this.status = "PENDING";
  }

  setStatusDone() {
    this.status = "PENDING";
  }

  setStatusDone() {
    this.status = "DONE"
  }

  getStatus() {
    return this.status;
  }
}

var listTasksPending = [
  new Task("Comprar leche y galletas"),
  new Task("Reparar la gotera del techo del baño"),
  new Task("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus commodo, justo ut hendrerit venenatis, risus felis accum."),
]
var listTasksDone = [
  new Task("Comprar leche y galletas"),
  new Task("Comprar comida para el gato"),
]


var divListTasksPending = document.getElementById("listTasksPending");
var divListTaskDone = document.getElementById("listTasksDone");

var articles = ""
for(let t of listTasksPending) {
  articles = `${articles}
        <article class="task">
          <p>${t.description}</p>
          <button class="btn-done">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z"/></svg>
          </button>
          <button class="btn-delete">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#cd3c04"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
          </button>
        </article>`;
}
divListTasksPending.innerHTML = articles;

var articlesDone = "";
for (let t of listTasksDone) {
  articlesDone = `${articlesDone}
        <article class="task">
          <p class="overline">${t.description}</p>
          <button class="btn-restore">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/></svg>
          </button>
          <button class="btn-delete">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#cd3c04"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
          </button>
        </article>`;
}
divListTaskDone.innerHTML = articlesDone;