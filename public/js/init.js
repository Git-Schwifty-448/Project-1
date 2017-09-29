/**
 * A lightweight JQuery-like shim
 * @param {(string|function)} input - String: An element query selector, Function: a function to be run on page load
 * @return {NodeList} A list of matching nodes if input was query selector
 */
export
default function $(input) {
  if (typeof(input) === 'string') return document.querySelectorAll(input)
  if (typeof(input) === 'function') document.addEventListener('DOMContentLoaded', input)
}
