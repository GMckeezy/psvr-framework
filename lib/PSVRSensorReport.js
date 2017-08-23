const EventEmitter = require("events");

class PSVRSensorReport extends EventEmitter {
  constructor(options){
    super();

    this.buttons;
    this.volume = 0;
    this.isWorn;
    this.isDisplayActive;
    this.isMuted;
    this.isEarphonesConnected;

    this.timestamp1;

    this.rawGyroYaw1;
    this.rawGyroPitch1;
    this.rawGyroRoll1;

    this.rawMotionX1;
    this.rawMotionY1;
    this.rawMotionZ1;

    this.timestamp2;

    this.rawGyroYaw2;
    this.rawGyroPitch2;
    this.rawGyroRoll2;

    this.rawMotionX2;
    this.rawMotionY2;
    this.rawMotionZ2;

    this.yaw;
    this.roll;
    this.pitch;


    this.iRSensor; //1023 = near, 0 = far

    this.calStatus; //Calibration status? 255 = boot, 0-3 calibrating? 4 = calibrated, maybe a bit mask with sensor status? (0 bad, 1 good)?
    this.ready; //0 = not ready, 1 = ready -> uint ushort or byte?

    this.packetSequence;

    this.voltageReference; //Not sure at all, starts in 0 and suddenly jumps to 3
    this.voltageValue; //Not sure at all, starts on 0, ranges very fast to 255, when switched from VR to Cinematic and back varies between 255 and 254


    this.linearAcceleration1;
    this.angularAcceleration1;

    this.linearAcceleration2;
    this.angularAcceleration2;

    //DEBUG
    this.A;
    this.B;
    this.C;
    this.D;
    this.E;
    this.F;
    this.G;
    this.H;
  }

  parseSensor(data) {
    const sensor = new PSVRSensorReport();

    if(!data) {
      return sensor;
    }

    sensor.buttons = data[0]; //ENUM;
    sensor.volume = data[2];

    sensor.isWorn = (data[8] & 0x1) == 0x1 ? true : false;
    sensor.isDisplayActive = (data[8] & 0x2) == 0x2 ? false : true;
    sensor.isMuted = (data[8] & 0x8) == 0x8 ? true : false;

    sensor.isEarphonesConnected = (data[8] & 0x10) == 0x10 ? true : false;

    sensor.rawGyroYaw1 = data.readInt16LE(21);
    sensor.rawGyroPitch1 = data.readInt16LE(22);
    sensor.rawGyroRoll1 = data.readInt16LE(25);

    sensor.rawMotionX1 = data.readInt16LE(26);
    sensor.rawMotionY1 = data.readInt16LE(28);
    sensor.rawMotionZ1 = data.readInt16LE(30);

    sensor.timestamp2 = data.readInt16LE(32);

    sensor.rawGyroYaw2 = data.readInt16LE(37);
    sensor.rawGyroPitch2 = data.readInt16LE(38);
    sensor.rawGyroRoll2 = data.readInt16LE(41);
    
    sensor.RawMotionX2 = data.readInt16LE(42);
    sensor.RawMotionY2 = data.readInt16LE(44);
    sensor.RawMotionZ2 = data.readInt16LE(46);

    sensor.yaw = sensor.rawGyroYaw1 + sensor.rawGyroYaw2 + 1;
    sensor.roll = sensor.rawGyroRoll1 + sensor.rawGyroRoll2;
    sensor.pitch = sensor.rawGyroPitch1 + sensor.rawGyroPitch2;

    sensor.CalStatus = data[48];
    sensor.Ready = data[49];

    sensor.A = data[50];
    sensor.B = data[51];
    sensor.C = data[52];

    sensor.VoltageValue = data[53];
    sensor.VoltageReference = data[54];
    sensor.IRSensor = data.readInt16LE(55);

    sensor.D = data[58];
    sensor.E = data[59];
    sensor.F = data[60];
    sensor.G = data[61];
    sensor.H = data[62];

    sensor.PacketSequence = data[63];

    return sensor;
  }
}

module.exports = PSVRSensorReport;