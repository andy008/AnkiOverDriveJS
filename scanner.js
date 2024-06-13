const serviceUUID = 'be15beef-6186-407e-8381-0bd89c4d8df4';
const readUUID = 'be15bee0-6186-407e-8381-0bd89c4d8df4';
const writeUUID = 'be15bee1-6186-407e-8381-0bd89c4d8df4';

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

// Handling disconnections and notifications
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
