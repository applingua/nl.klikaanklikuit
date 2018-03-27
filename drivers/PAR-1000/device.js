'use strict';

const Homey = require('homey');
const util = require('homey-rfdriver').util;
const SingleCodewheelDevice = require('../../lib/devices/kakuold/single_codewheel.js');

// To extend from another class change the line below to
// module.exports = RFDevice => class PAR1000Device extends MyGenericDevice(RFDevice) {
// and define MyGenericDevice like so
// module.exports = RFDevice => class MyGenericDevice extends RFDevice {
module.exports = RFDevice => class PAR1000Device extends SingleCodewheelDevice(RFDevice) {

    onRFInit() {
        super.onRFInit();

        // Init your device here
    }

};
