---
layout:       post
title:        Automatische Temperaturerfassung mit einem Ursamar RK44 Temperaturregler
date:         2018-07-30 13:12:29 +0200
lang:         de
categories:   blog
tags:
  - Make
  - Coding
  - RaspberryPi
---

## Die Ausgangssituation

Ein ehemaliger Schulkamerad von mir belegt gerade im Rahmen seines
Studiums ein Praktikum in einem Chemieunternehmen.
Ein Prozess dieses Unternehmens umfasst die thermische Vorbehandlung von
Reststoffen aus der Salzsäurehydrolyse unter pyrolytischen Bedingungen.

Das Ziel des Praktikums ist es, diesen Prozess zu optimieren, indem in
Versuchsreihen die optimale Temperatur zur Verdampfung gefunden wird.

In den Versuchen werden die Rückstoffe der Hydrolyse in einem Muffelofen
mit einem Ursamar RK44 Temperaturregler über unterschiedlich lange Zeiträume
auf verschiedene Temperaturen erhitzt.

![Beheizter Muffelofen mit offener Tür]({{ "assets/ursamar-rk44-temperaturerfassung/muffelofen.jpg" | absolute_url }})

Diese Versuche erstrecken sich jeweils über mehrere Stunden. Schnell zeigte
sich, dass manuelle Messungen zu monoton sind und am besten wegautomatisiert
werden.

Dafür habe ich eine Lösung auf Raspberry Pi Basis entwickelt, um die Temperatur
an dem Temperaturregler aufzunehmen und auszuwerten.

## Auslesen der Temperatur an dem Ursamar RK44 Temperaturregler

Der Temperaturregler gibt die aktuelle Temperatur auf einer LED-Anzeige aus.
Diese Schnittstelle ist jedoch ungeeignet zum automatischen Erfassen der
Temperatur.
![Ursamar RK44 Frontalansicht]({{ "assets/ursamar-rk44-temperaturerfassung/ursamar-rk44.jpg" | absolute_url }})
Ein Blick auf den Schaltplan verrät, dass zwischen den Klemmen 10 und 12 eine
Spannung proportional zur gemessenen Temperatur anliegt.
![Ursamar RK44 Schaltplan]({{ "assets/ursamar-rk44-temperaturerfassung/ursamar-rk44-schaltplan.jpg" | absolute_url }})

Diese Spannung - Ux - lässt sich mit einem Raspberry Pi und einem Analog
Digital Converter (ADC) auslesen und als Grundlage für die Berechnung der
Temperatur nehmen.


### Erfassen der Spannung an dem Temperaturregler

Zum Messen der Spannung wird der 16-bit ADC ads1115 verwendet. Dieser wird
direkt an den Raspberry Pi angeschlossen. Damit liegt seine maximale
Eingangsspannung bei 3.3 V. Allerdings variiert die an dem Ursamar RK44 zu
messende Spannung Ux zwischen 0 und 10 V.

Diese Differenz lässt sich mit einem einfachen Spannungsteiler umgehen. Dafür
werden 2 ohmsche Widerstände mit 3.3 KOhm und 10 KOhm verwenden.

Das Teilungsverhältnis t für diesen Spannungsteiler errechnet sich
folgendermaßen:
<math>
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
        <mi>KΩ</mi>
      </mrow>
      <mrow>
        <mrow>
          <mn>10</mn>
          <mi>KΩ</mi>
        </mrow>
        <mo>+</mo>
        <mrow>
          <mn>3,3</mn>
          <mi>KΩ</mi>
        </mrow>
      </mrow>
    </mfrac>
    <mo>≈</mo>
    <mn>0,25</mn>
  </mrow>
</math>

Zur optimalen Erfassung von Werten wird der Messbereich des ADC auf -4,096 V bis
+4,096 V eingestellt.

Somit lässt sich die Messauflösung R des ADC wie folgt ermitteln:
<math>
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
            <mo>-</mo>
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
          <mn>120</mn>
          <mi>μV</mi>
        </mrow>
      </mtd>
    </mtr>
  </mtable>
</math>

Daraus ergibt sich folgende Formel zu Berechnung der Spannung am
Temperaturregler aus dem Messwert des ADCs:
<math>
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
Außerdem sollen jederzeit Messreihen gestartet und beendet werden können
ohne eine Netzwerkverbindung aufzubauen oder umständlich Tastatur und
Bildschirm anzuschließen. Daher werden ein paar Taster und ein kleines
Display benötigt.

