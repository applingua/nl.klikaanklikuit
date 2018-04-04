'use strict';

const Remote = require('./remote');
const util = require('homey-rfdriver').util;

module.exports = RFDevice => class RemoteValueline extends Remote(RFDevice) {

	onRFInit() {
		super.onRFInit();
		this.on('after_send', this.sendGroupSignal.bind(this));
	}

	onData(data) {
		console.log('onData', this.debounced, Number(data.group));
		if (this.debounced) return;
		if (Number(data.group)) {
			this.debounced = true;
			clearTimeout(this.debounceTimeout);
			this.debounceTimeout = setTimeout(() => this.debounced = false, 2000);
		}
		super.onData(data);
	}

	sendGroupSignal(data) {
		if (data && Number(data.group) === 1) {
			Promise.all(['00', '01'].map(unit =>
				this.send(Object.assign({}, data, { group: 0, unit }))
			))
				.then(() => this.log('Simulated group payload'));
		}
	}
};
