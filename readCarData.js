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
