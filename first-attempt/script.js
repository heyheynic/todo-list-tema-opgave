import { $ } from "../utils/dom.js";

//////// overall list area
const newListForm = $(".new-list-form");
const newListInput = $(".new-list-input");
const allTodoLists = $(".all-todo-lists");
const shoppingListCheckbox = $("#counter-option");

//////// todo area
const toDoContainer = $(".todo-container");
const toDoTitle = $(".todo-title");
const toDosListContainer = $(".todos");

const toDoTemplate = $(".todo-template");
const newTodoForm = $(".new-task-form");
const newTodoInput = $(".new-task-input");

// adding counter to the tasks

// buttons
const deleteList = $(".delete-list");
const clearCompletedTasks = $(".clear-completed-tasks");

const LOCAL_STORAGE_LIST_KEY = "todo.lists";
const LOCAL_STORAGE_LIST_ID_KEY = "todo.selectedListId";

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_LIST_ID_KEY);

// Shopping list checkbox event listener
let isShoppingList = false;
shoppingListCheckbox.addEventListener("change", function () {
  isShoppingList = shoppingListCheckbox.checked;
});



deleteList.addEventListener("click", (e) => {});

newListForm.addEventListener("submit", (e) => {
  // stop browser to refresh page on click/submit
  e.preventDefault();

  // this takes the value of the input and names the list, trim removes unwanted spaces before and after first and last letter.
  const listName = newListInput.value.trim();
  // this prevents you from making a new list if it contains no input
  if (listName == null || listName === "") return;

  // This creates a new list item by taking the written input of listName as a parameter, and continues to the function createList();
  const list = createList(listName);

  // clear input field after submit
  newListInput.value = null;

  // we take the lists variable, and push our new list to the array:
  lists.push(list);
  saveRender();
});

newTodoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const todoName = newTodoInput.value.trim();
  if (todoName == null || todoName === "") return;

  const todo = createTask(todoName);

  newTodoInput.value = null;

  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.todos.push(todo);
  saveRender();
});

function createList(name) {
  return { id: crypto.randomUUID(), name: name, tasks: [] };
}

function createTask(name) {
  return { id: crypto.randomUUID(), name: name, complete: false };
}

function saveRender() {
  save();
  render();
}

function save() {
  // this will save the list to the local storage
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));

  // this helps to remember which list we have had selected, even after refreshing the page
  localStorage.setItem(LOCAL_STORAGE_LIST_ID_KEY, selectedListId);
}

function render() {
  clearElement(toDosListContainer);
  renderLists();

  // This is the selected list. We want to find the list that has the ID of the selected list and with that we want to change the title element
  const selectedList = lists.find((list) => list.id === selectedListId);

  if (selectedListId === null) {
    toDosListContainer.style.display = "none";
  } else {
    // this changes the title of the todo list (left)
    toDosListContainer.innerText = selectedList.name;
    clearElement(toDosListContainer);
    // renderTask will call the function where we are going to use a template
    renderTodos(selectedList);
  }
}

function renderLists() {
  lists.forEach((list) => {
    const listElement = document.createElement("li");
    listElement.dataset.listId = list.id;
    listElement.classList.add("list-name");
    listElement.innerText = list.name;

    if (list.id === selectedListId) {
      listElement.classList.add("active-list");
    }

    //append the data to the child (<li>)
    allTodoLists.appendChild(listElement);
  });
}

function renderTodos(selectedList) {
  selectedList.todos.forEach((todo) => {
    //fetches the template. True makes it possible for us to render everything nested inside <div class="todo">
    const todoElement = document.importNode(toDoTemplate.content, true);
    const checkbox = todoElement.querySelector("input");
    checkbox.id = todo.id;
    const label = todoElement.querySelector("label");
    label.htmlFor = task.id;
    label.append(task.name);
    toDoContainer.appendChild(todoElement);
  });
}

function clearElement(element) {
  // similar to if statement, check to see if element has first child, lets remove it
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();