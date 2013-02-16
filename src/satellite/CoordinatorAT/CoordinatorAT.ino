/*
Receives data from a software serial port that is connected
to a radio, prints data to hard serial port.

Radio: XBee Series 2
Firmware: ZigBee Coordnator AT
*/

#include<SoftwareSerial.h>

SoftwareSerial XBS(10, 11);


char readChar;
void setup(){
  Serial.begin(9600);
  XBS.begin(9600);
}

void loop(){
  if(XBS.available() > 0){
    readChar = XBS.read();
    Serial.print(readChar);    
  }
  delay(100);
}
