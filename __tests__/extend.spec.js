import deepExtend, { cloneSpecificValue } from '../src/modules/extend';
  
  describe('deepExtend()', () => {
  
    it('should merge two objects with Html nodes', () => {
        const obj1 = {
            top: {
                div: {
                    root: document.createElement('div'),
                },
                test: 'test',
                array: [
                  {inner: 'test'},
                  [1, 2]
                ],
            }
        };
        const obj2 = {
            top: {
                span: {
                    root: document.createElement('span'),
                },
                test: 'test-override',
                array: [
                  'array-override',
                  { inner: 'test-override'},
                  document.createElement('span'),
                  [1, 2, 3]
                ],
            }
        }
        const extended = {
            top: {
                span : {
                    root: document.createElement('span'),
                },
                div: {
                    root: document.createElement('div'),
                },
                test: 'test-override',
                array: [
                  'array-override',
                  { inner: 'test-override'},
                  document.createElement('span'),
                  [1, 2, 3]
                ],
            }
        }
        var result = deepExtend(obj1, obj2);
        expect(result).toMatchObject(extended);
    });

    it('should return false if not an object', () => {
      var result = deepExtend()
      expect(result).toStrictEqual(false)
    })

    it('should return the same, provided a single object', () => {
      const obj = {
        a: 'test'
      }
      
      var result = deepExtend(obj)
      expect(result).toMatchObject(obj)
    })

    it('should skip non object input', () => {
      const obj = {
        a: 'test'
      }
    
      var result = deepExtend(obj, 'nope')
      expect(result).toMatchObject(obj)
    })

    it('should produce the same output when copied', () => {
      const obj = {
        a: 'test'
      }
      
      var result = deepExtend(obj, { obj })
      expect(result).toMatchObject(obj)
    })
});

describe('cloneSpecificValue()', () => {
  it('should get specific time of date', () => {
    const testDate = new Date('July 20, 69 00:20:18 GMT+00:00');
    const result = cloneSpecificValue(testDate)

    expect(result instanceof Date).toStrictEqual(true)
  })

  it('should return Regular expressions', () => {
    const result = cloneSpecificValue(/test/)
    expect(result instanceof RegExp).toStrictEqual(true)
  })

  it('should throw an error for all else', () => {
    expect(() => {
      cloneSpecificValue('test')
    }).toThrow()
  })
})