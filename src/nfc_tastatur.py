#!/usr/bin/python3

import time
from smartcard.System import readers
from smartcard.Exceptions import NoCardException
from smartcard.util import toHexString
import pyautogui


def get_card_uid(connection):
    """Retrieve the UID from the card."""
    GET_UID_APDU = [0xFF, 0xCA, 0x00, 0x00, 0x00]
    try:
        response, sw1, sw2 = connection.transmit(GET_UID_APDU)
        if sw1 == 0x90 and sw2 == 0x00:
            return toHexString(response)
        else:
            return f"Error: SW1=0x{sw1:X} SW2=0x{sw2:X}"
    except Exception as e:
        return f"Exception: {str(e)}"


def monitor_card_reader():
    """Continuously monitor the card reader for card detection."""
    try:
        # Get the list of available readers
        available_readers = readers()
        if not available_readers:
            print("No smart card readers found.")
            return

        # Use the first available reader
        reader = available_readers[0]
        print(f"Using reader: {reader}")

        while True:
            try:
                connection = reader.createConnection()
                connection.connect()
                
                # Wait for a moment to ensure card is properly powered
                time.sleep(0.5)
                
                # Get the UID of the card
                uid = get_card_uid(connection)
                if not uid.startswith("Error") and not uid.startswith("Exception"):
                    print(f"Card detected with UID: {uid}")
                    pyautogui.typewrite(uid+"\n")
                else:
                    print(f"Fehler beim Abrufen der UID: {uid}")
                
            except NoCardException:
                print("")
            except Exception as e:
                print(f"Exception: {str(e)}")
            finally:
                # Add a delay before trying again
                time.sleep(1)
    
    except KeyboardInterrupt:
        print("Monitoring stopped.")
    
if __name__ == "__main__":
    monitor_card_reader()

