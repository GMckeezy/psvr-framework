const EventEmitter = require("events");

class PSVRReport extends EventEmitter {
  constructor(options) {
    super();

    this.reportID;
    this.commandStatus = 0xaa;
    this.dataStart;
    this.dataLength;
    this.data;
  }

  toBytes(src) {
    var bytes = [];
    for (var i = 0; i < src.length; ++i) {
      bytes.push(src.charCodeAt(i));
    }
    return bytes;
  }

  serialize() {
    let data = [];
    data.push(this.reportID);
    data.push(0x00);
    data.push(this.dataStart);
    data.push(this.dataLength);
    data = data.concat(this.data);
    return data;
  }

  parseResponse(data, offset){
    const cmd = new PSVRReport();
    cmd.reportID = data[offset];
    cmd.commandStatus = data[offset + 1];
    cmd.dataStart = data[offset + 2];
    cmd.dataLength = data[offset + 3];
    cmd.data = new Array(cmd.dataLength)
    cmd.data = data.slice(offset + 4, data.length);
    return cmd;
  }

  enableVRTracking(){
    const cmd = new PSVRReport();

    cmd.reportID = 0x11;
    cmd.dataStart = 0xaa;
    cmd.dataLength = 8;
    cmd.data = [...Buffer.from('0xFFFFFF00'), ...Buffer.from('0x00000000')];

    return cmd;
  }

  headsetOn() {
    const cmd = new PSVRReport();

    cmd.reportID = 0x17;
    cmd.dataStart = 0xaa;
    cmd.dataLength = 4;
    cmd.data = Buffer.from('0x00000001');

    return cmd;    
  }

  headsetOff() {
    const cmd = new PSVRReport();
    cmd.reportID = 0x17;
    cmd.dataStart = 0xaa;
    cmd.dataLength = 4;
    cmd.data = Buffer.from('0x00000000');

    return cmd;
  }

  enterVRMode() {
    const cmd = new PSVRReport();

    cmd.reportID = 0x23;
    cmd.dataStart = 0xaa;
    cmd.dataLength = 4;
    cmd.data = Buffer.from('0x00000001');

    return cmd;    
  }

  exitVRMode() {
    const cmd = new PSVRReport();

    cmd.reportID = 0x23;
    cmd.dataStart = 0xaa;
    cmd.dataLength = 4;
    cmd.data = Buffer.from('0x00000000');

    return cmd;      
  }

  boxOff() {
    const cmd = new PSVRReport();

    cmd.reportID = 0x13;
    cmd.dataStart = 0xaa;
    cmd.dataLength = 4;
    cmd.data = Buffer.from('0x00000001');

    return cmd; 
  }

  setCinematicConfiguration(screenDistance, screenSize, brightness, micVolume, unknownVRSetting) {
    const cmd = new PSVRReport();

    cmd.reportID = 0x21;
    cmd.dataStart = 0xaa;
    cmd.dataLength = 16;
    cmd.data = [ 0xC0, screenSize, screenDistance, 0x14, 0, 0, 0, 0, 0, 0, brightness, micVolume, 0, 0, 0, 0 ];

    return cmd;    
  }

  readDeviceInfo() {
    const cmd = new PSVRReport();

    cmd.reportID = 0x81;
    cmd.dataStart = 0xaa;
    cmd.dataLength = 8;
    cmd.data =  [0x80, 0, 0, 0, 0, 0, 0, 0 ];

    return cmd;    
  }
}

module.exports = PSVRReport;