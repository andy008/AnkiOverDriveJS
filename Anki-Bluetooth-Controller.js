const serviceUUID = 'BE15BEEF-6186-407E-8381-0BD89C4D8DF4';
const readUUID = 'BE15BEE0-6186-407E-8381-0BD89C4D8DF4';
const writeUUID = 'BE15BEE1-6186-407E-8381-0BD89C4D8DF4';

let cars = [];

async function scanForCars() {
    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [serviceUUID] }],
            optionalServices: [serviceUUID]
        });

        device.addEventListener('gattserverdisconnected', onDisconnected);
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(serviceUUID);
        const readCharacteristic = await service.getCharacteristic(readUUID);
        const writeCharacteristic = await service.getCharacteristic(writeUUID);

        readCharacteristic.startNotifications();
        readCharacteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);

        cars.push({
            device,
            server,
            service,
            readCharacteristic,
            writeCharacteristic,
            id: device.id,
            name: device.name
        });

        console.log(`Connected to car ${device.name}`);
    } catch (error) {
        console.log('Error scanning for cars:', error);
    }
}

function onDisconnected(event) {
    const device = event.target;
    console.log(`Device ${device.name} is disconnected`);
}

function handleCharacteristicValueChanged(event) {
    const value = event.target.value;
    console.log('Characteristic value changed:', value);
    // Parse the message
    parseMessage(new Uint8Array(value.buffer));
}

function parseMessage(content) {
    const id = content[1];
    if (id === 0x17) { // Ping response
        console.log(`[23] Ping response: ${bytesToString(content)}`);
    } else if (id === 0x19) { // Version response
        const version = content[2];
        console.log(`[25] Version response: ${version}`);
    } else if (id === 0x1b) { // Battery response
        const battery = content[2];
        console.log(`[27] Battery response: ${battery}`);
    } else {
        console.log(`Unknown message ${id}: ${bytesToString(content)}`);
    }
}

function bytesToString(bytes) {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

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

// Example of using the functions
async function controlCar() {
    await scanForCars();
    const car = cars[0];
    await setCarSpeed(car, 1000);
    await setCarTrackCenter(car, 0.0);
    await setCarLane(car, 1.0);
    await requestCarBattery(car);
}

controlCar();
