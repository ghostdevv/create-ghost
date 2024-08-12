from time import sleep_ms
from machine import Pin

onboard_led = Pin("LED", Pin.OUT)

while True:
    onboard_led.toggle()
    sleep_ms(500)
