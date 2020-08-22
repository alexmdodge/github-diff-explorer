/**
 * This is an extend based off of the version of the deepExtend library provided by,
 * https://github.com/unclechu/node-deep-extend
 * 
 * Note this is modified under the MIT license.
 * 
 * Specifically the method was modified to terminate recursive dives whenever
 * an HTMLElement is matched.
 */

export function isSpecificValue(val: Date | RegExp | HTMLElement): boolean {
  return val instanceof Date
    || val instanceof RegExp
    || val instanceof HTMLElement
}

export function cloneSpecificValue(val: Date | RegExp | HTMLElement): Date | RegExp | HTMLElement | null {
  if (val instanceof Date) {
    return new Date(val.getTime())
  } else if (val instanceof RegExp) {
    return new RegExp(val)
  } else if (val instanceof HTMLElement) {
    // Note we're specifically terminating here and leaving the HTML elements intact
    // so we can continue to reference those correctly
    return val
  } else {
    return null
  }
}

/**
* Recursive cloning array.
*/
function deepCloneArray(arr: any[]) {
  const clone: any[] = []
  arr.forEach(function (item, index) {
    if (typeof item === 'object' && item !== null) {
      if (Array.isArray(item)) {
        clone[index] = deepCloneArray(item)
      } else if (isSpecificValue(item)) {
        clone[index] = cloneSpecificValue(item)
      } else {
        clone[index] = deepExtendHtmlTerminated({}, item)
      }
    } else {
      clone[index] = item
    }
  })
  return clone
}

/**
* Extending object that entered in first argument.
*
* Returns extended object or false if have no target object or incorrect type.
*
* If you wish to clone source object (without modify it), just use empty new
* object as first argument, like this:
*   deepExtend({}, yourObj_1, [yourObj_N]);
*/
export function deepExtendHtmlTerminated(...args: any[]): any {
  if (args.length < 1 || typeof args[0] !== 'object') {
    return false
  }

  if (args.length < 2) {
    return args[0]
  }

  const target = args[0]

  let val, src

  args.forEach(function (obj) {
    // skip argument if isn't an object, is null, or is an array
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      return
    }

    Object.keys(obj).forEach(function (key) {
      src = target[key] // source value
      val = obj[key] // new value

      // recursion prevention
      if (val === target) {
        return

        /**
         * if new value isn't object then just overwrite by new value
         * instead of extending.
         */
      } else if (typeof val !== 'object' || val === null) {
        target[key] = val
        return

        // just clone arrays (and recursive clone objects inside)
      } else if (Array.isArray(val)) {
        target[key] = deepCloneArray(val)
        return

        // custom cloning and overwrite for specific objects
      } else if (isSpecificValue(val)) {
        target[key] = cloneSpecificValue(val)
        return

        // overwrite by new value if source isn't object or array
      } else if (typeof src !== 'object' || src === null || Array.isArray(src)) {
        target[key] = deepExtendHtmlTerminated({}, val)
        return

        // source value and new value is objects both, extending...
      } else {
        target[key] = deepExtendHtmlTerminated(src, val)
        return
      }
    })
  })

  return target
}