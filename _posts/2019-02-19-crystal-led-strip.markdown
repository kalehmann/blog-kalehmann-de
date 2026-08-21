---
categories:       blog
date:             2019-02-19 23:13:12 +0200
description:  >-
    Dieser Post beschreibt den Zusammenbau eines LED-Streifens aus vier
    Salzlampen und wie dieser mit einem Arduino angesteuert wird.
lang:             de
last_modified_at: 2026-08-21 16:01:14 +0200
layout:           post
tags:
  - Arduino
  - Coding
  - Make
title:            Ein LED-Streifen aus Salzlampen
---

[![Vier leuchtende Salzkristalle auf einem Schreibtisch][illuminated_crystals]][illuminated_crystals]

Menschen lieben Dinge, die bunt sind und blinken.
Deswegen faszinieren mich LED-Streifen.
Außerdem habe ich bereits vor einiger Zeit ein paar Salzkristalle aus einem
deutschen Steinsalzbergwerk erhalten.
Diese möchte ich mit RGB-LEDs beleuchten.

Anstatt mir nun einen fertigen LED-Streifen mit Controller zu kaufen, habe ich
beschlossen, mir beides selbst zu basteln, um die Salzkristalle zu beleuchten.
Dabei werden vier RGB-LEDs von einem Arduino angesteuert und der Arduino-Sketch
nimmt über die serielle Schnittstelle von einer PC-Anwendung die Farben der LEDs
entgegen.

## Die Software zur Steuerung der LEDs

Die entsprechende Software zum Ansteuern des LED-Streifens ist in Qt geschrieben.
Das Design habe ich dabei durchgehend mit QML umgesetzt und die meiste Logik ist
in JavaScript implementiert.
Einzig zur Kommunikation mit dem Arduino über die serielle Schnittstelle habe
ich eine C++-Erweiterung geschrieben.

Die GUI besteht im Wesentlichen aus zwei Komponenten, der Verbindung mit dem
Arduino und der Ansteuerung der einzelnen LEDs.

[![Software zur Steuerung des LED-Streifens: Verbindungsanzeige][connection]][connection]{:.image-left}
[![Software zur Steuerung des LED-Streifens: Schalten einzelner LEDs][static]][static]{:.image-right}

Neben den statischen Farben für die LEDs können auch noch drei dynamische Modi
eingestellt werden.

### Knight Rider

<video autoplay loop muted>
  <source src="{{ "assets/2018-12-salz-led-streifen/knight_rider.webm" | absolute_url }}" type="video/webm">
  Your browser does not support the video tag.
</video>

[![Software zur Steuerung des LED-Streifens: Knight Rider Modus][knight_rider]][knight_rider]

### Rainbow

<video autoplay loop muted>
  <source src="{{ "assets/2018-12-salz-led-streifen/rainbow.webm" | absolute_url }}" type="video/webm">
  Your browser does not support the video tag.
</video>

[![Software zur Steuerung des LED-Streifens: Rainbow Modus][rainbow]][rainbow]

### Pulsate

<video autoplay loop muted>
  <source src="{{ "assets/2018-12-salz-led-streifen/pulsate.webm" | absolute_url }}" type="video/webm">
  Your browser does not support the video tag.
</video>

[![Software zur Steuerung des LED-Streifens: Pulsate Modus][pulsate]][pulsate]

### Der Arduino Sketch

Auf dem Arduino läuft ein kleiner 200-Zeilen Sketch, welcher mittels
[FastLED][fastled] die vier LEDs als WS2812-Module ansteuert und auf der
seriellen Schnittstelle auf Befehle lauscht.
Dabei werden die folgenden Befehle unterstützt:

- `WHAT ARE YOU?` gibt immer `I AM A LEDSTRIP` zurück
- `GET ALL` gibt die Farben aller LEDs als hexadezimales RGB-Tripel zurück
- `GET LED <n>` gibt die Farbe der LED `n` zwischen 1 und 4 zurück
- `SET LED <n> <RGB>` setzt die LED `n` auf die gegebene Farbe

