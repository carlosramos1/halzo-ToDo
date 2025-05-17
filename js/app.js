
/**
 * Model
 */
class Task {
  constructor(description) {
    this.id = Math.random()
    this.description = description;
    this.done = false;
  }

  setDone() {
    this.done = true;
  }

  setPending() {
    this.done = false;
  }

  toggleDone() {
    this.done = !this.done;
  }

}


/**
 * Controller
 */
// var listTasksPending = [
//   new Task("Comprar leche y galletas"),
//   new Task("Reparar la gotera del techo del baño"),
//   new Task("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus commodo, justo ut hendrerit venenatis, risus felis accum."),
// ]
// var listTasksDone = [
//   new Task("Comprar leche y galletas"),
//   new Task("Comprar comida para el gato"),
// ]
// listTasksDone.forEach(task => task.setDone());
// var allTasks = listTasksPending.concat(listTasksDone);
var allTasks = [];
loadTasks();

var divListTasksPending = document.getElementById("listTasksPending");
var divListTaskDone = document.getElementById("listTasksDone");

document.getElementById('formAddTask').addEventListener('submit', (e) => {e.preventDefault()})

/** Llenado inicial de las tareas */
for(let task of allTasks) {
  printTask(task);
}
updateTextCounterTaskPending();
updatePercentageTaskDone();
/******************************** */

function eventDoneOrRestoreTask (task, btnDoneRestore, articleTask) {
  btnDoneRestore.addEventListener('click', function(e) {
    task = toggleDoneTask(task);
    articleTask.remove();
    printTask(task);
    // console.table(allTasks);
  });
}

function eventDeleteTask(task, btnDelete, articleTask) {
  btnDelete.addEventListener('click', function(e) {
    deleteTask(task.id);
    articleTask.remove();
    // console.table(allTasks);
    updateTextCounterTaskPending();
    updatePercentageTaskDone();
  })
}

function eventEditTask(task, pTask) {
  pTask.addEventListener('blur', function(e) {
    var newDescription = pTask.innerText.trim();
    if ( msg = validateText(newDescription)) {
      showErrorMsg(msg);
      pTask.innerText = task.description;
    } else {
      editTask(task, newDescription);
      pTask.innerText = newDescription; // Eliminando el formato de texto
    }
  })
  
  pTask.addEventListener('keydown', function(e) {
    if(e.key == "Enter") {
      e.preventDefault();
      pTask.blur();
    }
  })
}


function eventSaveTask(inputText) {
  inputText.addEventListener('keyup', function(e) {

    if(e.key == "Enter") {
      // Validation
      var text = inputText.value.trim();
      if ( msg = validateText(text)) {
        showErrorMsg(msg);
      } else {
        var task = addTask(text);
        printTask(task);
        inputText.value = "";
        inputText.blur();
      }
    }

    showOrHiddenBtnClear(inputText.value.trim())

  })
}

function eventClearText(btnClearText, inputText) {
  btnClearText.addEventListener('click', function(e) {
    inputText.value = "";
  })
}


/**
 * Service
 */
function findTask(id) {
  return  allTasks.find(task => task.id == id);
}

function deleteTask(id) {
  allTasks = allTasks.filter(task => task.id != id)
  persistTasks();
}

function addTask(description) {
  var task = new Task(description);
  allTasks.push(task);
  persistTasks();
  return task;
}

function editTask(task, newDescription) {
  if(task) {
    task.description = newDescription;
    persistTasks();
  }
}

function toggleDoneTask(task) {
  task.toggleDone();
  persistTasks();
  return task;
}

function countTaskPendient() {
  var count = allTasks.filter(task => !task.done).length;
  return count;
}

function calcPercentageTaskDone() {
  if(allTasks.length == 0) {
    return 0;
  }
  var totalTasks = allTasks.length;
  var totalTasksDone = allTasks.filter(task => task.done).length;
  var percentage = (totalTasksDone / totalTasks) * 100;
  percentage = Math.round(percentage);
  return percentage;
}

function validateText(text) {
  var errorMsg = "";
  if (text.length == "") {
    errorMsg = "El campo no puede estar vacío.";
  } else if (text.length > 450) {
    errorMsg = "El campo no puede tener más de 450 carácteres.";
  }
  return errorMsg;
}


/**
 * Repository
 */
function persistTasks() {
  localStorage.setItem('tasks', JSON.stringify(allTasks));
}

function loadTasks() {
  var tasks = JSON.parse(localStorage.getItem('tasks'));
  if(tasks) {
    allTasks = tasks.map(task => {
      var taskInstance = new Task(task.description);
      taskInstance.id = task.id;
      taskInstance.done = task.done;
      return taskInstance;
    });
  }
}


/**
 * View
 */
