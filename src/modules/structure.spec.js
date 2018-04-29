import {
  extractPathDataFromElements,
  getFileElements,
  getFileElementContainers,
  extractFileElementsFromContainers,
  mergeFileElements,
  filterUnusedElements,
} from './structure';

import elementStrings from '../../test/element-strings';
import { generateNodeArrayFor, generateNodeFor } from '../../test/helpers';

describe('Structure Module', () => {

  describe('Test - extractPathDataFromElements', () => {

    test('Expect valid element array to return proper array structure', () => {
      const testElementsArray = generateNodeArrayFor(elementStrings.fileDiff, 1);
      const expectedNode = generateNodeFor(elementStrings.fileDiff);
      const expectedPath = expectedNode.children[0].dataset.path;

      const result = extractPathDataFromElements(testElementsArray);
      expect(result[0].el).toEqual(expectedNode);
      expect(result[0].path).toEqual(expectedPath);
    });

    test('Empty array returns itself', () => {
      const testArray = [];
      const result = extractFileElementsFromContainers(testArray);
      expect(result).toEqual(testArray);
    })

  });

  describe('Test - getFileElementContainers', () => {});
  describe('Test - extractFileElementsFromContainers', () => {});
  describe('Test - mergeFileElements', () => {});
  describe('Test - filterUnusedElements', () => {});
  describe('Test - getFileElements', () => {});
});
