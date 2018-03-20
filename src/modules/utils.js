export function getChildNode(childData) {
  var files = Object.keys(childData);
  var filesContainer = document.createElement('ul');
  filesContainer.classList.add('gcfe__nested-files');

  files.forEach(file => {
    var fileItem = document.createElement('li');

    var currentFileData = childData[file];
    if (!!currentFileData.explorerEl) {
      fileItem.appendChild(currentFileData.explorerEl);
    } else {
      var itemDescriptor = document.createElement('span');
      itemDescriptor.innerHTML = '&#9660; ' + file;
      fileItem.appendChild(itemDescriptor);
      fileItem.appendChild(getChildNode(currentFileData));
    }

    filesContainer.appendChild(fileItem);
  });

  return filesContainer;
}

export function getExplorerElement() {
  const el = document.createElement('div');
  el.classList.add('gcfe__container');

  return el;
}

export function getExplorerHeaderElement() {
  const el = document.createElement('h5');
  el.classList.add('gcfe__header');
  el.innerText = 'File Explorer';

  return el;
}

export function removeElementChildren(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}