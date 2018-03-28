export default class DOMUtils {
  static getChildNode(childData) {
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
  
  static getExplorerElement() {
    const el = document.createElement('div');
    el.classList.add('gcfe__container');
  
    return el;
  }
  
  static getExplorerHeaderElement() {
    const el = document.createElement('h5');
    el.classList.add('gcfe__header');
    el.innerText = 'File Explorer';
  
    return el;
  }
  
  static removeElementChildren(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  static isValidHrefPath(path) {
    const pathFragments = path.split('/');
    const finalFragment = pathFragments[pathFragments.length - 1];

    const validPathRegex = 'files';
    return finalFragment.indexOf(validPathRegex) > -1;
  }
}
