# AnkiOverDriveJS
Control code for ANKI Overdrive 
Inspired by @MasterAirscrachDev Unity/C# version.
https://github.com/MasterAirscrachDev/Anki-Partydrive

## API
Detailed docs here https://github.com/andy008/AnkiOverDriveJS/blob/main/API-README.md 

## Scanning for Cars:

Uses navigator.bluetooth.requestDevice to find Bluetooth devices offering the required service UUID.
Connects to the GATT server and retrieves the primary service and characteristics.

## Handling Disconnection and Notifications:

onDisconnected handles disconnections.
handleCharacteristicValueChanged handles notifications from the car.

## Setting Car Parameters:

Functions setCarSpeed, setCarTrackCenter, and setCarLane are provided to control the car.
requestCarBattery is provided to request the car’s battery status.


## UUIDS
UUIDs are generally predefined and hardwired into the devices. In the case of Bluetooth Low Energy (BLE) devices like the Anki Overdrive cars, these UUIDs represent specific services and characteristics that the device exposes. Manufacturers of BLE devices define these UUIDs, and they are used to identify services and characteristics for communication.



# Basic Steps Using Web Bluetooth API
## Requesting a Bluetooth Device:

Use navigator.bluetooth.requestDevice() to prompt the user to select a Bluetooth device.
Connecting to the GATT Server:

After the user selects a device, connect to its GATT server using device.gatt.connect().
Accessing Services and Characteristics:

Once connected, access the desired service using server.getPrimaryService().
Access the characteristics (read/write) using service.getCharacteristic().
Reading and Writing Data:

Use the characteristic.readValue() method to read data.
Use the characteristic.writeValue() method to write data.

## Listening for Notifications:

Use characteristic.startNotifications() and attach an event listener to handle incoming data.