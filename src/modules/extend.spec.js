import deepExtend from './extend';
  
  describe('Extend Helper', () => {
  
    test('Merging two objects with Html nodes', () => {
        const obj1 = {
            top: {
                div: {
                    root: document.createElement('div'),
                }
            }
        };
        const obj2 = {
            top: {
                span: {
                    root: document.createElement('span'),
                }
            }
        }
        const extended = {
            top: {
                span : {
                    root: document.createElement('span'),
                },
                div: {
                    root: document.createElement('div'),
                }
            }
        }
        var result = deepExtend(obj1, obj2);
        expect(result).toEqual(extended);
    });
});