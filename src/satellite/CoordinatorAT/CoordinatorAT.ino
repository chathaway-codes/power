/*
	Receives data from a software serial port that is connected
	to a radio, prints data to hard serial port.
	
	Radio: XBee Series 2
	Firmware: ZigBee Coordnator AT
	*/
	
#include<SoftwareSerial.h>
#include <MsTimer2.h>
	
	SoftwareSerial XBS(10, 11);
	SoftwareSerial LCDS(7, 6);
	byte setCursorLCD = 12;
	byte turnOnBackLight = 19;
        
	char readChar;
	void setup(){
          noInterrupts();
	  Serial.begin(9600);
	  XBS.begin(9600);
          LCDS.begin(9600);
          LCDS.listen();
          // Cursor move command
          LCDS.write(setCursorLCD);
		  
          LCDS.write(turnOnBackLight);
          LCDS.print("IP: 192.168.1.187");
          XBS.listen();
          interrupts();
          MsTimer2::set(15000, resetLCD);
          MsTimer2::start();       
	}
	
	void loop(){
	  if(XBS.available() > 0){
	    readChar = XBS.read();
	    Serial.print(readChar);   
	  }
	}

        void resetLCD(){
          LCDS.listen();
          LCDS.write(setCursorLCD);
          LCDS.write(turnOnBackLight);
          LCDS.print("IP: 192.168.1.187");
          XBS.listen();
        }
