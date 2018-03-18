window.isSpecificValue = function(val) {
	return (
		val instanceof Date
		|| val instanceof RegExp
    || val instanceof HTMLElement
	) ? true : false;
}

window.cloneSpecificValue = function(val) {
	if (val instanceof Date) {
		return new Date(val.getTime());
	} else if (val instanceof RegExp) {
		return new RegExp(val);
	} else if (val instanceof HTMLElement) {
	  return val;
	} else {
		throw new Error('Unexpected situation');
	}
}

/**
 * Recursive cloning array.
 */
window.deepCloneArray = function(arr) {
	var clone = [];
	arr.forEach(function (item, index) {
		if (typeof item === 'object' && item !== null) {
			if (Array.isArray(item)) {
				clone[index] = deepCloneArray(item);
			} else if (isSpecificValue(item)) {
				clone[index] = cloneSpecificValue(item);
			} else {
				clone[index] = deepExtend({}, item);
			}
		} else {
			clone[index] = item;
		}
	});
	return clone;
}

/**
 * Extening object that entered in first argument.
 *
 * Returns extended object or false if have no target object or incorrect type.
 *
 * If you wish to clone source object (without modify it), just use empty new
 * object as first argument, like this:
 *   deepExtend({}, yourObj_1, [yourObj_N]);
 */
window.deepExtend = function () {
	if (arguments.length < 1 || typeof arguments[0] !== 'object') {
		return false;
	}

	if (arguments.length < 2) {
		return arguments[0];
	}

	var target = arguments[0];

	// convert arguments to array and cut off target object
	var args = Array.prototype.slice.call(arguments, 1);

	var val, src, clone;

	args.forEach(function (obj) {
		// skip argument if isn't an object, is null, or is an array
		if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
			return;
		}

		Object.keys(obj).forEach(function (key) {
			src = target[key]; // source value
			val = obj[key]; // new value

			// recursion prevention
			if (val === target) {
				return;

			/**
			 * if new value isn't object then just overwrite by new value
			 * instead of extending.
			 */
			} else if (typeof val !== 'object' || val === null) {
				target[key] = val;
				return;

			// just clone arrays (and recursive clone objects inside)
			} else if (Array.isArray(val)) {
				target[key] = deepCloneArray(val);
				return;

			// custom cloning and overwrite for specific objects
			} else if (isSpecificValue(val)) {
				target[key] = cloneSpecificValue(val);
				return;

			// overwrite by new value if source isn't object or array
			} else if (typeof src !== 'object' || src === null || Array.isArray(src)) {
				target[key] = deepExtend({}, val);
				return;

			// source value and new value is objects both, extending...
			} else {
				target[key] = deepExtend(src, val);
				return;
			}
		});
	});

	return target;
}

setTimeout(function() {
  window.diffContainerEls = [...document.querySelectorAll('.js-diff-progressive-container')];
  diffContainerEls = diffContainerEls.map(el => {
    return [...el.children];
  });
  
  diffContainerEls = [].concat(...diffContainerEls);
  diffContainerEls = diffContainerEls.filter(diff => diff.classList.contains('file'));
  window.explorerData = diffContainerEls.map(diff => {
    return {
        path: diff.children[0].dataset.path,
        elDiff: diff,
    };
  });
  
  // Modify the path to be a nested Object
 explorerData = explorerData.map(file => {
    var pathStruct = file.path.split('/');
    pathStruct.reverse();
    var explorerEl = document.createElement('div');
    explorerEl.classList.add('gcfe');
    explorerEl.classList.add('gcfe__item');

    return pathStruct.reduce((acc, path) => {
      return {
          [path]: acc
      };
    }, {
      diffEl: file.elDiff,
      explorerEl: document.createElement('div'),
    });
  });
  
  window.allData = deepExtend({}, ...explorerData);
}, 1000);