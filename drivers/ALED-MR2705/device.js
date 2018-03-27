'use strict';

const Homey = require('homey');
const util = require('homey-rfdriver').util;
const New_dimmerDevice = require('../../lib/devices/kaku/new_dimmer.js');

// To extend from another class change the line below to
// module.exports = RFDevice => class ALEDMR2705Device extends MyGenericDevice(RFDevice) {
// and define MyGenericDevice like so
// module.exports = RFDevice => class MyGenericDevice extends RFDevice {
module.exports = RFDevice => class ALEDMR2705Device extends New_dimmerDevice(RFDevice) {

    onRFInit() {
        super.onRFInit();

        // Init your device here
    }

};
