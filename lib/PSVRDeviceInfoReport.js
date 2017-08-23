const EventEmitter = require("events");

class PSVRDeviceInfoReport extends EventEmitter {
  constructor(options){
    super();

    this.unknownA;
    this.minorVersion;
    this.majorVersion;
    this.unknownB;
    this.unknownC;
    this.unknownD;
    this.serialNumber; //16 bytes
    this.unknownE;
    this.unknownF;
    this.unknownG;
    this.unknownH;
    this.unknownI;    
  }

  parseInfo(data) {
    const info = new PSVRDeviceInfoReport();

    info.unknownA = (data[0] | data[1] << 8);
    info.minorVersion = data[2];
    info.majorVersion = data[3];
    info.unknownB = (data[4] | data[5] << 8);
    info.unknownC = (data[6] | data[7] << 8 | data[8] << 16 | data[9] << 24);
    info.unknownD = (data[10] | data[11] << 8);
    info.serialNumber = data.slice(12, 28).toString('ascii');
    info.unknownE = (data[28] | data[29] << 8 | data[30] << 16 | data[31] << 24);
    info.unknownF = (data[32] | data[33] << 8 | data[34] << 16 | data[35] << 24);
    info.unknownG = (data[36] | data[37] << 8 | data[38] << 16 | data[39] << 24);
    info.unknownH = (data[40] | data[41] << 8 | data[42] << 16 | data[43] << 24);
    info.unknownH = (data[44] | data[45] << 8 | data[46] << 16 | data[47] << 24);

    return info;
  }
}

module.exports = PSVRDeviceInfoReport;