Die benötigten Teile habe ich mir innerhalb von einer Woche zusammengesucht /
bestellt und an einem ruhigen Samstag zusammengefrickelt.

### Das Gehäuse

Die Überlegung Grundlage ich für das Gehäuse nehmen soll hat mich einige
Zeit gekostet. Schließlich habe ich mich für Videokassette entschieden, genauer
deren Chassis.
Die Abmessungen sind perfekt um eine Raspberry Pi mit einer zusätzlichen Platine
für Display, Taster und ADC zu beherbergen. Außerdem lassen sich Videokassetten
mittlerweile kostenlos bekommen.  

### Das Display

Die Anforderungen an das Display sind ziemlich einfach gehalten:
- einfache Ansteuerung
- geringe Kosten
- Ausgabe kurzer Informationen (Messspannung, Nummer der Messung ...)
- im freien immer noch erkennbar

Schlussendlich habe ich mich für eine monochromes OLED Display mit einer
Auflösung von 128 x 64 Bildpunkten entschieden. Das Display besitzt einen
SSD1306 Controller, welcher über die I²C Schnittstelle angesprochen wird.
Für die Arbeit mit diesem Controller existieren bereits in den gängisten
Programmiersprachen entsprechende Bibliotheken.

Derartige Displays sind bereits unter für weniger als 5€ zu haben.

### Die Schaltung

![Der Schaltplan des Messprojektes]({{ "assets/ursamar-rk44-temperaturerfassung/messprojekt_steckplatine.png" | absolute_url }})

An den Raspberry Pi werden 6 Taster zur Steuerung angeschlossen. Die Taster
nutzten die internen Pull Up Widerstände des Raspberry Pis, es müssen keine
zusätzlichen Teile verbaut werden.

Alle vier Eingänge des ADCs werden mit Spannungsteilern versehen. Allerdings
werden aus fehlendem Bedarf nur zwei davon tatsächlich nach außen geführt.
Die Eingänge sind von außen über Cinch Anschlüsse erreichbar, da diese günstig
und robust sind.

### Das fertige Konstrukt.

![]({{ "assets/ursamar-rk44-temperaturerfassung/messprojekt.jpg" | absolute_url }})

![]({{ "assets/ursamar-rk44-temperaturerfassung/ssd1306_oled_display_128_64.jpg" | absolute_url }})

![Raspberry Pi in Videokassettenchassis mit USB-Stick]({{ "assets/ursamar-rk44-temperaturerfassung/raspberry_pi_usb.jpg" | absolute_url }})
Die LAN und USB Anschlüsse des Raspberry Pis sind von außen gut erreichbar.
Somit kann man die Messdaten direkt auf dem USB-Stick speichern oder sich über
das Netzwerk mit dem Raspberry Pi verbinden und auf Fehlersuche gehen.

![]({{ "assets/ursamar-rk44-temperaturerfassung/cinch_socket.jpg" | absolute_url }})

## Software

Um Messreihen zu verwalten, Informationen zur Messung anzuzeigen und auf
Nutzereingaben reagieren zu können, habe ich ein kleines Framework in Python
geschrieben.

Das Framework basiert auf Modulen die über Ereignisse miteinander kommunizieren.

Es gibt Module für:
- das Auslesen der Taster
- die Messung der Spannung
- die Speicherung der Messwerte
- das Anzeigen von Informationen auf dem Display.

Dem Modul zum Anzeigen von Informationen auf dem Display können einzelne Seiten
hinzugefügt werden.
Diese zeigen zum Beispiel die gemessene Spannung an, oder die Nummer der
aktuelle Messreihe.
Über die Hardwaretaster kann zwischen den Seiten gewechselt, beziehungsweise mit
ihnen interagiert werden. Somit lassen sich Aktionen wie zum Beispiel das
Herunterfahren des Raspberry Pis oder der Start einer Messung triggern.

Die Messdaten werden mit der Pythonbibliothek openpyxl auf einem USB-Stick
gespeichert.
Dabei werden allerdings die Rohdaten des ADCs anstatt der Spannung gespeichert.
In der Auswertung können die Rohdaten dann in Excel in Temperaturen umgerechnet
und grafisch dargestellt werden.

Der Quellcode des ganzen ist auf [gitlab.com:kalehmann/messprojekt](https://gitlab.com/kalehmann/messprojekt)
verfügbar.
