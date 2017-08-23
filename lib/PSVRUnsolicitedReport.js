const EventEmitter = require("events");
const Enum = require("enum");

class PSVRUnsolicitedReport extends EventEmitter {
  constructor(options) {
    super();

    this.reportID;
    this.resultCode;
    this.message;

    this.enum = new Enum({
      'Ok': 0,
      'UnknownReport': 1,
      'UnknownA': 2,
      'BadReportLength': 3
    });
  }

  parseResponse(data) {
    const response = new PSVRUnsolicitedReport();

    response.reportID = data[0];
    response.resultCode = this.enum.get(data[1]).key;
    response.message = data.slice(2, data.length).toString('ascii').replace(/\0/g, '');

    return response;
  }
}

module.exports = PSVRUnsolicitedReport;