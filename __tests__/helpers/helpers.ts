export function generateNodeArrayFor(htmlString: string, length: number): any[] {
  const result = []
  
  for (let i = 0; i < length; i++) {
    result.push(generateNodeFor(htmlString))
  }

  return result
}

export function generateNodeFor(htmlString: string): ChildNode {
  const div = document.createElement('div')
  div.innerHTML = htmlString.trim()
  const child = div.firstChild

  if (!child) {
    throw new Error('First child does not exist')
  } else {
    // Change this to div.childNodes to support multiple top-level nodes
    return child
  }
  
}
