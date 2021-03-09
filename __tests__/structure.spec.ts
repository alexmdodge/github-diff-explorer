import {
  extractPathDataFromElements,
  getFileElements,
  getFileElementContainers,
  extractFileElementsFromContainers,
  mergeFileElements,
  filterUnusedFileElements
} from '../src/modules/structure'

import { gh } from '../src/modules/constants'
import { mockedSingleWithDataProps, mockedSingleWithNoDataProps } from './mock-elements/mock-single-diff-element'
import mockPrPage from './mock-elements/mock-pr-page'
import { generateNodeArrayFor, generateNodeFor } from './helpers/helpers'

describe('Structure Module', () => {

  describe('Test - extractPathDataFromElements', () => {

    test('Expect node element array to return object array with extracted data', () => {
      const testElementsArray = generateNodeArrayFor(mockedSingleWithDataProps, 1)
      const expectedNode = generateNodeFor(mockedSingleWithDataProps)
      const expectedPath = (expectedNode.children[0] as HTMLElement).dataset.path
      const expectedAnchor = (expectedNode.children[0] as HTMLElement).dataset.anchor

      const result = extractPathDataFromElements(testElementsArray)
      expect(result[0].el).toEqual(expectedNode)
      expect(result[0].path).toEqual(expectedPath)
      expect(result[0].anchor).toEqual(expectedAnchor)
    })

    test('Expect node element without data to return empty path and anchor props', () => {
      const testElementsArray = generateNodeArrayFor(mockedSingleWithNoDataProps, 1)

      const result = extractPathDataFromElements(testElementsArray)
      expect(result[0].path).toEqual('')
      expect(result[0].anchor).toEqual('')
    })

    test('Empty array returns itself', () => {
      const testArray: HTMLElement[] = []
      const result = extractFileElementsFromContainers(testArray)
      expect(result).toEqual(testArray)
    })

  })

  describe('Test - getFileElementContainers', () => {
    beforeEach(() => {
      document.body.innerHTML = mockPrPage
    })

    test('Returns an array', () => {
      const isArray = Array.isArray(getFileElementContainers())
      expect(isArray).toBeTruthy()
    })

    test('Returns array with two entries', () => {
      expect(getFileElementContainers().length).toEqual(2)
    })

    test('Expect first entry to have four children', () => {
      const elementContainers = getFileElementContainers()
      const firstEntry = elementContainers[0]
      expect(firstEntry.children.length).toEqual(4)
    })
  })

  describe('Test - extractFileElementsFromContainers', () => {
    let arrayOfDiffContainers: HTMLElement[] = []
    
    const emptyTestArrays = () => {
      arrayOfDiffContainers = []
    }

    beforeEach(() => {
      emptyTestArrays()

      document.body.innerHTML = mockPrPage
      arrayOfDiffContainers = getFileElementContainers()
    })

    afterEach(() => {
      emptyTestArrays()
    })

    test('Returns an array', () => {
      const result = extractFileElementsFromContainers(arrayOfDiffContainers)
      const isArray = Array.isArray(result)
      expect(isArray).toBeTruthy()
    })

    test('Returns array with two entries', () => {
      const result = extractFileElementsFromContainers(arrayOfDiffContainers)
      expect(result.length).toEqual(2)
    })

    test('First entry is also an array', () => {
      const result = extractFileElementsFromContainers(arrayOfDiffContainers)
      const innerEntryIsArray = Array.isArray(result[0])
      expect(innerEntryIsArray).toBeTruthy()
    })
  })

  describe('Test - mergeFileElements', () => {
    let arrayOfDiffContainers = []
    let arrayOfArraysOfDiffElements: HTMLElement[][] = []

    const emptyTestArrays = () => {
      arrayOfDiffContainers = []
      arrayOfArraysOfDiffElements = []
    }

    beforeEach(() => {
      emptyTestArrays()

      document.body.innerHTML = mockPrPage
      arrayOfDiffContainers = getFileElementContainers()
      arrayOfArraysOfDiffElements = extractFileElementsFromContainers(arrayOfDiffContainers)
    })

    afterEach(() => {
      emptyTestArrays()
    })

    test('Returns an array', () => {
      const result = mergeFileElements(arrayOfArraysOfDiffElements)
      const isArray = Array.isArray(result)
      expect(isArray).toBeTruthy()
    })

    test('Returns array with 8 entries', () => {
      const result = mergeFileElements(arrayOfArraysOfDiffElements)
      expect(result.length).toEqual(8)
    })

    test('First entry is an element', () => {
      const result = mergeFileElements(arrayOfArraysOfDiffElements)
      const innerEntryIsElement = result[0] instanceof HTMLElement
      expect(innerEntryIsElement).toBeTruthy()
    })
  })

  describe('Test - filterUnusedFileElements', () => {
    let arrayOfDiffContainers: HTMLElement[] = []
    let arrayOfArraysOfDiffElements = []
    let flattenedArrayOfElements: HTMLElement[] = []

    const emptyTestArrays = () => {
      arrayOfDiffContainers = []
      arrayOfArraysOfDiffElements = []
      flattenedArrayOfElements = []
    }

    beforeEach(() => {
      emptyTestArrays()

      document.body.innerHTML = mockPrPage
      arrayOfDiffContainers = getFileElementContainers()
      arrayOfArraysOfDiffElements = extractFileElementsFromContainers(arrayOfDiffContainers)
      flattenedArrayOfElements = mergeFileElements(arrayOfArraysOfDiffElements)
    })

    afterEach(() => {
      emptyTestArrays()
    })

    test('Returns an array', () => {
      const { core: result } = filterUnusedFileElements(flattenedArrayOfElements)
      const isArray = Array.isArray(result)
      expect(isArray).toBeTruthy()
    })

    test('Returns array with 4 filtered entries', () => {
      const { core: result } = filterUnusedFileElements(flattenedArrayOfElements)
      expect(result.length).toEqual(4)
    })

    test('First entry is an element with a class matching filter', () => {
      const { core: result } = filterUnusedFileElements(flattenedArrayOfElements)
      const firstEntry = result[0]
      const hasFileClass = firstEntry.classList.contains(gh.fileClass)
      
      expect(hasFileClass).toBeTruthy()
    })
  })

  describe('Test - getFileElements', () => {
    beforeEach(() => {
      document.body.innerHTML = mockPrPage
    })

    test('Returns an array', () => {
      const { core: result } = getFileElements()
      const isArray = Array.isArray(result)
      expect(isArray).toBeTruthy()
    })

    test('Returns array with 4 filtered entries', () => {
      const { core: result } = getFileElements()
      expect(result.length).toEqual(4)
    })

    test('First entry is an element with a class matching filter', () => {
      const { core: result } = getFileElements()
      const firstEntry = result[0]
      const hasFileClass = firstEntry.classList.contains(gh.fileClass)
      
      expect(hasFileClass).toBeTruthy()
    })
  })
})
