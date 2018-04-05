'use strict';

const Kaku = require('./kaku');
const util = require('homey-rfdriver').util;

module.exports = RFDevice => class Remote extends Kaku(RFDevice) {

	static payloadToData(payload) {
		const data = super.payloadToData(payload);
		if (!data) return data;

		data.id = data.address;
		return data;
	}

	onFlowTriggerFrameReceived(args, state) {
		if (this.getSetting('rotated') === '180') {
			if (args.unit === '10') {
				args.unit = '11';
			} else if (args.unit === '11') {
				args.unit = '10';
			} else if (args.unit === '00') {
				args.unit = '01';
			} else if (args.unit === '01') {
				args.unit = '00';
			}
		}
		if (args.unitchannel) {
			args.unit = args.unitchannel.slice(0, 2);
			args.channel = args.unitchannel.slice(2, 4);
			delete args.unitchannel;
		}
		if (args.unit === 'g') {
			args.unit = '00';
			args.group = 1;
			delete args.channel;
		} else {
			args.group = 0;
		}
		return super.onFlowTriggerFrameReceived(args, state);
	}

	assembleDeviceObject() {
		return super.assembleDeviceObject(true);
	}
};
