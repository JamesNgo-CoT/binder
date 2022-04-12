const Binder = (() => {

/*
bind: function (
	obj: object,
	prop: string,
	cbk: function () => void
) => object
*/
function bind(emitter, property, callback, owner) {
	if (!emitter._binder) {
		Object.defineProperty(emitter, '_binder', {
			configurable: true,
			value: {}
		});
	}

	if (!emitter._binder[property]) {
		emitter._binder[property] = { value: emitter[property], callbacks: [] };

		Object.defineProperty(emitter, property, {
			configurable: true,
			get() {
				return this._binder[property].value;
			},
			set(newValue) {
				const oldValue = this._binder[property].value;
				if (newValue !== oldValue) {
					this._binder[property].value = newValue;

					const callbacks = [...this._binder[property].callbacks];
					for (let index = 0, length = callbacks.length; index < length; index++) {
						callbacks[index].callback(newValue, oldValue);
					}
				}
			}
		});
	}

	emitter._binder[property].callbacks.push({ callback, owner });

	return emitter;
}

/*
bind: function (
	obj: object,
	prop: undefined | null | string,
	cbk: undefined | null | function () => void
) => object
*/
function unbind(emitter, property, callback, owner) {
	if (emitter._binder) {
		const process = (property) => {

			// Remove callback
			let index = 0;
			while (index < emitter._binder[property].callbacks.length) {
				if ((callback == null || callback === emitter._binder[property].callbacks[index].callback)
					|| (owner == null || owner === emitter._binder[property].callbacks[index].owner)) {

					emitter._binder[property].callbacks.splice(index, 1);

					continue;
				}

				index++;
			}

			// Remove property
			if (emitter._binder[property].callbacks.length === 0) {
				delete emitter[property];
				emitter[property] = emitter._binder[property].value;
				delete emitter._binder[property];

				// Remove binder
				let isEmpty = true;
				for (const key in emitter._binder) { // eslint-disable-line no-unused-vars
					isEmpty = false;
					break;
				}
				if (isEmpty) {
					delete emitter._binder;
				}
			}
		};

		if (property == null) {
			for (const key in emitter._binder) {
				process(key);
			}
		} else {
			process(property);
		}
	}

	return emitter;
}

return {
	bind,
	unbind
};
})();
/* exported Binder */
