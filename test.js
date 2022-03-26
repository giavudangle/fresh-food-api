const DEVICE = require('./src/models/Device.model');
const USER = require('./src/models/User.model');
async function newFunction() {
  const staff = await USER.find({ role: 2 });
  console.log(staff)
  const allDevice = [];

  if (staff.length != 0) {
    for (let i = 0; i < staff.length; i++) {
      const devices = await DEVICE.find({
        creatorUser: staff[0]._id,
        statusDevice: 1
      });
      devices.forEach(element => {
        allDevice.push(element.fcm);
      });
    }
  }
  console.log(allDevice);
}

newFunction();
