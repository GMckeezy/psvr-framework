const EventEmitter = require("events");
const usb = require('usb');

const PSVRReport = require('./PSVRReport');
const PSVRSensorReport = require('./PSVRSensorReport');
const PSVRDeviceInfoReport = require('./PSVRDeviceInfoReport');
const PSVRDeviceStatusReport = require('./PSVRDeviceStatusReport');
const PSVRUnsolicitedReport = require('./PSVRUnsolicitedReport');

const VID = 1356, PID = 2479;

class PSVR extends EventEmitter {
  constructor(options) {
    super();

    this._device = usb.findByIds(VID, PID);
    this.reports = new PSVRReport();

    if (this._device && this.claimWinUSBInterface()) {
      this.emit('ready', 'winusb');
      return this.initUSBDevice();
    } else {
      usb.on("attach", (d) => {
        if (d.deviceDescriptor.idVendor === VID &&
          d.deviceDescriptor.idProduct === PID) {
          this._device = d;
          this.initUSBDevice();
        }
      });
    }

  }

  claimWinUSBInterface() {
    try {
      this._device.__open();
      this._device.__claimInterface(0);
      return true;
    } catch(e) {
      return false;
    }
  }

  initUSBDevice() {
    this._device.open();
    let ctrlIface = this._device.interface(5);
    this.iface = ctrlIface.endpoint(4);
    ctrlIface.claim();
    let cmdReader = ctrlIface.endpoint(132);

    cmdReader.on("data", this._commandDataReceived.bind(this));
    cmdReader.on("error", (e) => {
      throw new Error(e);
    });
    cmdReader.startPoll();

    let iface4 = this._device.interface(4);
    iface4.claim();
    let sensorReader = iface4.endpoint(131);
    sensorReader.on("data", this._sensorDataReceived.bind(this));

    sensorReader.on("error", (error) => {
      console.log(`endpoint ${endpoint.descriptor.bEndpointAddress}`, error);
    });
    sensorReader.startPoll();


    sensorReader.on("error", (err) => {
      console.log("on error: ", err);
      this.emit("error", err);
    });

    process.on("SIGINT", () => {
      endpoint.stopPoll();
      this._device.close();
    });

    this.enableTracking();
  }

  _commandDataReceived(data) {
    let pos = 0;
    let message;

    while (pos < data.length) {
      let consumed;
      const msg = new PSVRReport();
      message = msg.parseResponse(data, pos);
      pos += message.dataLength + 4;
    }

    this.handleReport(message);
  }

  _sensorDataReceived(data) {
    const rep = new PSVRSensorReport();
    const message = rep.parseSensor(data);
    this.emit('sensorDataRecevied', message);
    return;
  }

  handleReport(report) {
    switch(report.reportID) {

      case 0x80:
        const dev = new PSVRDeviceInfoReport();
        const deviceInfoReport = dev.parseInfo(report.data);
        this.emit('deviceInfoReport', deviceInfoReport);
        break;

      case 0xF0:
        const stat = new PSVRDeviceStatusReport();
        const deviceStatusReport = stat.parseStatus(report.data);
        const masked = deviceStatusReport.enum.get(deviceStatusReport.status);
        this.emit('PSVRDeviceStatusReport', {
          isWorn: masked.has(deviceStatusReport.enum.isWorn),
          cinematic: masked.has(deviceStatusReport.enum.cinematic),
          headphones: masked.has(deviceStatusReport.enum.headphones),
          isDeviceOn: masked.has(deviceStatusReport.enum.headsetOn),
          isMuted: masked.has(deviceStatusReport.enum.isMuted),
          volume: deviceStatusReport.volume
        });
        break;

      case 0xA0:
        const resp = new PSVRUnsolicitedReport();
        const unsolicitedReport = resp.parseResponse(report.data);
        this.emit('PSVRUnsolicitedReport', unsolicitedReport)
        break;

    }
  }

  sendReport(report) {
    return new Promise(resolve => {
      const data = report.serialize();
      this.iface.transfer(data, (err, data) => resolve());
    })
    this.iface.transfer()
  }

  enableTracking() {
    return new Promise(resolve => {
      this.iface.transfer(Buffer.from([0x11, 0x00, 0xaa, 0x08, 0x80, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00]), (err, data) => {
        resolve();
      });
    })
  }

}

module.exports = PSVR;


