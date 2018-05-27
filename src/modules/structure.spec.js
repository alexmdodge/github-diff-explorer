import {
  extractPathDataFromElements,
  getFileElements,
  getFileElementContainers,
  extractFileElementsFromContainers,
  mergeFileElements,
  filterUnusedElements,
} from './structure';

import { gh } from './constants';
import mockSingleDiffElement from '../../test/mock-elements/mock-single-diff-element';
import mockPrPage from '../../test/mock-elements/mock-pr-page';
import { generateNodeArrayFor, generateNodeFor } from '../../test/helpers';

describe('Structure Module', () => {

  describe('Test - extractPathDataFromElements', () => {

    test('Expect node element array to return object array with extracted data', () => {
      const testElementsArray = generateNodeArrayFor(mockSingleDiffElement, 1);
      const expectedNode = generateNodeFor(mockSingleDiffElement);
      const expectedPath = expectedNode.children[0].dataset.path;
      const expectedAnchor = expectedNode.children[0].dataset.anchor;

      const result = extractPathDataFromElements(testElementsArray);
      expect(result[0].el).toEqual(expectedNode);
      expect(result[0].path).toEqual(expectedPath);
      expect(result[0].anchor).toEqual(expectedAnchor);
    });

    test('Empty array returns itself', () => {
      const testArray = [];
      const result = extractFileElementsFromContainers(testArray);
      expect(result).toEqual(testArray);
    })

  });

  describe('Test - getFileElementContainers', () => {
    beforeEach(() => {
      document.body.innerHTML = mockPrPage;
    });

    test('Returns an array', () => {
      const isArray = Array.isArray(getFileElementContainers());
      expect(isArray).toBeTruthy();
    });

    test('Returns array with two entries', () => {
      expect(getFileElementContainers().length).toEqual(2);
    });

    test('Expect first entry to have four children', () => {
      const elementContainers = getFileElementContainers();
      const firstEntry = elementContainers[0];
      expect(firstEntry.children.length).toEqual(4);
    })
  });

  describe('Test - extractFileElementsFromContainers', () => {
    let arrayOfDiffContainers = [];
    
    const emptyTestArrays = () => {
      arrayOfDiffContainers = [];
    };

    beforeEach(() => {
      emptyTestArrays();

      document.body.innerHTML = mockPrPage;
      arrayOfDiffContainers = getFileElementContainers();
    });

    afterEach(() => {
      emptyTestArrays();
    });

    test('Returns an array', () => {
      const result = extractFileElementsFromContainers(arrayOfDiffContainers);
      const isArray = Array.isArray(result);
      expect(isArray).toBeTruthy();
    });

    test('Returns array with two entries', () => {
      const result = extractFileElementsFromContainers(arrayOfDiffContainers);
      expect(result.length).toEqual(2);
    });

    test('First entry is also an array', () => {
      const result = extractFileElementsFromContainers(arrayOfDiffContainers);
      const innerEntryIsArray = Array.isArray(result[0]);
      expect(innerEntryIsArray).toBeTruthy();
    });
  });

  describe('Test - mergeFileElements', () => {
    let arrayOfDiffContainers = [];
    let arrayOfArraysOfDiffElements = [];

    const emptyTestArrays = () => {
      arrayOfDiffContainers = [];
      arrayOfArraysOfDiffElements = [];
    };

    beforeEach(() => {
      emptyTestArrays();

      document.body.innerHTML = mockPrPage;
      arrayOfDiffContainers = getFileElementContainers();
      arrayOfArraysOfDiffElements = extractFileElementsFromContainers(arrayOfDiffContainers);
    });

    afterEach(() => {
      emptyTestArrays();
    });

    test('Returns an array', () => {
      const result = mergeFileElements(arrayOfArraysOfDiffElements);
      const isArray = Array.isArray(result);
      expect(isArray).toBeTruthy();
    });

    test('Returns array with 8 entries', () => {
      const result = mergeFileElements(arrayOfArraysOfDiffElements);
      expect(result.length).toEqual(8);
    });

    test('First entry is an element', () => {
      const result = mergeFileElements(arrayOfArraysOfDiffElements);
      const innerEntryIsElement = result[0] instanceof HTMLElement;
      expect(innerEntryIsElement).toBeTruthy();
    });
  });

  describe('Test - filterUnusedElements', () => {
    let arrayOfDiffContainers;
    let arrayOfArraysOfDiffElements;
    let flattenedArrayOfElements;

    const emptyTestArrays = () => {
      arrayOfDiffContainers = [];
      arrayOfArraysOfDiffElements = [];
      flattenedArrayOfElements = [];
    };

    beforeEach(() => {
      emptyTestArrays();

      document.body.innerHTML = mockPrPage;
      arrayOfDiffContainers = getFileElementContainers();
      arrayOfArraysOfDiffElements = extractFileElementsFromContainers(arrayOfDiffContainers);
      flattenedArrayOfElements = mergeFileElements(arrayOfArraysOfDiffElements);
    });

    afterEach(() => {
      emptyTestArrays();
    });

    test('Returns an array', () => {
      const result = filterUnusedElements(flattenedArrayOfElements);
      const isArray = Array.isArray(result);
      expect(isArray).toBeTruthy();
    });

    test('Returns array with 4 filtered entries', () => {
      const result = filterUnusedElements(flattenedArrayOfElements);
      expect(result.length).toEqual(4);
    });

    test('First entry is an element with a class matching filter', () => {
      const result = filterUnusedElements(flattenedArrayOfElements);
      const firstEntry = result[0];
      const hasFileClass = firstEntry.classList.contains(gh.fileClass)
      
      expect(hasFileClass).toBeTruthy();
    });
  });

  describe('Test - getFileElements', () => {
    beforeEach(() => {
      document.body.innerHTML = mockPrPage;
    });

    test('Returns an array', () => {
      const result = getFileElements();
      const isArray = Array.isArray(result);
      expect(isArray).toBeTruthy();
    });

    test('Returns array with 4 filtered entries', () => {
      const result = getFileElements();
      expect(result.length).toEqual(4);
    });

    test('First entry is an element with a class matching filter', () => {
      const result = getFileElements();
      const firstEntry = result[0];
      const hasFileClass = firstEntry.classList.contains(gh.fileClass)
      
      expect(hasFileClass).toBeTruthy();
    });
  });
});
