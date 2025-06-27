
/**
 * Model
 */
class Task {
  constructor(description) {
    this.id = Math.random()
    this.description = description;
    this.done = false;
    this.delete = false;
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

  remove() {
    this.delete = true;
  }

  undelete() {
    this.delete = false;
  }

  isDeleted() {
    return this.delete;
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

// * Variables Globales
var allTasks = [];


/** Llenado inicial de las tareas */
loadTasks();
refreshData();
/******************************** */

/**
 * All Events
 */
function eventFormAddTask(input) {
  input.addEventListener('submit', (e) => {e.preventDefault()})
}

function eventDoneOrRestoreTask (task, btnDoneRestore, articleTask) {
  btnDoneRestore.addEventListener('click', function(e) {
    task = toggleDoneTask(task);
    articleTask.remove();
    refreshData();
  });
}

function eventDeleteTask(task, btnDelete) {
  btnDelete.addEventListener('click', function(e) {
    deleteTask(task);
    refreshData();
    showAlertMsg("Tarea eliminada.");
  })
}

function eventEditTask(task, pTask) {
  pTask.addEventListener('blur', function(e) {
    var newDescription = pTask.innerText.trim();
    if ( msg = validateText(newDescription)) {
      showAlertMsg(msg);
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

function eventRestoreFromTrash(task, aRestoreTask) {
  aRestoreTask.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    undeleteTask(task);
    refreshData();
    showAlertMsg("Tarea restaurada.");
  })
}

function eventDeleteTaskPermanently(task, btnDeletePermanent) {
  btnDeletePermanent.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (confirm("¿Estás seguro de que deseas eliminar esta tarea permanentemente?")) {
      deleteTaskPermanently(task);
      refreshData();
      showAlertMsg("Tarea eliminada permanentemente.");
    }
  });
}


function eventSaveTask(inputText, btnSaveTask) {
  inputText.addEventListener('keyup', function(e) {
    showOrHiddenBtnClearAndBtnSaveTask(inputText.value.trim())
  })
  
  inputText.addEventListener('blur', function(e) {
    showOrHiddenBtnClearAndBtnSaveTask(inputText.value.trim())
  })

  btnSaveTask.addEventListener('click', function(e) {
    // Este evento igual se activa cuando se presiona Enter en el input
    // console.log("evento click")
    // Validation
    var text = inputText.value.trim();
    if ( msg = validateText(text)) {
      showAlertMsg(msg);
    } else {
      var task = addTask(text);
      refreshData();
      inputText.value = "";
      inputText.blur();
    }
    showOrHiddenBtnClearAndBtnSaveTask(inputText.value.trim())
  })
}

function eventClearText(btnClearText, inputText) {
  btnClearText.addEventListener('click', function(e) {
    inputText.value = "";
    showOrHiddenBtnClearAndBtnSaveTask(inputText.value.trim())
  })
}

function eventShowMenu(menuIcon, menuContainer) {
  menuIcon.addEventListener('click', function(e) {
    menuContainer.classList.add('show');
  })
}

function eventCloseMenu(menuContainer) {
  menuContainer.addEventListener('click', function(e) {
    // se oculta el menu si se hace click en el fondo o en una opción del menu
    if (e.target === menuContainer || Array.from(menuContainer.querySelectorAll('ul li')).some(li => li === e.target || li.contains(e.target))) {
      menuContainer.classList.remove('show');
    }
  })
}

function eventExportTasks(menuExportTasks) {
  menuExportTasks.addEventListener('click', function(e) {
    exportTastks();
    showAlertMsg("Tareas exportadas correctamente.");
  })
}

function eventShowModal(tagClickable, containerModal) {
  tagClickable.addEventListener('click', function(e) {
    containerModal.classList.add('show');
  })
}

function eventCloseModal(containerModal) {
  containerModal.addEventListener('click', function(e) {
    if (e.target === containerModal || 
        e.target.classList.contains('btn-close-modal') || 
        e.target.parentElement.classList.contains('btn-close-modal') || 
        e.target.parentElement.parentElement.classList.contains('btn-close-modal')) {
      containerModal.classList.remove('show');
    }
  })
}

function eventSubmitImportTasks(formImportTasks, fileInput, containerModal) {
  formImportTasks.addEventListener('submit', function(e) {
    e.preventDefault();

    var file = fileInput.files[0];
    //validar el archivo
    if (!file) {
      showAlertMsg("Por favor, selecciona un archivo para importar.");
    } else {
      var reader = new FileReader();
      reader.onload = function(e) {
        try {
          var tasks = JSON.parse(e.target.result);
          if (!Array.isArray(tasks)) {
            throw new Error("El archivo no contiene un formato válido.");
          }
    
          importTasks(tasks);
          fileInput.value = "";
          
          refreshData();
          containerModal.click(); // Cierra el modal
          showAlertMsg("Tareas importadas correctamente.");

        } catch (error) {
          showAlertMsg("Error: " + error.message);
        }
      };
      reader.readAsText(file);
    }
  })
}



/**
 * Service
 */
function findTask(id) {
  return  allTasks.find(task => task.id == id);
}

function deleteTask(task) {
  task.remove();
  bringTaskToEnd(task);
  persistTasks();
}

function addTask(description) {
  var task = new Task(description);
  allTasks.unshift(task);
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
  bringTaskToEnd(task);
  persistTasks();
  return task;
}

function undeleteTask(task) {
  task.undelete();
  task.setPending();
  bringTaskToStart(task);  
  persistTasks();
  return task;
}

function deleteTaskPermanently(task) {
  allTasks = allTasks.filter(t => t.id !== task.id);
  persistTasks();
}

function bringTaskToStart(task) {
  var idx = allTasks.indexOf(task);
  allTasks.splice(idx, 1);
  allTasks.unshift(task);
}

function bringTaskToEnd(task) {
  var idx = allTasks.indexOf(task);
  allTasks.splice(idx, 1);
  allTasks.push(task);
}

function reorderTask(draggedTaskId, targetTaskId) {
  const draggedTask = findTask(draggedTaskId);
  // Solo reordenar tareas pendientes válidas
  if (!draggedTask || draggedTask.done || draggedTask.delete) {
    console.warn("Attempted to reorder a non-pending or invalid task.");
    return;
  }

  const draggedTaskIndex = allTasks.indexOf(draggedTask);
  if (draggedTaskIndex === -1) {
    console.warn("Dragged task not found in allTasks array.");
    return;
  }

  // Eliminar la tarea de su posición original
  allTasks.splice(draggedTaskIndex, 1);

  if (targetTaskId) {
    const targetTask = findTask(targetTaskId);

    // Asegurarse que la tarea destino también sea una tarea pendiente visible y válida
    if (!targetTask || targetTask.done || targetTask.delete) {
        // Si la tarea destino no es válida (ej. se intentó soltar sobre una tarea ya completada o eliminada, o no se encontró)
        // Se coloca al final de las tareas pendientes visibles.
        let firstNonPendingIndex = allTasks.findIndex(t => t.done || t.delete);
        if (firstNonPendingIndex === -1) { // No hay tareas completadas o eliminadas
            allTasks.push(draggedTask); // Añadir al final de allTasks
        } else {
            // Insertar antes de la primera tarea que no es pendiente (o sea, al final de las pendientes)
            allTasks.splice(firstNonPendingIndex, 0, draggedTask);
        }
        return;
    }

    const targetTaskIndex = allTasks.indexOf(targetTask);
    if (targetTaskIndex === -1) { // No debería pasar si findTask la encontró y está en allTasks
        console.warn("Target task valid but not found in allTasks array for splicing.");
        // Fallback: colocarla al final de las tareas pendientes visibles
        let firstNonPendingIndex = allTasks.findIndex(t => t.done || t.delete);
        if (firstNonPendingIndex === -1) { allTasks.push(draggedTask); } else { allTasks.splice(firstNonPendingIndex, 0, draggedTask); }
        return;
    }

    // Insertar la tarea arrastrada antes de la tarea destino
    allTasks.splice(targetTaskIndex, 0, draggedTask);
  } else {
    // Si no hay targetTaskId (se soltó en un área vacía del contenedor),
    // colocarla al final de las tareas pendientes, pero antes de cualquier tarea completada o eliminada.
    let firstNonPendingIndex = allTasks.findIndex(t => t.done || t.delete);
    if (firstNonPendingIndex === -1) { // No hay tareas completadas o eliminadas
        allTasks.push(draggedTask); // Añadir al final de allTasks
    } else {
        allTasks.splice(firstNonPendingIndex, 0, draggedTask); // Insertar antes de la primera no pendiente
    }
  }
}

function countTaskPendient() {
  var count = allTasks.filter(task => !task.delete && !task.done).length;
  return count;
}

function calcPercentageTaskDone() {
  if(allTasks.length == 0 || allTasks.filter(task => !task.delete).length == 0) {
    return 0;
  }
  var totalTasks = allTasks.filter(task => !task.delete).length;
  var totalTasksDone = allTasks.filter(task => task.done && !task.delete).length;
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

function exportTastks() {
  var data = JSON.stringify(allTasks, null, 2);
  var blob = new Blob([data], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'tasks.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importTasks(tasks) {
  allTasks = tasks.map(task => {
    var taskInstance = new Task(task.description);
    taskInstance.id = task.id;
    taskInstance.done = task.done;
    taskInstance.delete = task.delete;
    return taskInstance;
  })
  
  persistTasks();
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
      taskInstance.delete = task.delete;
      return taskInstance;
    });
  }
}


/**
 * View
 */
function refreshData() {
  renderPendingTasks();
  renderCompletedTasks();
  renderDeletedTasks();

  updateTextCounterTaskPending();
  updatePercentageTaskDone();
}

function renderPendingTasks() {
  var divListTasksPending = document.getElementById("listTasksPending");
  divListTasksPending.innerHTML = "";

  // Permitir que la lista de tareas pendientes sea un destino para soltar
  divListTasksPending.addEventListener('dragover', function(event) {
    event.preventDefault(); // Necesario para permitir el drop
    // Opcional: añadir feedback visual al área de drop
    // divListTasksPending.classList.add('drag-over');
  });

  // Opcional: remover feedback visual cuando el elemento arrastrado sale del área
  // divListTasksPending.addEventListener('dragleave', function(event) {
  //   divListTasksPending.classList.remove('drag-over');
  // });

  // Manejar el evento de soltar (drop)
  divListTasksPending.addEventListener('drop', function(event) {
    event.preventDefault();
    // Opcional: remover feedback visual
    // divListTasksPending.classList.remove('drag-over');

    const draggedTaskId = event.dataTransfer.getData('text/plain');
    const targetElement = event.target;

    // Encontrar el article.task más cercano al targetElement, ya que el evento.target podría ser un hijo del article
    let targetTaskElement = targetElement;
    while (targetTaskElement && !targetTaskElement.classList.contains('task')) {
      targetTaskElement = targetTaskElement.parentElement;
    }

    const targetTaskId = targetTaskElement ? targetTaskElement.id : null;

    if (draggedTaskId !== targetTaskId) { // Evitar soltar sobre sí mismo o fuera de una tarea válida
        reorderTask(draggedTaskId, targetTaskId);
        persistTasks();
        refreshData(); // Renderizar de nuevo para mostrar el orden actualizado
    }
  });

  allTasks.filter(task => !task.done && !task.delete).forEach(task => {
    var articleTask = document.createElement('article');
    articleTask.classList.add('task');
    articleTask.id = task.id;

    var dragHandle = document.createElement('span');
    dragHandle.classList.add('drag-handle');
    dragHandle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#929197"><path d="M360-240v-80h240v80H360Zm0-200v-80h240v80H360Zm0-200v-80h240v80H360Z"/></svg>';
    // Atributos y eventos de arrastre se añadirán en el siguiente paso del plan

    var pTask = document.createElement('p');
    pTask.innerText = task.description;
    pTask.setAttribute('contenteditable', '');

    // Hacer el manejador arrastrable
    dragHandle.setAttribute('draggable', 'true');
    dragHandle.addEventListener('dragstart', function(event) {
      event.dataTransfer.setData('text/plain', task.id);
      // Opcional: añadir una clase para feedback visual mientras se arrastra
      // articleTask.classList.add('dragging');
    });

    // Opcional: remover clase de feedback visual cuando termina el arrastre
    // dragHandle.addEventListener('dragend', function(event) {
    //   articleTask.classList.remove('dragging');
    // });

    var btnDoneRestore = document.createElement('button');
    btnDoneRestore.classList.add('btn-done');
    btnDoneRestore.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z"/></svg>'
    
    var btnDelete = document.createElement('button');
    btnDelete.classList.add('btn-delete');
    btnDelete.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#cd3c04"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>'
    
    articleTask.appendChild(dragHandle); // Añadir el manejador de arrastre
    articleTask.appendChild(pTask);
    articleTask.appendChild(btnDoneRestore);
    articleTask.appendChild(btnDelete);
    divListTasksPending.appendChild(articleTask);

    eventDoneOrRestoreTask(task, btnDoneRestore, articleTask);
    eventDeleteTask(task, btnDelete);
    eventEditTask(task, pTask);  
  });
}

function renderCompletedTasks() {
  var divListTaskDone = document.getElementById("listTasksDone");
  divListTaskDone.innerHTML = "";

  allTasks.filter(task => task.done && !task.delete).forEach(task => {
    var articleTask = document.createElement('article');
    articleTask.classList.add('task');
    articleTask.id = task.id;

    var pTask = document.createElement('p');
    pTask.innerText = task.description;
    pTask.classList.add('completed');

    var btnDoneRestore = document.createElement('button');
    btnDoneRestore.classList.add('btn-restore');
    btnDoneRestore.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fb713b"><path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/></svg>'

    var btnDelete = document.createElement('button');
    btnDelete.classList.add('btn-delete');
    btnDelete.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#cd3c04"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>'
    
    articleTask.appendChild(pTask);
    articleTask.appendChild(btnDoneRestore);
    articleTask.appendChild(btnDelete);
    divListTaskDone.appendChild(articleTask);

    eventDoneOrRestoreTask(task, btnDoneRestore, articleTask);
    eventDeleteTask(task, btnDelete);
  })
}

function renderDeletedTasks() {
  var divListDeletedTasks = document.getElementById("listDeletedTasks");
  divListDeletedTasks.innerHTML = "";

  allTasks.filter(task => task.delete).forEach(task => {
    var articleTask = document.createElement('article');
    articleTask.classList.add('task');
    articleTask.id = task.id;
  
    var pTask = document.createElement('p');
    pTask.innerText = task.description;
  
    var aRestoreTask = document.createElement('a');
    aRestoreTask.href = "#";
    aRestoreTask.innerText = "Restaurar";
  
    var btnDeletePermanent = document.createElement("a");
    btnDeletePermanent.href = "#";
    btnDeletePermanent.classList.add("color-primary-m-1", "btn-delete-permanent");
    btnDeletePermanent.innerText = "Eliminar";
  
    articleTask.appendChild(pTask);
    articleTask.appendChild(aRestoreTask);
    articleTask.appendChild(btnDeletePermanent);
    divListDeletedTasks.appendChild(articleTask);
  
    eventRestoreFromTrash(task, aRestoreTask);
    eventDeleteTaskPermanently(task, btnDeletePermanent)
  })
}



/**
 * Menu
 */
var menuIcon = document.querySelector('.menu-icon');
var menuContainer = document.querySelector('.menu-container');
eventShowMenu(menuIcon, menuContainer);
eventCloseMenu(menuContainer);

var menuExportTasks = document.querySelector('.menu .export-tasks');
eventExportTasks(menuExportTasks, menuContainer);

/* Modal Import Tasks */
var menuImportTasks = document.querySelector('.menu .import-tasks');
var containerModalImport = document.getElementById('containerModalImport');
eventShowModal(menuImportTasks, containerModalImport);
eventCloseModal(containerModalImport);

var formImportTasks = document.getElementById('formImportTasks');
var fileInput = document.getElementById('fileImport');
eventSubmitImportTasks(formImportTasks, fileInput, containerModalImport);

/* Modal Trash Tasks */
var menuDeletedTasks = document.querySelector('.menu .trash-tasks')
var containerModalTrashTasks = document.getElementById('containerModalTrashTasks')
eventShowModal(menuDeletedTasks, containerModalTrashTasks);
eventCloseModal(containerModalTrashTasks)

/**
 * Input add task
 */
var formAddTask = document.getElementById('formAddTask');
eventFormAddTask(formAddTask);

var inputAddTask = document.querySelector('.field-add-task input');
var btnAddTask = document.querySelector('.field-add-task button');
eventSaveTask(inputAddTask, btnAddTask);

var btnClearText = document.querySelector('.field-add-task svg');
eventClearText(btnClearText, inputAddTask);

function showOrHiddenBtnClearAndBtnSaveTask(text) {
  var btnClearText = document.querySelector('.field-add-task svg');
  var btnSaveTask = document.querySelector('.field-add-task button');
  if(text.length > 0) {
    btnClearText.classList.add('show-element')
    btnSaveTask.classList.add('show-element');
  } else {
    btnClearText.classList.remove('show-element')
    btnSaveTask.classList.remove('show-element');
  }
}

/**
 * Update counter pending tasks and percentage 
 */

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
function showAlertMsg(msg) {
  alertBox.classList.add('show')
  alertText.innerText = msg;
  setTimeout(() => {
    alertBox.classList.remove('show')
  }, 4000);
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
