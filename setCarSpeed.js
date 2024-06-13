async function setCarSpeed(car, speed, accel = 1000) {
    const data = new Uint8Array(7);
    data[0] = 0x06;
    data[1] = 0x24;
    data[2] = speed & 0xFF;
    data[3] = (speed >> 8) & 0xFF;
    data[4] = accel & 0xFF;
    data[5] = (accel >> 8) & 0xFF;
    await car.writeCharacteristic.writeValue(data);
}


// more complex example


async function setCarSpeed(car, speed, accel = 1000) {
    const data = new Uint8Array(7);
    data[0] = 0x06;
    data[1] = 0x24;
    data[2] = speed & 0xFF;
    data[3] = (speed >> 8) & 0xFF;
    data[4] = accel & 0xFF;
    data[5] = (accel >> 8) & 0xFF;
    await car.writeCharacteristic.writeValue(data);
}

async function setCarTrackCenter(car, offset) {
    const data = new Uint8Array(6);
    data[0] = 0x05;
    data[1] = 0x2c;
    const offsetBytes = new Float32Array([offset]);
    data.set(new Uint8Array(offsetBytes.buffer), 2);
    await car.writeCharacteristic.writeValue(data);
}

async function setCarLane(car, lane) {
    const data = new Uint8Array(12);
    data[0] = 0x0b;
    data[1] = 0x25;
    const horizontalSpeedmm = 250, horizontalAccelmm = 1000;
    data[2] = horizontalSpeedmm & 0xFF;
    data[3] = (horizontalSpeedmm >> 8) & 0xFF;
    data[4] = horizontalAccelmm & 0xFF;
    data[5] = (horizontalAccelmm >> 8) & 0xFF;
    const laneBytes = new Float32Array([lane]);
    data.set(new Uint8Array(laneBytes.buffer), 6);
    await car.writeCharacteristic.writeValue(data);
}

async function requestCarBattery(car) {
    const data = new Uint8Array([0x01, 0x1a]);
    await car.writeCharacteristic.writeValue(data);
}