Der Quellcode für den Arduino Sketch und die Qt-Anwendung ist auf GitLab in
dem Repository [`kalehmann/led_strip`][sources] einsehbar.

## Die Hardware

Das Ganze ist relativ spartanisch zusammengefrickelt.
In die einzelnen Salzkristalle habe ich mit einem normalen Bohrer Löcher für die
LEDs gebohrt.

[![Eine Bohrung in einen Salzkristall][crystal_drilling]][crystal_drilling]

Als nächstes habe ich die Basisstation zusammengebaut. Sie enthält einen
Arduino Nano, ein paar Extras für die Stromversorgung und eine 3-Watt-RGB-LED.
Immerhin ist das Chassis aus echtem Holz.

[![Das Chassis um den Arduino][base_assembled]][base_assembled]{:.image-left}
[![Das geöffnete Chassis um den Arduino][base_disassembled]][base_disassembled]{:.image-right}

[![Arduino mit zusätzlichem Micro-USB-Port][base_connectors]][base_connectors]{:.image-left}
[![Ein einzelner Salzkristall neben seinem Holzsockel][single_crystal]][single_crystal]{:.image-right}

Danach folgen noch drei einzelne PL9823-LEDs.
Diese enthalten je einen WS2811-Controller und sitzen in Holzsockeln.

Leider ist die einzelne 3-Watt-LED nicht mit den restlichen LEDs kompatibel.
Daher können die restlichen LEDs nicht mit ihr in Reihe geschaltet werden und
deswegen wird die 3-Watt-LED separat an den Arduino angeschlossen.

Die Stromversorgung der LEDs funktioniert getrennt von dem Arduino über einen
Micro-USB-Anschluss und wird durch einen Kondensator mit einer Kapazität von
einem Farad gepuffert.

[![Schaltplan des LED-Streifens][circuit]][circuit]


## Ergänzung (2026)

Ein schönes kleines Bastel- und Programmierprojekt.
Die Software ist vom Funktionsumfang her jedoch sehr eingeschränkt.
Mittlerweile ziehe ich für derartige Projekte [WLED][wled] vor.

  [base_assembled]: {{ "assets/2018-12-salz-led-streifen/base_assembled.jpg" | absolute_url }}
  [base_connectors]: {{ "assets/2018-12-salz-led-streifen/base_connectors.jpg" | absolute_url }}
  [base_disassembled]: {{ "assets/2018-12-salz-led-streifen/base_disassembled.jpg" | absolute_url }}
  [circuit]: {{ "assets/2018-12-salz-led-streifen/led_strip_circuit.jpg" | absolute_url }}
  [connection]: {{ "assets/2018-12-salz-led-streifen/connection.jpg" | absolute_url }}
  [crystal_drilling]: {{ "assets/2018-12-salz-led-streifen/salt_crystal_drilling.jpg" | absolute_url }}
  [fastled]: https://fastled.io/
  [illuminated_crystals]: {{ "assets/2018-12-salz-led-streifen/illuminated_salt_crystals.jpg" | absolute_url }}
  [knight_rider]: {{ "assets/2018-12-salz-led-streifen/knight_rider.jpg" | absolute_url }}
  [pulsate]: {{ "assets/2018-12-salz-led-streifen/pulsate.jpg" | absolute_url }}
  [rainbow]: {{ "assets/2018-12-salz-led-streifen/rainbow.jpg" | absolute_url }}
  [single_crystal]: {{ "assets/2018-12-salz-led-streifen/single_crystal.jpg" | absolute_url }}
  [sources]: https://gitlab.com/kalehmann/crystal_led_strip
  [static]: {{ "assets/2018-12-salz-led-streifen/static.jpg" | absolute_url }}
  [wled]: https://kno.wled.ge/
