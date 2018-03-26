'use strict';

const Homey = require('homey');
const util = require('homey-rfdriver').util;
const Dimming_remoteDevice = require('../../lib/devices/kaku/dimming_remote.js')

// To extend from another class change the line below to
// module.exports = RFDevice => class AYCT202Device extends MyGenericDevice(RFDevice) {
// and define MyGenericDevice like so
// module.exports = RFDevice => class MyGenericDevice extends RFDevice {
module.exports = RFDevice => class AYCT202Device extends Dimming_remoteDevice(RFDriver) {

    onRFInit() {
        super.onRFInit();

        // Init your device here
    }

};
