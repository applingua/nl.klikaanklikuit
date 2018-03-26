'use strict';

const Homey = require('homey');
const util = require('homey-rfdriver').util;
const Wall_switchDevice = require('../../lib/devices/kakuold/wall_switch.js')

// To extend from another class change the line below to
// module.exports = RFDevice => class WST8700Device extends MyGenericDevice(RFDevice) {
// and define MyGenericDevice like so
// module.exports = RFDevice => class MyGenericDevice extends RFDevice {
module.exports = RFDevice => class WST8700Device extends Wall_switchDevice(RFDriver) {

    onRFInit() {
        super.onRFInit();

        // Init your device here
    }

};
