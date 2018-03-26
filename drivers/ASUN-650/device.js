'use strict';

const Homey = require('homey');
const util = require('homey-rfdriver').util;
const BlindsDevice = require('../../lib/devices/kaku/blinds.js')

// To extend from another class change the line below to
// module.exports = RFDevice => class ASUN650Device extends MyGenericDevice(RFDevice) {
// and define MyGenericDevice like so
// module.exports = RFDevice => class MyGenericDevice extends RFDevice {
module.exports = RFDevice => class ASUN650Device extends BlindsDevice(RFDriver) {

    onRFInit() {
        super.onRFInit();

        // Init your device here
    }

};
