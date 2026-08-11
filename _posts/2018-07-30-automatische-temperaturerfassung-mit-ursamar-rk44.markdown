---
categories:       blog
date:             2018-07-30 13:12:29 +0200
description:  >-
    Dieser Post beschreibt an einem praktischen Beispiel, wie mit einem
    Raspberry Pi die Temperatur an einem Ursamar-RK44-Temperaturregler
    automatisiert erfasst werden kann.
lang:             de
last_modified_at: 2026-08-11 22:35:53 +0200
layout:           post
tags:
  - Make
  - Coding
  - RaspberryPi
title:            Automatische Temperaturerfassung mit einem Ursamar-RK44-Temperaturregler
---

## Die Ausgangssituation

Ein ehemaliger Schulkamerad von mir belegt gerade im Rahmen seines
Studiums ein Praktikum in einem Chemieunternehmen.
Ein Prozess dieses Unternehmens umfasst die thermische Vorbehandlung von
Reststoffen aus der Salzsäurehydrolyse unter pyrolytischen Bedingungen.

Das Ziel des Praktikums ist es, diesen Prozess zu optimieren, indem in
Versuchsreihen die optimale Temperatur zur Verdampfung gefunden wird.

In den Versuchen werden die Rückstoffe der Hydrolyse in einem Muffelofen
mit einem Ursamar-RK44-Temperaturregler über unterschiedlich lange Zeiträume
auf verschiedene Temperaturen erhitzt.

[![Beheizter Muffelofen mit offener Tür][muffelofen]][muffelofen]

Diese Versuche erstrecken sich jeweils über mehrere Stunden.
Schnell zeigte sich, dass manuelle Messungen zu monoton sind und am besten
wegautomatisiert werden.

Dafür habe ich eine Lösung auf Basis eines Raspberry Pi entwickelt, um die
Temperatur an dem Temperaturregler aufzunehmen und auszuwerten.

## Auslesen der Temperatur an dem Ursamar-RK44-Temperaturregler

Der Temperaturregler gibt die aktuelle Temperatur auf einer LED-Anzeige aus.
Diese Schnittstelle ist jedoch ungeeignet zum automatischen Erfassen der
Temperatur.
[![Ursamar-RK44 Frontalansicht][rk44_front]][rk44_front]
Ein Blick auf den Schaltplan verrät, dass zwischen den Klemmen 10 und 12 eine
Spannung proportional zur gemessenen Temperatur anliegt.
[![Ursamar-RK44 Schaltplan][rk44_schaltplan]][rk44_schaltplan]

Diese Spannung - Ux - lässt sich mit einem Raspberry Pi und einem Analog
Digital Converter (ADC) auslesen und als Grundlage für die Berechnung der
Temperatur nehmen.

### Erfassen der Spannung an dem Temperaturregler

Zum Messen der Spannung wird der 16-Bit-ADC ADS1115 verwendet.
Dieser wird direkt an den Raspberry Pi angeschlossen und dadurch mit 3,3 V
betrieben.
Allerdings variiert die an dem Ursamar-RK44 zu messende Spannung Ux zwischen
0 und 10 V.
Da die Eingänge des Raspberry Pi und des ADCs nicht direkt mit den 0-10 V
des Temperaturreglers belastet werden dürfen, muss die Eingangsspannung zunächst
reduziert werden.

Dies lässt sich mit einem einfachen Spannungsteiler bewerkstelligen.
Dafür werden zwei Widerstände von 3,3 kΩ und 10 kΩ verwendet.
Das Teilungsverhältnis <math><mi>t</mi></math> für diesen Spannungsteiler
errechnet sich dann folgendermaßen:

<math display="block">
  <mrow>
    <mi>t</mi>
    <mo>=</mo>
    <mfrac>
      <msub>
        <mi>R</mi>
        <mn>2</mn>
      </msub>
      <mrow>
        <msub>
          <mi>R</mi>
          <mn>1</mn>
        </msub>
        <mo>+</mo>
        <msub>
          <mi>R</mi>
          <mn>2</mn>
        </msub>
      </mrow>
    </mfrac>
    <mo>=</mo>
    <mfrac>
      <mrow>
        <mn>3,3</mn>
        <mi>kΩ</mi>
      </mrow>
      <mrow>
        <mrow>
          <mn>10</mn>
          <mi>kΩ</mi>
        </mrow>
        <mo>+</mo>
        <mrow>
          <mn>3,3</mn>
          <mi>kΩ</mi>
        </mrow>
      </mrow>
    </mfrac>
    <mo>≈</mo>
    <mn>0,25</mn>
  </mrow>
</math>

Zur optimalen Erfassung von Werten wird der Messbereich des ADC auf -4,096 V bis
+4,096 V eingestellt.
Somit lässt sich die
Messauflösung <math><msub><mi>R</mi><mi>ADC</mi></msub></math> des
ADC wie folgt ermitteln:

