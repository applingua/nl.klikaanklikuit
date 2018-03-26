'use strict';

const Homey = require('homey');
const util = require('homey-rfdriver').util;
const Remote_valuelineDevice = require('../../lib/devices/kaku/remote_valueline.js')

// To extend from another class change the line below to
// module.exports = RFDevice => class APA22300RDevice extends MyGenericDevice(RFDevice) {
// and define MyGenericDevice like so
// module.exports = RFDevice => class MyGenericDevice extends RFDevice {
module.exports = RFDevice => class APA22300RDevice extends Remote_valuelineDevice(RFDriver) {

    onRFInit() {
        super.onRFInit();

        // Init your device here
    }

};
