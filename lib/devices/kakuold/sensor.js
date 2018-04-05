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
};
