'use strict';

const Remote = require('./remote');
const util = require('homey-rfdriver').util;

module.exports = RFDevice => class DimmingRemote extends Remote(RFDevice) {

	onRFInit() {
		this.virtualCapabilities = ['dim', 'dimup', 'isdim'];
	}

	static payloadToData(payload) { // Convert received data to usable variables
		if (payload && payload.length === 32 && payload.indexOf(2) === -1) {
			const data = super.payloadToData(payload);
			if (!data) return data;

			data.isdim = false;
			data.id = data.address;

			return data;
		} else if (
			payload &&
			payload.length === 36 &&
			payload.slice(0, 26).indexOf(2) === -1 &&
			payload.slice(28, 36).indexOf(2) === -1 &&
			payload[27] === 2
		) {
			const data = {
				address: util.bitArrayToString(payload.slice(0, 26)),
				group: payload[26],
				channel: util.bitArrayToString(payload.slice(28, 30)),
				unit: util.bitArrayToString(payload.slice(30, 32)),
				state: 1,
				dim: util.bitArrayToNumber(payload.slice(32, 36)) / 15,
				isdim: true,
			};

			data.id = data.address;

			return data;
		}
		return null;
	}

	parseIncomingData(data) {
		if (data.hasOwnProperty('dim')) {
			const currDim = this.getStoreValue('dim');
			if (currDim !== null && !isNaN(currDim)) {
				if (currDim < data.dim || data.dim === 1) {
					data.dimup = true;
				} else if (currDim > data.dim || data.dim === 0) {
					data.dimup = false;
				}
			} else {
				data.dimup = data.dim >= 0.5;
			}
		}
		return data;
	}

	onData(data) {
		if (typeof data.dimup === 'boolean') {
			this.setStoreValue('dim', data.dim);
		}
		super.onData();
	}

	static dataToPayload(data) {
		if (
			data &&
			data.address && data.address.length === 26 &&
			data.channel && data.channel.length === 2 &&
			data.unit && data.unit.length === 2 &&
			typeof data.group !== 'undefined' &&
			(
				(typeof data.state !== 'undefined' && Number(data.state) !== 2) ||
				(typeof data.dim !== 'undefined' && Number(data.dim) >= 0 && Number(data.dim) <= 1) ||
				(data.dim === 'up' || data.dim === 'down')
			)
		) {
			const address = util.bitStringToBitArray(data.address);
			const channel = util.bitStringToBitArray(data.channel);
			const unit = util.bitStringToBitArray(data.unit);
			// Calculate dim value
			if (data.dim) {
				let dim;
				if (typeof data.dim === 'string') {
					dim = data.dim === 'up' ? [1, 1, 1, 1] : [0, 0, 0, 0];
				} else {
					dim = util.numberToBitArray(Math.round(Math.min(1, Math.max(0, data.dim)) * 15), 4);
				}
				return address.concat(data.group ? 1 : 0, 2, channel, unit, dim);
			}
			return address.concat(Number(data.group), Number(data.state), channel, unit);
		}
		return null;
	}

	onTriggerReceived(callback, args, state) {
		if (args.state === 'dimup' || args.state === 'dimdown') {
			args.dimup = args.state === 'dimup';
			delete args.state;
		} else {
			args.isdim = false;
		}
		super.onTriggerReceived(callback, args, state);
	}
};
