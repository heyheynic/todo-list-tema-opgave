import { $ } from "../dom.js";

const todoList = $(".todo-list");
const newTodoForm = $(".new-todo-form");
const clearCompletedButton = $(".clear-completed-tasks");
const clearAllButton = $(".clear-entire-list");
const counterOptionCheckbox = $("#counter-option");

// defines a constant for the id key used in local storage, and initialize a todos array []. The array is empty if there are no todos.
const LOCAL_STORAGE_TODO_KEY = "task.todos";
let todos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODO_KEY)) || [];

/////////////////////////////////////////////////////////////

// Event listener for form submission to add new tasks
newTodoForm.addEventListener("submit", (event) => {
  // prevents page refresh on submit
  event.preventDefault();

  // retrieves input value (user text)
  const input = newTodoForm.querySelector('input[type="text"]');
  // trims whitespace before first character and after last character
  const newTask = input.value.trim();

  // checks if input field is valid (contains characters that aren't white space)
  if (newTask) {
    addNewTask(newTask, counterOptionCheckbox.checked);
    input.value = ""; // clear input field after adding task
  }
});

////////////////////////////////

// creates a new todo object to the todos array
function addNewTask(inputText, addQuantity) {
  const todo = {
    // left side are key (properties), represent the "name" of each property in object, right side are values, representing data or value for each key
    id: crypto.randomUUID(), // unique id per object
    text: inputText, // user input text
    completed: false, // any new task is unchecked, therefore false
    quantity: addQuantity ? 1 : null, // if addQuantity is checked, it will show 1, if unchecked = null
  };

  todos.push(todo); // adds the new task to the todos array
  renderTodo(todo); // render the new task
  saveTodosToLocalStorage(); // save to local storage
}

////////////////////////////////

// render a single task item
// starts by creating a div element, giving it class="todo"
function renderTodo(todo) {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  // function then creates an input element, with type="checkbox" and id being the same as <div>.id
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = todo.id;

  // if state of checkbox changes, it updates the "completed" status in the object todo array, which will be saved in local storage
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", () => {
    todo.completed = checkbox.checked;
    saveTodosToLocalStorage();
  });

  // creates a label element, with a for attribute to match its todo.id
  const label = document.createElement("label");
  label.setAttribute("for", todo.id);

  // creates a custom checkbox, which will be made by using an empty span element, and styled in CSS under the class "custom-checkbox"
  const customCheckbox = document.createElement("span");
  customCheckbox.classList.add("custom-checkbox");

  // creates another span element, this time the input text will be located here
  const todoText = document.createElement("span");
  todoText.classList.add("todo-text");
  // remember that todo.text goes back to the todo array which contains key properties, where text is one of them. the text input from the user will the value added to the key.
  todoText.textContent = todo.text;

  // this appends the two span elements inside of the label element.
  label.appendChild(customCheckbox);
  label.appendChild(todoText);

  // create quantity controls if quantity is selected
  if (todo.quantity) {
    // calls the createQuantityControls function
    const quantityWrapper = createQuantityControls(todo);
    label.appendChild(quantityWrapper); // Append quantity controls to label
  }

  // appends the input (checkbox) element and label element to the <div class="todo">
  todoDiv.appendChild(checkbox);
  todoDiv.appendChild(label);

  // appends the new todo div to the existing todoList container
  todoList.appendChild(todoDiv);
}

// create quantity controls for a todo item
function createQuantityControls(todo) {
  // starts by creating a div.quantity-wrapper that will wrap the upcoming elements (button, input and button)
  const quantityWrapper = document.createElement("div");
  quantityWrapper.classList.add("quantity-wrapper", "inline-counter");

  // creates a button element with text content of "-", class="decrement" for styling
  const decrementBtn = document.createElement("button");
  decrementBtn.textContent = "-";
  decrementBtn.classList.add("decrement");

  // listens to click on button, => finds <input type="text">
  decrementBtn.addEventListener("click", () => {
    const quantityInput = quantityWrapper.querySelector("input[type='number']");
    // reduce current quantity by -1, but makes sure value cannot go below -1 (thanks to Maths.max(1, ))
    const newQuantity = Math.max(1, (todo.quantity || 1) - 1);
    quantityInput.value = newQuantity; // updates the input field
    todo.quantity = newQuantity; // updates todo.quantity value
    saveTodosToLocalStorage(); // saved to local stoare
  });

  // creates <input type="number">
  const quantityInput = document.createElement("input");
  quantityInput.type = "number";
  quantityInput.value = todo.quantity || 1; // intial number is equal to what is the value of the quantity property. If that value does not exist, it will default to 1.

  // listens to change of input
  quantityInput.addEventListener("input", () => {
    todo.quantity = +quantityInput.value; // ensure that value is treated as a number, basically only saves value if it is a number above 0. the + is an unary plus operator, which converts value of "number" from a string to a, well... number. "10" =/= 10
    saveTodosToLocalStorage(); // save on input change
  });

  // similar process to decrementBtn
  // creates a button element with text content of "+", class="increment"
  const incrementBtn = document.createElement("button");
  incrementBtn.textContent = "+";
  incrementBtn.classList.add("increment");
  incrementBtn.addEventListener("click", () => {
    const quantityInput = quantityWrapper.querySelector("input[type='number']");
    const newQuantity = (todo.quantity || 1) + 1;
    quantityInput.value = newQuantity; 
    todo.quantity = newQuantity; 
    saveTodosToLocalStorage(); 
  });

  // appends the three elements (button, input and button) to the div.quantity-wrapper
  quantityWrapper.appendChild(decrementBtn);
  quantityWrapper.appendChild(quantityInput);
  quantityWrapper.appendChild(incrementBtn);

  return quantityWrapper; // returns, aka builds the HTML structure that this function has put together
}

// converts the todos array to a JSON string, saves to local storage. important, because it keeps the keys the same on page refresh
function saveTodosToLocalStorage() {
  localStorage.setItem(LOCAL_STORAGE_TODO_KEY, JSON.stringify(todos));
}

// iterates over the todos array from local storage (todos is a let variable defined at the top of the document), calls renderTodo for each todo it finds
function getTodosFromLocalStorage() {
  todos.forEach((todo) => {
    renderTodo(todo);
  });
}

// clears completed tasks on click
clearCompletedButton.addEventListener("click", () => {
  // filters out completed todo from the todos array, and essentially creates a new array for the items that are not completed.
  // !todo.completed is a callback function. ! is a "logical NOT(!) operator", which makes a completed todo-item to "false", and not completed todo-item to "true". The true items (not completed yet) gets added filtered and added to the new array. The rest gets removed, AKA clears the completed tasks from the list.
  todos = todos.filter((todo) => !todo.completed);
  todoList.innerHTML = ""; // clear the displayed list
  todos.forEach(renderTodo); // re-render the remaining todos
  saveTodosToLocalStorage(); // update local storage
});

// clear all tasks, resets todos array to empty
clearAllButton.addEventListener("click", () => {
  todos = [];
  todoList.innerHTML = ""; // clear the displayed list
  saveTodosToLocalStorage(); // update local storage
});

// load todos from local storage when the document is ready
document.addEventListener("DOMContentLoaded", getTodosFromLocalStorage);
