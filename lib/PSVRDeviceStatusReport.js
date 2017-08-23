const EventEmitter = require("events");;
const Enum = require("enum");

class PSVRDeviceStatusReport extends EventEmitter {
  constructor() {
    super();

    this.status;
    this.volume;
    this.unknownA;
    this.bridgeOutputID;
    this.unknownB;

    this.enum = new Enum({
      headsetOn: (1 << 0),
      isWorn: (1 << 1),
      cinematic: (1 << 2),
      UnknownA: (1 << 3),
      headphones: (1 << 4),
      isMuted: (1 << 5),
      CEC: (1 << 6),
      UnknownC: (1 << 7),
    });
  }

  parseStatus(data) {
    const info = new PSVRDeviceStatusReport();

    info.status = data[0];
    info.volume = (data[1] | data[2] << 8 | data[3] << 16 | data[4] << 24);
    info.unknownA = (data[5] | data[6] << 8);
    info.bridgeOutputID = data[7];
    info.unknownB = data[7];

    return info;
  }
}

module.exports = PSVRDeviceStatusReport;