'use strict';

const util = require('homey-rfdriver').util;

module.exports = RFDevice => class Kaku extends RFDevice {

	onRFInit() {
		super.onRFInit();
		this.clearFromEmptySendObject = ['onoff', 'dim'];
	}

	matchesData(deviceData) {
		if (!super.matchesData(deviceData)) {
			return deviceData.group === 1 && deviceData.address === this.getData().address;
		}
		return true;
	}

	sendProgramSignal(data = {}) {
		return super.sendProgramSignal({ ...data, state: 1 });
	}

	parseIncomingData(data) {
		if (this.id && data.id !== this.id && data.group) {
			data.id = this.id;
			const deviceData = this.getData();
			data.addres = deviceData.addres;
			data.unit = deviceData.unit;
		}
		return data;
	}

	static generateData() {
		const data = {
			address: util.generateRandomBitString(26),
			group: 0,
			channel: util.generateRandomBitString(2),
			unit: util.generateRandomBitString(2),
			state: 0,
			onoff: false,
		};
		data.id = `${data.address}:${data.channel}:${data.unit}`;
		return data;
	}

	static payloadToData(payload) { // Convert received data to usable variables
		if (payload.length >= 32) {
			const data = {
				address: util.bitArrayToString(payload.slice(0, 26)),
				group: payload[26],
				channel: util.bitArrayToString(payload.slice(28, 30)),
				unit: util.bitArrayToString(payload.slice(30, 32)),
				state: payload[27],
				onoff: Boolean(Number(payload[27])),
			};
			data.id = `${data.address}:${data.channel}:${data.unit}`;
			return data;
		}
		return null;
	}

	static dataToPayload(data) {
		if (
			data &&
			data.address && data.address.length === 26 &&
			data.channel && data.channel.length === 2 &&
			data.unit && data.unit.length === 2 &&
			typeof data.group !== 'undefined' &&
			typeof data.state !== 'undefined'
		) {
			const address = util.bitStringToBitArray(data.address);
			const channel = util.bitStringToBitArray(data.channel);
			const unit = util.bitStringToBitArray(data.unit);
			return address.concat(
				Number(data.group),
				Number(typeof data.onoff === 'boolean' ? data.onoff : data.state),
				channel,
				unit
			);
		}
		return null;
	}

	assembleDeviceObject() {
		const deviceObject = super.assembleDeviceObject();
		if (deviceObject && Object.keys(deviceObject.data).length !== 0) {
			deviceObject.data.group = 0;
			deviceObject.data.state = Number(deviceObject.data.state) ? 1 : 0;
			delete deviceObject.data.dim;
		}
		return deviceObject;
	}
};
