'use strict';

const Homey = require('homey');
const util = require('homey-rfdriver').util;
const DimmerDevice = require('../../lib/devices/kaku/dimmer.js')

// To extend from another class change the line below to
// module.exports = RFDevice => class ACM300Device extends MyGenericDevice(RFDevice) {
// and define MyGenericDevice like so
// module.exports = RFDevice => class MyGenericDevice extends RFDevice {
module.exports = RFDevice => class ACM300Device extends DimmerDevice(RFDriver) {

    onRFInit() {
        super.onRFInit();

        // Init your device here
    }

};
