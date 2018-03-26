'use strict';

const Homey = require('homey');
const util = require('homey-rfdriver').util;
const Contact_sensorDevice = require('../../lib/devices/kaku/contact_sensor.js')

// To extend from another class change the line below to
// module.exports = RFDevice => class AMST606Device extends MyGenericDevice(RFDevice) {
// and define MyGenericDevice like so
// module.exports = RFDevice => class MyGenericDevice extends RFDevice {
module.exports = RFDevice => class AMST606Device extends Contact_sensorDevice(RFDriver) {

    onRFInit() {
        super.onRFInit();

        // Init your device here
    }

};
