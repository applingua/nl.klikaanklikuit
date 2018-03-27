'use strict';

const Homey = require('homey');
const util = require('homey-rfdriver').util;
const RemoteDevice = require('../../lib/devices/kakuold/remote.js');

// To extend from another class change the line below to
// module.exports = RFDevice => class TMT502Device extends MyGenericDevice(RFDevice) {
// and define MyGenericDevice like so
// module.exports = RFDevice => class MyGenericDevice extends RFDevice {
module.exports = RFDevice => class TMT502Device extends RemoteDevice(RFDevice) {

    onRFInit() {
        super.onRFInit();

        // Init your device here
    }

};
