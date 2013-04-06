/*
powrDevice.h
*/

#ifndef powrDevice_h
#define powrDevice_h

#include "Arduino.h"

class powrDevice
 {
  private: 
    int _cPin;
    int _vPin;
    int _cVal;
    int _vVal;
	int _outletID;
    String payLoad;
    boolean enable; //toggles reporting for an outlet
    
  public:
    int current;
    int voltage;
    powrDevice(int cPin, int vPin, int outletID);
    String buildPayLoad(String radioID);
   };
 
 #endif
