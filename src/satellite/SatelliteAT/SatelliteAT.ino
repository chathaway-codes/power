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

#include<SoftwareSerial.h>

SoftwareSerial XBS(10,11);

int Cpin = A1;
int Cval = 0;
int Vpin = A0;
int Vval = 0;
char junkByte;
char readByte;
String satID = String("");
String package = String("");



void setup(){
  Serial.begin(9600);
  XBS.begin(9600);
  pinMode(Cpin, INPUT); 
  pinMode(Vpin, INPUT); 
  delay(500);
  getID();
}

void loop(){
  
  Cval = analogRead(Cpin);
  Vval = analogRead(Vpin);
  
  makePackage();
  
  Serial.println(package);

  XBS.println(package);
  
  delay(1000);
}


/******************************************************
This function grabs the ID of the attached radio and
prints it to a string named satID.
******************************************************/
void getID(){
  satID = ""; // Clear satID

  XBS.print("+++"); // Enter command mode
  
  delay(1100); // Allow 1s to take effect
  
  // Digest "OK\n" response
  while(XBS.available() > 0){
  junkByte = (char)XBS.read();
  }
  
  delay(100);
  
  /*
  TEST AREA BELOW///////////////////////////////////
  */
  XBS.println("ATID 1337"); // force PAN ID to coordinator's
  delay(250); // give time for response to fill buffer
  
  // Digest "OK\n" response
  while(XBS.available() > 0){
  junkByte = (char)XBS.read();
  }
  
  /*
  TEST AREA ABOVE///////////////////////////////////
  */
  
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


/******************************************************
This function puts the data into one string named 
package, so stuff can be sent in a single print.
******************************************************/
void makePackage(){
  package = "ID=" + satID + ":";
  if(Cval < 1000){
    package = package + "0";
  }
  if(Cval < 100){
    package = package + "0";
  }
  if(Cval < 10){
    package = package + "0";
  }
  package = package + Cval + ":";
  
  if(Vval < 1000){
    package = package + "0";
  }
  if(Vval < 100){
    package = package + "0";
  }
  if(Vval < 10){
    package = package + "0";
  }
  package = package + Vval + "::";  
}
