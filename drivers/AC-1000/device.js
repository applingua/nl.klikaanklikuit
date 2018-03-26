'use strict';

const Homey = require('homey');
const util = require('homey-rfdriver').util;
const SocketDevice = require('../../lib/devices/kaku/socket.js')

// To extend from another class change the line below to
// module.exports = RFDevice => class AC1000Device extends MyGenericDevice(RFDevice) {
// and define MyGenericDevice like so
// module.exports = RFDevice => class MyGenericDevice extends RFDevice {
module.exports = RFDevice => class AC1000Device extends SocketDevice(RFDriver) {

    onRFInit() {
        super.onRFInit();

        // Init your device here
    }

};