<math display="block">
  <mtable>
    <mtr>
      <mtd>
        <msub>
          <mi>R</mi>
          <mi>ADC</mi>
        </msub>
      </mtd>
      <mtd>
        <mo>=</mo>
      </mtd>
      <mtd>
        <mfrac>
          <mrow>
            <msub>
              <mi>U</mi>
              <mi>Max</mi>
            </msub>
            <mo>-</mo>
            <msub>
              <mi>U</mi>
              <mi>Min</mi>
            </msub>
          </mrow>
          <msup>
            <mn>2</mn>
            <mn>16</mn>
          </msup>
        </mfrac>
      </mtd>
    </mtr>
    <mtr>
      <mtd></mtd>
      <mtd>
        <mo>=</mo>
      </mtd>
      <mtd>
        <mfrac>
          <mrow>
            <mn>4,096</mn>
            <mi>V</mi>
            <mo>-</mo>
            <mo>(</mo>
            <mn>-4,096</mn>
            <mi>V</mi>
            <mo>)</mo>
          </mrow>
          <msup>
            <mn>2</mn>
            <mn>16</mn>
          </msup>
        </mfrac>
        <mo>=</mo>
        <mfrac>
          <mrow>
            <mn>8,192</mn>
            <mi>V</mi>
          </mrow>
          <msup>
            <mn>2</mn>
            <mn>16</mn>
          </msup>
        </mfrac>
      </mtd>
    </mtr>
    <mtr>
      <mtd></mtd>
      <mtd>
        <mo>≈</mo>
      </mtd>
      <mtd>
        <mrow>
          <mn>125</mn>
          <mi>μV</mi>
        </mrow>
      </mtd>
    </mtr>
  </mtable>
</math>

Daraus ergibt sich folgende Formel zur Berechnung der Spannung am
Temperaturregler aus dem Messwert des ADCs:

<math display="block">
  <mtable>
    <mtr>
      <mtd>
        <msub>
          <mi>U</mi>
          <mi>x</mi>
        </msub>
      </mtd>
      <mtd>
        <mo>=</mo>
      </mtd>
      <mtd>
        <mrow>
          <mi>Messwert</mi>
          <mo>⋅</mo>
          <mfrac>
            <mn>1</mn>
            <mi>t</mi>
          </mfrac>
          <mo>⋅</mo>
          <msub>
            <mi>R</mi>
            <mi>ADC</mi>
          </msub>
        </mrow>
      </mtd>
    </mtr>
    <mtr>
      <mtd></mtd>
      <mtd>
        <mo>=</mo>
      </mtd>
      <mtd>
        <mrow>
          <mi>Messwert</mi>
          <mo>⋅</mo>
          <mfrac>
            <mn>1</mn>
            <mn>0,25</mn>
          </mfrac>
          <mo>⋅</mo>
          <mfrac>
            <mrow>
              <mn>8,192</mn>
              <mi>V</mi>
            </mrow>
            <msup>
              <mn>2</mn>
              <mn>16</mn>
            </msup>
          </mfrac>
        </mrow>
      </mtd>
    </mtr>
    <mtr>
      <mtd></mtd>
      <mtd>
        <mo>≈</mo>
      </mtd>
      <mtd>
        <mfrac>
          <mi>Messwert</mi>
          <mn>2000</mn>
        </mfrac>
      </mtd>
    </mtr>
  </mtable>
</math>

Nun lässt sich mit folgendem Code die Spannung an dem Temperaturregler lesen.

{% highlight python %}
import Adafruit_ADS1x15

adc = Adafruit_ADS1x15.ADS1115()
value = adc.read_adc(0, gain=1)
voltage = value / 2000.0

print("Spannung: {:.2} V".format(voltage))

{% endhighlight %}

## Hardware

Der Raspberry Pi soll portabel eingesetzt werden. Deswegen benötigt er ein
entsprechendes Gehäuse.
Außerdem sollen jederzeit Messreihen gestartet und beendet werden können,
ohne zunächst eine Netzwerkverbindung aufzubauen oder umständlich Tastatur und
Bildschirm anzuschließen.
Daher werden ein paar Taster und ein kleines Display benötigt.

Die benötigten Teile habe ich mir innerhalb von einer Woche zusammengesucht und
bestellt und an einem ruhigen Samstag zusammengefrickelt.

### Das Gehäuse

Die Überlegung, welche Grundlage ich für das Gehäuse nehmen soll, hat mich einige
Zeit gekostet.
Schließlich habe ich mich für Videokassette entschieden, genauer gesagt deren
Chassis.
Die Abmessungen sind perfekt, um einen Raspberry Pi mit einer zusätzlichen
Platine für Display, Taster und ADC zu beherbergen.
Außerdem lassen sich Videokassetten mittlerweile kostenlos bekommen.

