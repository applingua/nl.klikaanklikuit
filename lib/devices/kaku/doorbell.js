'use strict';

const Sensor = require('./sensor');
const util = require('homey-rfdriver').util;

module.exports = RFDevice => class Doorbell extends Sensor(RFDevice) {

	triggerFlowsOnData(data) {
		if (!Number(data.state)) {
			return;
		}
		super.triggerFlowsOnData(data);
	}

};
