---
layout:       post
title:        Kristall Ledstreifen
date:         2019-02-19 23:13:12 +0200
lang:         de
categories:   blog
tags:
  - Make
  - Coding
  - Arduino
---

![Vier leuchtende Salz Kristalle auf einem Schreibtisch]({{ "assets/salz-led-strip/leuchtende_salz_kristalle.jpg" | absolute_url }})

Ich mag Dinge die bunt sind und blinken. Deswegen faszinieren mich schon länger
frei programmierbare LED Streifen. Außerdem habe ich bereits vor einiger Zeit ein
paar Salzkristalle aus einem deutschen Steinsalzbergwerk erhalten.

Anstatt mir nun einen fertigen LED Streifen zu kaufen habe ich beschlossen mir
selbst einen zu basteln um die Salzkristalle zu beleuchten. Dabei werden
4 RGB LEDs von einem Arduino angesteuert und können über eine Anwendung über USB
programmiert werden.

## Die Software

Die entsprechende Software zum Ansteuern des LED Streifens habe ich in Qt
geschrieben. Das Design habe ich dabei durchgehend mit QML umgesetzt, einzig
zur Kommunikation mit dem Arduino über die serielle Schnittstelle habe ich
eine C++ Erweiterung geschrieben.

Der Quellcode ist auf GitLab in dem Repository
[kalehmann/led_strip](https://gitlab.com/kalehmann/crystal_led_strip)
einsehbar.

Die Gui besteht im Wesentlichen aus zwei Komponenten, der Verbindung mit dem
Arduino

![Software zur Steuerung des LED Streifens: Verbindungsanzeige]({{ "assets/salz-led-strip/connection.jpg" | absolute_url }})

und der Ansteuerung der einzelnen LEDs.

![Software zur Steuerung des LED Streifens: Schalten einzelner LEDs]({{ "assets/salz-led-strip/static.jpg" | absolute_url }})

Neben den statischen Farben für die LEDs können auch noch 3 dynamische Modi
eingestellt werden.

### Knight Rider

<video autoplay loop>
  <source src="{{ "assets/salz-led-strip/KnightRider.webm" | absolute_url }}" type="video/webm">
  Your browser does not support the video tag.
</video>

![Software zur Steuerung des LED Streifens: Knight Rider Modus]({{ "assets/salz-led-strip/knight_rider.jpg" | absolute_url }})

### Rainbow

<video autoplay loop>
  <source src="{{ "assets/salz-led-strip/Rainbow.webm" | absolute_url }}" type="video/webm">
  Your browser does not support the video tag.
</video>

![Software zur Steuerung des LED Streifens: Rainbow Modus]({{ "assets/salz-led-strip/rainbow.jpg" | absolute_url }})

### Pulsate

<video autoplay loop>
  <source src="{{ "assets/salz-led-strip/Pulsate.webm" | absolute_url }}" type="video/webm">
  Your browser does not support the video tag.
</video>

![Software zur Steuerung des LED Streifens: Pulsate Modus]({{ "assets/salz-led-strip/pulsate.jpg" | absolute_url }})

## Die Hardware

Das ganze ist relativ spartanisch zusammengefrickelt. Die einzelnen
Salzkristalle habe ich problemlos mit einem normalen Bohrer angebohrt.

![Eine Bohrung in einen Salzkristall]({{ "assets/salz-led-strip/salzkristall_bohrung.jpg" | absolute_url }})

Als nächstes habe ich die Basisstation zusammengebaut. Sie enthält einen
Arduino Nano, ein paar Extras für die Stromversorgung und eine 3 Watt RGB-LED.
Immerhin ist das Chassis aus echtem Holz.

![Das Chassis um den Arduino]({{ "assets/salz-led-strip/base_assembled.jpg" | absolute_url }})

![Das geöffnete Chassis um den Arduino]({{ "assets/salz-led-strip/base_disassembled.jpg" | absolute_url }})

![Arduino mit zusätzlichem Micro Usb Port]({{ "assets/salz-led-strip/base_connectors.jpg" | absolute_url }})

Danach folgen noch 3 einzelne PL9823 LEDs. Diese enthalten je einen WS2811
Controller und sitzen in Holzsockeln.

![Ein einzelner Salzkristall neben seinem Holzsockel]({{ "assets/salz-led-strip/single_crystal.jpg" | absolute_url }})

Leider ist der 3 Watt Powerdot nicht mit den restlichen LEDs kompatibel, sie
können nicht in Reihe geschalten werden. Deswegen werden diese separat an den
Arduino angeschlossen.

Die Stromversorgung der LEDs funktioniert seperat über einen Micro USB Anschluss
und wird durch einen Kondensator mit einer Kapazität von einem Farad gepuffert.

![Schaltplan des LED Streifens]({{ "assets/salz-led-strip/LedStrip_Steckplatine.jpg" | absolute_url }})
