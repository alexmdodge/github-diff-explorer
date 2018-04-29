export function generateNodeArrayFor(htmlString, length) {
  var result = [];
  
  for (let i = 0; i < length; i++) {
    result.push(generateNodeFor(htmlString));
  }

  return result;
}

export function generateNodeFor(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  
  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}
