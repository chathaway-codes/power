/*
powrDevice.cpp
*/

#include "Arduino.h"
#include "powrDevice.h"


powrDevice::powrDevice(int cPin, int vPin, int outletID)
{
	pinMode(cPin, INPUT);
	pinMode(vPin, INPUT);
	_cPin = cPin;
	_vPin = vPin;
	_outletID = outletID;
    payLoad = String("");
}

String powrDevice::buildPayLoad(String radioID)
{
  //Clear out payLoad
  payLoad = "powr:" + radioID + ":" + _outletID + ":";
  
  //Take a reading from both ADCs
  _cVal = analogRead(_cPin);
  _vVal = analogRead(_vPin);
  
  //Figure out real numbers
  voltage = map(_vVal, 0, 650, 0, 140);
  //voltage = _vVal;
  current = _cVal;
  
  payLoad = payLoad + String(voltage, HEX) + ":" + String(current, HEX);
  return payLoad;
}

