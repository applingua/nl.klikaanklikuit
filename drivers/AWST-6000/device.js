'use strict';

const Homey = require('homey');
const util = require('homey-rfdriver').util;
const Motion_sensorDevice = require('../../lib/devices/kaku/motion_sensor.js')

// To extend from another class change the line below to
// module.exports = RFDevice => class AWST6000Device extends MyGenericDevice(RFDevice) {
// and define MyGenericDevice like so
// module.exports = RFDevice => class MyGenericDevice extends RFDevice {
module.exports = RFDevice => class AWST6000Device extends Motion_sensorDevice(RFDriver) {

    onRFInit() {
        super.onRFInit();

        // Init your device here
    }

};