### Das Display

Die Anforderungen an das Display sind recht überschaubar:
- einfache Ansteuerung
- geringe Kosten
- Ausgabe kurzer Informationen (Messspannung, Nummer der Messung ...)
- im Freien immer noch erkennbar

Schlussendlich habe ich mich für eine monochromes OLED-Display mit einer
Auflösung von 128 x 64 Bildpunkten entschieden.
Das Display besitzt einen SSD1306-Controller, welcher über die I²C-Schnittstelle
angesprochen wird.
Für die Arbeit mit diesem Controller existieren bereits in den gängigsten
Programmiersprachen entsprechende Bibliotheken.

Derartige Displays sind bereits für weniger als 5 € zu haben.

### Die Schaltung

[![Der Schaltplan des Messprojektes][schaltung]][schaltung]

An den Raspberry Pi werden sechs Taster zur Steuerung angeschlossen.
Die Taster nutzen die internen Pull-up-Widerstände des Raspberry Pi,
somit müssen keine zusätzlichen Teile verbaut werden.

Alle vier Eingänge des ADCs werden mit Spannungsteilern versehen.
Da allerdings nur zwei Anschlüsse benötigt werden, werden auch nur diese beiden
Anschlüsse tatsächlich nach außen geführt.
Die Eingänge sind von außen über Cinch-Anschlüsse erreichbar, da diese günstig
und robust sind.

### Das fertige Konstrukt

[![Ein Foto der modifizierten Videokassette][kassette]][kassette]{:.image-left}
[![Detailansicht des OLED-Displays in der modifizierten Kassette][kassette_display]][kassette_display]{:.image-right}

[![Raspberry Pi in Videokassettenchassis mit USB-Stick][kassette_rpi]][kassette_rpi]{:.image-left}
[![Die beiden Cinch-Buchsen an der Außenseite der Videokassette][kassette_cinch]][kassette_cinch]{:.image-right}

Die LAN und USB Anschlüsse des Raspberry Pi sind von außen gut erreichbar.
Somit kann man die Messdaten direkt auf dem USB-Stick speichern oder sich über
das Netzwerk mit dem Raspberry Pi verbinden und auf Fehlersuche gehen.

## Software

Um Messreihen zu verwalten, Informationen zur Messung anzuzeigen und auf
Nutzereingaben reagieren zu können, habe ich ein kleines Framework in Python
geschrieben.

Das Framework basiert auf Modulen, welche über Ereignisse miteinander
kommunizieren.

Es gibt Module für:
- das Auslesen der Taster
- die Messung der Spannung
- die Speicherung der Messwerte
- das Anzeigen von Informationen auf dem Display.

Dem Modul zum Anzeigen von Informationen auf dem Display können einzelne Seiten
hinzugefügt werden.
Diese zeigen zum Beispiel die gemessene Spannung an, oder die Nummer der
aktuellen Messreihe.
Über die Hardwaretaster kann zwischen den Seiten gewechselt oder mit den Seiten
interagiert werden.
Somit lassen sich Aktionen wie zum Beispiel das Herunterfahren des Raspberry Pi
oder das Starten einer Messung triggern.

Die Messdaten werden mit der Python-Bibliothek [_openpyxl_][openpyxl] als
`.xlsx`-Dokument auf einem USB-Stick gespeichert.
Dabei werden allerdings die Rohdaten des ADCs anstatt der Spannung gespeichert.
In der Auswertung können die Rohdaten dann in Excel in Temperaturen umgerechnet
und grafisch dargestellt werden.

Der Quellcode des Ganzen ist auf [gitlab.com:kalehmann/messprojekt](https://gitlab.com/kalehmann/messprojekt)
verfügbar.

  [kassette]: {{ "assets/2018-07-ursamar-rk44/messprojekt.avif" | absolute_url }}
  [kassette_cinch]: {{ "assets/2018-07-ursamar-rk44/cinch_socket.avif" | absolute_url }}
  [kassette_display]: {{ "assets/2018-07-ursamar-rk44/ssd1306_oled_display_128_64.avif" | absolute_url }}
  [kassette_rpi]: {{ "assets/2018-07-ursamar-rk44/raspberry_pi_usb.avif" | absolute_url }}
  [muffelofen]: {{ "assets/2018-07-ursamar-rk44/muffelofen.avif" | absolute_url }}
  [openpyxl]: https://openpyxl.readthedocs.io/en/stable/
  [rk44_front]: {{ "assets/2018-07-ursamar-rk44/ursamar-rk44.avif" | absolute_url }}
  [rk44_schaltplan]: {{ "assets/2018-07-ursamar-rk44/ursamar-rk44-schaltplan.avif" | absolute_url }}
  [schaltung]: {{ "assets/2018-07-ursamar-rk44/messprojekt_steckplatine.avif" | absolute_url }}
