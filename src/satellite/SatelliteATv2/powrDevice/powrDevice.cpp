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
  voltage = map(_vVal, 0, 575, 0, 140);
  
  //7.4 is the ratio of 1000/135.
  //Basically scaling the current reading
  //into milliamps (mA)
  current = _cVal*7;
  
  payLoad = payLoad + voltage + ":" + current;
  return payLoad;
}

