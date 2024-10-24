// Query selector 

// $("div") = document.querySelector
export function $(element) {
  return document.querySelector(element);
}

// $$("div") = document.querySelectorAll
export function $$(element) {
  return document.querySelectorAll(element);
}
