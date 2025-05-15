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

var listTasks = [
  new Task("Comprar leche y galletas"),
  new Task("Reparar la gotera del techo del baño"),
  new Task("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus commodo, justo ut hendrerit venenatis, risus felis accum.")
]


