'use strict';

const Kaku = require('./kaku');
const util = require('homey-rfdriver').util;

module.exports = RFDevice => class Sensor extends Kaku(RFDevice) {

	onRFInit() {
		super.onRFInit();
		this.sendToggleTimeout = {};
		this.toggleCapabilityValue = {};
	}

	parseIncomingData(data) {
		data = super.parseIncomingData(data);

		this.getCapabilities().forEach(capabilityId => {
			if (!data.hasOwnProperty(capabilityId)) {
				data[capabilityId] = Boolean(Number(data.state));
			}
		});
		return data;
	}

	parseOutgoingData(data) {
		this.getCapabilities().forEach(capabilityId => {
			if (data.hasOwnProperty(capabilityId)) {
				data.state = data[capabilityId] ? 1 : 0;
			}
		});
		return data;
	}

	setCapabilityValue(capability, value) {
		if (
			typeof value === 'boolean' &&
			this.options.sendToggleAfterTimeout &&
			(
				typeof this.options.sendToggleAfterTimeout === 'number' ||
				typeof this.options.sendToggleAfterTimeout === 'string' ||
				this.options.sendToggelAfterTimeout.hasOwnProperty(capability)
			) &&
			this.hasCapability(capability)
		) {
			const toggleValue = this.toggleCapabilityValue[capability];
			clearTimeout(this.sendToggleTimeout[capability]);
			delete this.toggleCapabilityValue[capability];
			if (toggleValue === undefined || toggleValue === null || toggleValue !== value) {
				let timeout;
				if (typeof this.options.sendToggleAfterTimeout === 'object') {
					timeout = this.options.sendToggleAfterTimeout[capability];
				} else {
					timeout = this.options.sendToggleAfterTimeout;
				}
				if (typeof timeout === 'string') {
					timeout = this.getSetting(this.options.sendToggleAfterTimeout);
					if (typeof timeout === 'string') {
						timeout = Number(timeout);
					}
				}

				if (typeof timeout !== 'number') {
					throw new Error(`invalid sendToggleAfterTimeout setting for capability "${capability}", ${this.options.sendToggleAfterTimeout}`);
				}

				if (timeout) {
					this.sendToggleTimeout[capability] = setTimeout(async () => {
						const newValue = !value;
						this.toggleCapabilityValue[capability] = newValue;
						await this.emit('data', { [capability]: newValue, state: newValue ? 1 : 0 });
						delete this.toggleCapabilityValue[capability];
					}, timeout);
				}
			}
		}
		return super.setCapabilityValue(capability, value);
	}
};