function printTask(task) {
  var articleTask = document.createElement('article');
  articleTask.classList.add('task');
  articleTask.id = task.id;

  var pText = document.createElement('p');
  pText.innerText = task.description;
  if(task.done) {
    pText.classList.add('completed');
  } else {
    pText.setAttribute('contenteditable', '');
  }

  var btnDoneRestore = document.createElement('button');
  if(task.done) {
    btnDoneRestore.classList.add('btn-restore');
    btnDoneRestore.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fb713b"><path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/></svg>'
  } else {
    btnDoneRestore.classList.add('btn-done');
    btnDoneRestore.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z"/></svg>'
  }

  var btnDelete = document.createElement('button');
  btnDelete.classList.add('btn-delete');
  btnDelete.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#cd3c04"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>'
  
  articleTask.appendChild(pText);
  articleTask.appendChild(btnDoneRestore);
  articleTask.appendChild(btnDelete);

  if(task.done) {
    divListTaskDone.appendChild(articleTask);
  } else {
    divListTasksPending.appendChild(articleTask);
  }

  eventDoneOrRestoreTask(task, btnDoneRestore, articleTask);
  eventDeleteTask(task, btnDelete, articleTask);
  eventEditTask(task, pText);

  updateTextCounterTaskPending();
  updatePercentageTaskDone();
}

/**
 * Input add task
 */
var inputAddTask = document.querySelector('.field-add-task input');
eventSaveTask(inputAddTask);

var btnClearText = document.querySelector('.field-add-task svg');
eventClearText(btnClearText, inputAddTask);

function updateTextCounterTaskPending() {
  var textCounter = document.querySelector('.summary-info-text strong');
  var counter = countTaskPendient();
  textCounter.innerText = counter;
}

function updatePercentageTaskDone() {
  var textPercentage = document.querySelector('.circle-percent p');
  var percentage = calcPercentageTaskDone();
  textPercentage.innerText = percentage + "%";

  const circle = document.querySelector('.circle-percent');
  circle.removeChild(circle.lastChild);
  const radius = 21;
  const circumference = 2 * Math.PI * radius;
  const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  progressCircle.setAttribute("width", "50");
  progressCircle.setAttribute("height", "50");
  const circlePath = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circlePath.setAttribute("cx", "25");
  circlePath.setAttribute("cy", "25");
  circlePath.setAttribute("r", radius);
  circlePath.setAttribute("stroke", "#fb5f22");
  circlePath.setAttribute("stroke-width", "5");
  circlePath.setAttribute("fill", "none");
  circlePath.style.transition = "stroke-dashoffset 0.5s ease-in-out";
  
  progressCircle.appendChild(circlePath);
  circle.appendChild(progressCircle);
  
  const offset = circumference - (percentage / 100 * circumference);
  circlePath.style.strokeDasharray = circumference;
  circlePath.style.strokeDashoffset = offset;
}

/**
 * Error message validation
 */
var alertBox = document.querySelector('.alert')
var alertText = document.querySelector('.alert p');
function showErrorMsg(msg) {
  alertBox.classList.add('show')
  alertText.innerText = msg;
  setTimeout(() => {
    alertBox.classList.remove('show')
  }, 4000);
}

function showOrHiddenBtnClear(text) {
  var btnClearText = document.querySelector('.field-add-task svg');
  if(text.length > 0) {
    btnClearText.classList.add('show-element')
  } else {
    btnClearText.classList.remove('show-element')
  }
}

/**
 * Show modal new task
 */
// var btnAddTask = document.querySelector('.add-task');
// btnAddTask.addEventListener('click', function(e){
//   var modal = document.getElementById('modalAddTask');
//   modal.style.visibility = "visible";
//   var textarea = document.querySelector('.modal-newtask textarea');
//   textarea.value = ""
// })

// var btnCloseModal = document.querySelector('#modalAddTask .btn-close-modal');
// btnCloseModal.addEventListener('click', closeModal);
// var btnCancelModal = document.querySelector('#modalAddTask .btn-cancel');
// btnCancelModal.addEventListener('click', closeModal);
// // var modal = document.getElementById('modalAddTask');
// // modal.addEventListener('click', closeModal);

// function closeModal() {
//   var modal = document.getElementById('modalAddTask');
//   modal.style.visibility = "hidden";
// }

// var btnSaveModal = document.querySelector('#modalAddTask .btn-save');
// eventSaveTask(btnSaveModal)

// btnSaveModal.addEventListener('click', function(e) {
//   var text = document.querySelector('.modal-newtask textarea').value;

//   // Validation
//   if(text.length > 150) {
//     var errorText = document.querySelector('#modalAddTask small')
//     errorText.style.color = 'var(--color-primary)'
//     setTimeout(()=>{errorText.style.color = 'var(--color-surface-a50)'}, 1000)
//   } else if (text != "") {
//     var task = addTask(text);
//     printTask(task);
//     closeModal();
//   } else if (text == "") {
//     closeModal();
//   }
// })


// OPCION A RECUPERAR UNA TAREA ELIMINADA
// Verificar inyeccion de codigo <script>alert("hack")</script>