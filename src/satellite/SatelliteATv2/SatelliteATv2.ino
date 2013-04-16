/*
	Sends a string containing an ID and two variables
	over a software serial channel to a radio.
	An arduino programmed with the receiver software
	will print this data to it's own serial port.
	
	Radio: XBee Series 2
	Firmware: ZigBee Router AT V.22A7

	ROUTER Settings:
	PAN ID = 1337
	ATSH = 0013A200
	ATSL = 4091A33D
	ATDH = 0013A200
	ATDL = 4091A2BD
	*/
	
	#include <SoftwareSerial.h>
	#include <powrDevice.h>
	
	SoftwareSerial XBS(10,11);
	int LEDpin = 2;
	int Cpin = A1;
	int Vpin = A0;
	String satID = String("");
	String package1 = String("");
	//String package2 = String("");
	
	// Devices: current pin, voltage pin, outlet ID
	powrDevice outlet1 = powrDevice(A0, A1, 0x1);
	//powrDevice outlet2 = powrDevice(A2, A3, 0x2);
	
	
	void setup(){
          pinMode(LEDpin, OUTPUT);
          digitalWrite(LEDpin, HIGH);
	  Serial.begin(9600);
	  XBS.begin(9600);
	  delay(500);
	  getID();
	}
	
	void loop(){
	  package1 = outlet1.buildPayLoad(satID);
	//  package2 = outlet2.buildPayLoad(satID);
	 
	  Serial.println(package1);
	  if(XBS.println(package1))
          {
            digitalWrite(LEDpin, LOW);
            delay(100);
            digitalWrite(LEDpin, HIGH);
          }
	//  Serial.println(package2);
	//  XBS.println(package2);
	
	  delay(5000);
	}
	
	
	/******************************************************
	This function grabs the ID of the attached radio and
	prints it to a string named satID.
	******************************************************/
	void getID(){
	  char junkByte;
	  char readByte;
	  satID = ""; // Clear satID
	
	  XBS.print("+++"); // Enter command mode
	 
	  delay(1100); // Allow 1s to take effect
	 
	  // Digest "OK\n" response
	  while(XBS.available() > 0){
	  junkByte = (char)XBS.read();
	  }
 
	  delay(100);
	
	  XBS.println("ATID 1337"); // force PAN ID to coordinator's
	  delay(250); // give time for response to fill buffer
	 
	  // Digest "OK\n" response
	  while(XBS.available() > 0){
	  junkByte = (char)XBS.read();
	  }
	 
	  XBS.println("ATSL"); // request source ID 
	 
	  delay(250); // give time for response to fill buffer
	 
	  while(XBS.available() > 0){
	  readByte = XBS.read();
	  satID = satID + readByte;
	  }
	 
	  XBS.println("ATCN"); // kill connection
	  delay(500);

	  // Digest "OK\n" response again
	  while(XBS.available() > 0){
	  junkByte = (char)XBS.read();
	  }
	}
