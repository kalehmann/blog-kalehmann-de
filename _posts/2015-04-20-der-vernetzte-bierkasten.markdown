---
categories:       blog
date:             2015-04-20 13:12:29 +0200
description:  >-
  Der vernetzte Bierkasten erkennt welche Flasche noch voll und welche schon
  leer ist. Im Internet der Dinge (IOT) darf auch ein Bierkasten nicht fehlen.
  Mittels einem Raspberry Pi wird der Bierkasten der Marke Sternburg um smarte
  Funktionen erweitert.
lang:             de
last_modified_at: 2020-09-30 20:47:00 +0200
layout:           post
tags:
  - Coding
  - Make
  - RaspberryPi
title:            Der vernetzte Bierkasten
---

Das Internet der Dinge ist der Joker im Bullshit Bingo.
Um mit der Zeit zu gehen möchte ich einen Bierkasten in das Internet der Dinge
bringen.

Doch was genau macht einen vernetzten Bierkasten aus?
Das Europäische Parlament definiert ein Gerät im Internet der Dinge als

> "Physisches Objekt, dass in der Lage ist seine Umgebung zu erfassen oder auf
sie einzuwirken und mit anderen Maschinen zu kommunizieren".
<sup style="font-style: normal;">[[1]](#quelle-1)</sup>

Mein Bierkasten soll seine Umgebung wahrnehmen indem er erkennt, welche Flasche
in ihm noch gefüllt und welche Flasche bereits leer ist.
Zusätzlich soll diese Information über eine Web-Api von anderen Geräten
ausgelesen und zum Beispiel auf dem Smartphone grafisch dargestellt werden.

![Der vernetzte Bierkasten][vernetzter-bierkasten]

Im folgenden Text werden alle notwendigen Schritte zur Umsetzung des Projektes
durchlaufen.

## Die Füllstanderkennung

Wie kann ein Bierkasten eigentlich erkennen, welche Flasche noch voll und welche
schon leer ist?

Da ich zum Zeitpunkt der Entwicklung noch ein Schüler war, habe ich mich für die
einfachste Lösung entschieden: Der Unterscheidung zwischen einer vollen oder
leeren Flasche durch die Gewichtskraft.
Eine leere Bierflasche wiegt ungefähr 350 Gramm und eine volle Bierflasche zirka
850 Gramm.
Dementsprechend wird ein Drucktaster benötigt, welcher zwischen einer Kraft von
4 und 8 Newton auslöst.
Da diese Anforderung sehr speziell ist und sich in 20 facher Ausführung durchaus
auf den Geldbeutel schlägt fiel die Entscheidung auf eine Lösung Marke Eigenbau.

Die 20 Drucktaster habe ich aus 10 leeren Bierdosen selber gebaut.
Ein Taster besteht jeweils aus 3 Elementen:

* einer elektrisch leitfähigen Grundplatte aus dem Mantel einer Bierdose.
* einem beweglichen und elektrisch leitfähigen Element aus dem Boden oder Deckel
  einer Bierdose.
* zwei Gummibänder zur Fixierung des beweglichen Elementes.

Je nach dem Gewicht der Bierflasche wird über das bewegliche Element und die
Grundplatte ein Stromkreis geschlossen oder nicht.

<video autoplay loop muted class="image-left">
  <source src="{{ "assets/der-vernetzte-bierkasten/flaschensensor.webm" | absolute_url }}" type="video/webm">
  Your browser does not support the video tag.
</video>

<video autoplay loop muted class="image-right">
  <source src="{{ "assets/der-vernetzte-bierkasten/bierdose-boden.webm" | absolute_url }}" type="video/webm">
  Your browser does not support the video tag.
</video>

Die Ober- und Unterseiten der Bierdosen werden abgetrennt und anschließend
abgeschliffen um eventuelle Verschmutzungen welche die elektrische Leitfähigkeit
einschränken zu entfernen.
Danach werden die 20 Taster in den Bierkasten eingebaut.

![einzelner Flaschensensor im Vernetzten Bierkasten][flaschensensor]{:.image-left}
![Draufsicht auf den Vernetzten Bierkasten mit allen Flaschensensoren][draufsicht]{:.image-right}

Die Taster werden von einem Raspberry Pi ausgelesen.
Um möglichst wenig Hardware zu verbrauchen soll jeder Taster direkt zwischen
dem Datenkabel (auf Eingang geschalteter GPIO) und der Masse geschaltet werden.
Diese Schaltung ist auf dem linken Bild dargestellt.
In dieser Schaltung liegt bei geschlossenem Taster an dem Datenkabel eine
sichere Null an.
Bei einem geöffneten Schalter befindet sich der Eingang allerdings in einem
schwebendem Zustand.
Um dies zu vermeiden wird der Eingang durch eine Verbindung zwischen dem Eingang
und der Stromquelle mit einem zwischengeschalteten Widerstand permanent auf 1
(High) gezogen.

<figure class="image-left">
  <img src="{{ "assets/der-vernetzte-bierkasten/button-simple.png" | absolute_url }}" alt="" />
  <figcaption>Button ohne externen PullUp Widerstand</figcaption>
</figure>
<figure class="image-right">
  <img src="{{ "assets/der-vernetzte-bierkasten/button-pull-up.png" | absolute_url }}" alt="" />
  <figcaption>Button mit externem PullUp Widerstand</figcaption>
</figure>

Um externe Pullup Widerstände zu vermeiden werden die internen Pullup
Widerstände des Raspberry Pi verwendet.
Das folgende Codebeispiel demonstriert, wie diese zugeschaltet werden:

{% highlight python %}
import RPi.GPIO as gpio
import time

gpio.setmode(gpio.BCM)
pin = 4

gpio.setup(pin, gpio.IN, pud_up_down=gpio.PUDUP)

try:
    while True:
        print("Pin {} : {}".format(pin, gpio.input(pin)))
        time.sleep(1)
except KeyboardInterrupt:
    pass
finally:
    gpio.cleanup()
{% endhighlight %}

Somit kann ein einzelner Button ausgelesen werden.
Der Bierkasten hat jedoch 20 Flaschen und benötigt dem entsprechend auch die
selbe Anzahl an Tastern.
Durch den 26 Pin P1 Header des Raspberry Pi werden insgesamt 17 GPIOs welche als
Eingänge geschaltet werden exponiert.

<figure>
  <img src="{{ "assets/der-vernetzte-bierkasten/gpio-p1.svg" | absolute_url }}" alt="" />
  <figcaption>Raspberry Pi P1 Header</figcaption>
</figure>

Es gibt verschiedene Möglichkeiten, zusätzliche Eingänge an dem Single Board
Computer zu nutzen.
Zum einen gibt es sogenannte Port-Expander, die über ein Bussystem mit dem
Raspberry Pi verbunden werden.
Beispielsweise kann der MCP23017 über
I<sup>2</sup>C angeschlossen werden und so bis zu 16 Eingänge auslesen.

Zum anderen werden ab der Revision 2.0 des Raspberry Pi vier weitere GPIOs über
den P5 Header bereitgestellt.
Dieser hat von oben gesehen das folgende Layout:

<figure>
  <img src="{{ "assets/der-vernetzte-bierkasten/gpio-p5.svg" | absolute_url }}" alt="" />
  <figcaption>Raspberry Pi P5 Header</figcaption>
</figure>

Standardmäßig ist dieser Header allerdings nicht bestückt.
Die zusätzlichen 2 mal 4 Pins wurden nachträglich von mir angelötet.

![Raspberry Pi mit angelöteten P5-Header][p5-header]

## Ausbau des Bierkastens

Neben den einzelnen Tastern muss der Bierkasten um einen Platz für den Raspberry
Pi und eine Zuführung der Kabel zu dem SoC erweitert werden.

Alle Bodenplatten sind untereinander verbunden und über ein einzelnes Kabel an
die Masse des Raspberry Pi angeschlossen.
Jedes einzelne bewegliche Elemente der selbst gebauten Taster ist über ein Kabel
mit dem Raspberry Pi an der Vorderseite des Bierkastens verbunden.

![Unterseite des Vernetzten Bierkastens][unterseite]

Für der Verbindung der Kabel mit dem P1 Header des Raspberry Pi wird ein IDE
Kabel verwendet.
Das Verbindungselement für das IDE Kabel ist aus einer Streifenrasterplatine
und einer 2 mal 12 Pinleiste selbst gebaut.
Die Pins auf dem P5 Header sind hingegen mit Jumperkabeln aus einem alten PC
direkt verbunden.

![IDE-Verbinder des Vernetzten Bierkastens][ide-verbinder]

Das *Gehirn* des Bierkastens - der Raspberry Pi - wird in einer alten
Videokassette an der Vorderseite des Bierkastens verstaut.
Alte Videokassetten sind Perfekt als Gehäuse für Bastelprojekte geeignet.
Sie sind einfach zu beschaffen, bieten genung Platz für alle gängingen
Mikrocomputer oder Mikrokontrollerboards und können einfach bearbeitet werden.

![Raspberry Pi in einer Videokassette][videokassette]

Die Stromversorgung des Bierkastens erfolgt entweder über ein Handelsübliches
Ladegerät für Smartphones oder eine Powerbank.
Wobei es fraglich ist, wie mobil das Gerät mit einer Akkulaufzeit von 15 Stunden
an einer durchschnittlichen Powerbank tatsächlich ist.

## Auswertung der Daten

Nachdem der Raspberry Pi die Daten über den Füllstand des Bierkastens erfasst,
müssen diese Daten auch noch dem Nutzer zugänglich gemacht und grafisch
aufbereitet werden.

Der Raspberry Pi selbst exponiert die Daten über eine einfache Webschnittstelle.
Diese Webschnittstelle ist in Python2 geschrieben und verwendet den
[BaseHTTPServer][basehttpserver] um einen Endpunkt mit den Füllstandsdaten
bereitzustellen.
Das Skript umfasst Klassen den Füllstand sowohl über die GPIOs des Raspberry Pi
als auch einen Port-Expander auszulesen.
Der Quellcode des Skriptes ist auf GitHub unter
[DasBierkastenProjekt/Bierkasten][bierkasten-code]
einsehbar.

Die exponierten Daten können zum einem im Browser und zum anderen über eine App
für Android ausgewertet werden.
Die Webanwendung ist PHP basiert und feuert bei jedem Seitenaufruf eine Anfrage
an den Endpunkt mit den Füllstandsdaten ab.
Um die Nutzung angenehmer zu gestalten wird zusätzlich eine JavaScript Datei
eingebunden, welche die Daten in einem Intervall automatisch abfragt.

![Webanwendung des Vernetzten Bierkastens][webapp]

Das simple Skript zur Darstellung dieser Webanwendung ist ebenfalls auf GitHub
einsehbar, in dem Repository
[DasBierkastenProjekt/DerVernetzteBierkasten-WebApp][webapp-code].

Zu guter Letzt können die Daten auch wie schon auf dem ersten Bild gezeigt
mittels einer App für Android angezeigt werden.
In der ersten Version der App waren Bilder von Sternburgflaschen mit und ohne
Deckel inbegriffen, um den Füllstand des Kastens darzustellen.
Um Probleme mit Urheberrechtsverletzungen zu vermeiden habe ich diese Bilder
durch simple Zeichnungen ersetzt und als Gimmick die Möglichkeit eigene
Bilder von Flaschen aufzunehmen hinzugefügt.

![][custom-icon]{:.image-left}
![][android-app]{:.image-right}

Der Quellcode der App ist ebenfalls auf GitHub einsehbar, in dem Repository
[DasBierkastenProjekt/DerVernetzteBierkasten-Android][android-code].

## Öffentliche Rezession

Auf Anraten eines Freundes habe ich ein Bild des Projektes auf die Pinnwand der
Sternburg-Facebookseite gepostet.
Das Social-Media-Team von Sternburg war von dem Projekt so angetan, dass es später
öffentlich auf deren [Seite geteilt wurde][facebook] (Achtung, Link auf
Facebook, Login erforderlich).

1. <small><a id="quelle-1"></a>
Bundeszentrale für politische Bildung - Kennzeichen für das Internet der Dinge: [https://www.europarl.europa.eu/RegData/etudes/BRIE/2015/557012/EPRS_BRI%282015%29557012_EN.pdf][eu-iot] (zuletzt abgerufen am 18.09.2020)</small>

  [android-app]: {{ "assets/der-vernetzte-bierkasten/android-app.jpg" | absolute_url }}
  [android-code]: https://github.com/DasBierkastenProjekt/DerVernetzteBierkasten-Android
  [basehttpserver]: https://docs.python.org/2/library/basehttpserver.html
  [bierkasten-code]: https://github.com/DasBierkastenProjekt/Bierkasten
  [bpb-iot]: https://www.bpb.de/gesellschaft/medien-und-sport/medienpolitik/237583/kennzeichen-fuer-das-internet-der-dinge
  [custom-icon]: {{ "assets/der-vernetzte-bierkasten/custom-icon.jpg" | absolute_url }}
  [draufsicht]: {{ "assets/der-vernetzte-bierkasten/vernetzter-bierkasten-draufsicht.jpg" | absolute_url }}
  [eu-iot]: https://www.europarl.europa.eu/RegData/etudes/BRIE/2015/557012/EPRS_BRI%282015%29557012_EN.pdf
  [facebook]: https://www.facebook.com/sternburg.bier/posts/10153218808859438
  [flaschensensor]: {{ "assets/der-vernetzte-bierkasten/flaschensensor.jpg" | absolute_url }}
  [ide-verbinder]: {{ "assets/der-vernetzte-bierkasten/ide-kabel-steckverbinder.jpg" | absolute_url }}
  [p5-header]: {{ "assets/der-vernetzte-bierkasten/raspberry-pi-p5-header.jpg" | absolute_url }}
  [unterseite]: {{ "assets/der-vernetzte-bierkasten/vernetzter-bierkasten-unterseite.jpg" | absolute_url }}
  [vernetzter-bierkasten]: {{ "assets/der-vernetzte-bierkasten/vernetzter-bierkasten.jpg" | absolute_url }}
  [videokassette]: {{ "assets/der-vernetzte-bierkasten/raspberry-pi-videokassette.jpg" | absolute_url }}
  [webapp]: {{ "assets/der-vernetzte-bierkasten/webapp.jpg" | absolute_url }}
  [webapp-code]: https://github.com/DasBierkastenProjekt/DerVernetzteBierkasten-WebApp
