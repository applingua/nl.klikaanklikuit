'use strict';

module.exports = RFDevice => class DefaultDevice extends RFDevice {

	matchesData(deviceData) {
		// If device does not match data but data is a group signal with the same address return true
		return super.matchesData(deviceData) || (Number(deviceData.group) === 1 && deviceData.address === this.getData().address)
	}

	sendProgramSignal(data = {}) {
		return super.sendProgramSignal({ ...data, state: 1 });
	}

	parseIncomingData(data) {
		if (Number(data.group) && this.id && data.id !== this.id) {
			data.id = this.id;
			const deviceData = this.getData();
			data.addres = deviceData.addres;
			data.unit = deviceData.unit;
		}
		return data;
	}

	assembleDeviceObject(ignoreGroupButtonCheck) {
		if (!ignoreGroupButtonCheck && Number(this.getData().group)) {
			return new Error('cannot_pair_with_group_button');
		}
		const deviceObject = super.assembleDeviceObject();
		if (deviceObject && Object.keys(deviceObject.data).length !== 0) {
			deviceObject.data.group = 0;
			deviceObject.data.state = Number(deviceObject.data.state) ? 1 : 0;
			if (deviceObject.capabilities.includes('dim')) {
				deviceObject.data.dim = deviceObject.data.dim || 1;
			}
		}

		return deviceObject;
	}

	setCapabilityValue(capability, value) {
		if (
			typeof value === 'boolean' &&
			this.options.sendToggleAfterTimeout &&
			(
				typeof this.options.sendToggleAfterTimeout === 'number' ||
				typeof this.options.sendToggleAfterTimeout === 'string' ||
				Array.isArray(this.options.sendToggleAfterTimeout) ||
				this.options.sendToggleAfterTimeout.hasOwnProperty(capability)
			) &&
			this.hasCapability(capability)
		) {
			const toggleValue = this.toggleCapabilityValue[capability];
			clearTimeout(this.sendToggleTimeout[capability]);
			delete this.toggleCapabilityValue[capability];
			if (toggleValue === undefined || toggleValue === null || toggleValue !== value) {
				let timeout;
				if (typeof this.options.sendToggleAfterTimeout === 'object' && !Array.isArray(this.options.sendToggleAfterTimeout)) {
					timeout = this.options.sendToggleAfterTimeout[capability];
				} else {
					timeout = this.options.sendToggleAfterTimeout;
				}
				if (Array.isArray(timeout)) {
					timeout = timeout[value ? 1 : 0];
				}
				if (typeof timeout === 'string') {
					timeout = this.getSetting(timeout);
					if (typeof timeout === 'string') {
						timeout = Number(timeout);
					}
					if (timeout && timeout < 1000) {
						timeout = timeout * 60 * 1000;
					}
				}
				if (timeout && typeof timeout === 'number') {
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
