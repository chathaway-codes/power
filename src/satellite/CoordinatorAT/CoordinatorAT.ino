/*
	Receives data from a software serial port that is connected
	to a radio, prints data to hard serial port.
	
	Radio: XBee Series 2
	Firmware: ZigBee Coordnator AT
	*/
	
#include<SoftwareSerial.h>
	
	SoftwareSerial XBS(10, 11);
	SoftwareSerial LCDS(7, 6);
	byte setcursorLCD = 12;
        
	char readChar;
	void setup(){
	  Serial.begin(9600);
	  XBS.begin(9600);
          LCDS.begin(9600);
          LCDS.listen();
          // Cursor move command
          LCDS.write(setcursorLCD);
          LCDS.print("IP: 192.168.1.187");
          XBS.listen();
	}
	
	void loop(){
	  if(XBS.available() > 0){
	    readChar = XBS.read();
	    Serial.print(readChar);   
	  }
	}
