/*
powrDevice.cpp
*/

#include "Arduino.h"
#include "powrDevice.h"


powrDevice::powrDevice(int vPin, int cPin, int outletID)
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
  voltage = _vVal;
  
  //7.4 is the ratio of 1000/135.
  //Basically scaling the current reading
  //into milliamps (mA)
  current = _cVal;
  
  payLoad = payLoad + voltage + ":" + current;
  return payLoad;
}

