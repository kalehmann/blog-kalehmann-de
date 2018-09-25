---
layout:       post
title:        Der vernetzte Bierkasten
date:         2015-04-20 13:12:29 +0200
lang:         de
categories:   blog
tags:
  - Make
  - Coding
  - RaspberryPi
---

Um es gleich vorwegzunehmen: Ja, dieser Bierkasten erkennt tatsächlich, welche
seiner Flaschen noch voll und welche schon leer sind.
![Der vernetzte Bierkasten]( {{ "assets/der-vernetzte-bierkasten/VernetzterBierkasten.jpg" | absolute_url }})

Der vernetzte Bierkasten war eines meiner ersten Bastelprojekte. Damals hatte
ich meinen Raspberry Pi zwar schon fast ein ganzes Jahr, aber hardwaremäßig
bewegten sich meine Projekte noch auf unterstem Niveau und vielen
Frickellösungen. Dennoch kam mir schnell die Idee mit dem Bierkasten in den
Sinn.

Einen Taster an den Raspberry Pi anschließen und dessen Zustand abfragen? –
Kein Problem, das hatte ich schließlich schon ein paar mal gemacht. Und
softwaretechnisch dürfte das Ganze auch nicht so schwer werden, ein Webinterface
zur Abfrage der Flaschen muss schließlich ausreichen.

Das erstes Problem war die Frage, wie der Raspberry Pi eine volle Bierflasche
von einer leeren Bierflasche unterscheiden soll. Mein Lösungsansatz dazu basiert
auf einer Unterscheidung nach dem jeweiligen Gewicht der Flasche durch einen
Drucktaster. Eine volle Bierflasche wiegt zirka 850 Gramm und eine Leere 350
Gramm. Daraus folgt, dass ein zur Unterscheidung von leeren und vollen
Bierflaschen ein Drucktaster benötigt wird, welcher bei einer Gewichtskraft
zwischen 4 und 8 Newton auslöst.  

Da meine finanziellen Möglichkeiten als Schüler zu diesem Zeitpunkt begrenzt
waren, habe ich mir 20 solche Taster aus 10 leeren Bierdosen selber gebaut.
(An dieser Stelle vielen Dank an alle Personen, die mir Beihilfe bei der
Beschaffung leerer Bierdosen geleistet haben.)

![Schaltplan eines Raspberry Pis mit Taster und Pullup-Widerstand]( {{ "assets/der-vernetzte-bierkasten/RaspberryPi_Taster_pullup.jpg" | absolute_url }})

<video autoplay loop width="200" heigh="352">
  <source src="{{ "assets/der-vernetzte-bierkasten/Flaschensensor.mp4" | absolute_url }}" type="video/mp4">
  Your browser does not support the video tag.
</video>

In der Animation lässt sich das Prinzip dieser Taster gut erkennen. Es ist
jeweils der Boden oder Deckel einer Dose an zwei Gummibändern befestigt.
Wenn man nun eine volle oder eine leere Bierflasche auf den Deckel stellt, senkt
dieser sich unterschiedlich weit ab. Bei einer vollen Flasche senkt er sich
soweit ab, das er auf einem Blech aufsetzt.
An dem Deckel liegt ein Pullup Widerstand an und er ist mit einem auf
Eingang geschaltetem GPIO-Pin verbunden (hier rotes Kabel), während das Blech
mit der Masse des Raspberry Pis verbunden ist.

Aus Materialmangel wurde auf externe Pullup-Widerstände verzichtet, stattdessen
wurden die internen Pullups des Raspberry Pis verwendet. Deren Verwendung wird
in dem folgendem Beispiel veranschaulicht:
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

Hier wird der **GPIO 4** als Eingang geschalten und sein interner Pullup
Widerstand aktiviert. Anschließend wird sein Zustand jede Sekunde ausgelesen.
Nun kann dieser GPIO über einen Taster direkt mit der Masse verdrahtet werden.
Im Normalzustand liegt an dem Taster eine Spannung an und `gpio.input(pin)` gibt
**1** zurück. Wenn der Taster gedrückt wird, entsteht eine Stromkreis und das
Auslesen des Tasters führt zu dem Wert **0**.



Das Ganze habe ich nun zwanzig mal gefertigt und an dem Bierkasten befestigt.

![Flaschensensor]( {{ "assets/der-vernetzte-bierkasten/Flaschensensor.jpg" | absolute_url }})
![Die Unterseite des vernetzten Bierkastens]( {{ "assets/der-vernetzte-bierkasten/VernetzterBierkastenUnterseite.jpg" | absolute_url }})
![Die Draufsicht auf den vernetzten Bierkasten]( {{ "assets/der-vernetzte-bierkasten/VernetzterBierkastenDraufsicht.jpg" | absolute_url }})

Die Bleche am Grund des Kastens sind allesamt aus Bierdosen ausgeschnitten und
mit Heißleim an dem Kasten angebracht. Im Endaufbau habe ich auf externe
Pullup-Widerstände verzichtet und stattdessen die internen des Raspberry Pis
verwendet.

Nun stellte sich aber das Problem, dass das B-Modell des Raspberry Pis nur 17
als Eingang schaltbare Pins hat, ich aber 20 brauche. Zum Glück lassen sich
durch Bestückung des P5-Headers noch 4 weitere GPIOs nutzen.

![Ein Raspberry Pi Modell B mit bestücktem P5 Header]( {{ "assets/der-vernetzte-bierkasten/RaspberryPiP5Header.jpg" | absolute_url }})

Anschließend hab ich die Zuleitungen für die 20 Taster frontal aus dem Kasten
herausgeführt und entsprechend der Position des Tasters durchnummeriert.

![Durchnummerierte Kabel am vernetzten Bierkasten]( {{ "assets/der-vernetzte-bierkasten/VernetzterBierkasten_TasterNummeriert.jpg" | absolute_url }})

Danach musste ich mir nur merken, welchen Taster ich an welchen GPIO
angeschlossen habe, wozu ich mir eine Tabelle erstellt habe.

Nun konnte ich eine Funktion implementieren, welche diese alle abfragt.

Weiterhin mussten die so gewonnenen Daten nach außen hin zugänglich gemacht
werden. Dazu setzte ich auf dem Raspberry Pi einen Wlan-Zugangspunkt und einen
simplen Webserver auf Pythonbasis auf. Der
[Code dafür](https://github.com/DasBierkastenProjekt/Bierkasten) steht auf
Github bereit.

Die Abfrage der Daten kann zum einen über eine [Web-App](https://github.com/DasBierkastenProjekt/DerVernetzteBierkasten-WebApp)
und zum anderen über eine Android-App erfolgen. In der ursprünglichen Version
waren sowohl in der Webanwendung, als auch in der Android-App mehrere Bilder von
verschiedenen Biersorten gespeichert, welche man für die Darstellung der
vollen/leeren Flaschen auswählen konnte. Da ich mir aber bei der Rechtslage der
Verwendung dieser Bilder unsicher war, habe ich die Bilder in der Webanwendung
durch Cliparts einer vollen und einer leeren Flaschen ersetzt und die
Android-App kann mittlerweile selbst Bilder für die Darstellung der Flaschen
aufnehmen.
Den [Quellcode der Android App](http://github.com/DasBierkastenProjekt/DerVernetzteBierkasten-Android) findet man auch auf Github.

Der Raspberry Pi ist im Gehäuse einer Videokassette frontal am Bierkasten
angebracht. Als erstes wurden aus dem Gehäuse der Videokassette alle störenden
Teile entfernt. Anschließend folgte die Montage zweier Metallstifte für die
Schraublöcher des Raspberry Pis.

![Eine ausgefrässte Videokassette]( {{ "assets/der-vernetzte-bierkasten/RaspberryPi_in_Videokasette.jpg" | absolute_url }})

Weiterhin wurden zusätzliche Öffnungen für eine Wlan-Stick, Stromversorgung und
IDE Kabel zur Verbindung mit den Drucktastern angebracht.

![Eine Videokassette als Gehäuse für einen Raspberry Pi]( {{ "assets/der-vernetzte-bierkasten/RaspberryPi_in_Videokasette.jpg" | absolute_url }})
![Eine Videokassette als Gehäuse für einen Raspberry Pi]( {{ "assets/der-vernetzte-bierkasten/RaspberryPi_in_Videokasette2.jpg" | absolute_url }})

Das andere Ende des IDE Kabels ist mit einer selbst gebauten Steckverbindung mit
dem Bierkasten verbunden.

![Eine selbstgebaute Steckverbindung zwischen Raspberry Pi und Bierkasten]( {{ "assets/der-vernetzte-bierkasten/IDE_Kabel_Steckverbinder.jpg" | absolute_url }})

Die Stromversorgung des Raspberry Pis erfolgt über eine Handelsübliche Powerbank.

Weiterhin habe ich den 21. GPIO des Raspberry Pis genutzt, um ihn mit Hilfe
eines Tasters (oder genauer einer auf eBay ersteigerten Haltewunschtaste
herunterzufahren/neu zu starten).
![Haltewunschtaste an Raspberry Pi angeschlossen]()

Später habe ich dann auf Anraten eines Freundes ein Bild von dem Projekt auf die
[Facebook-Pinwand von Sternburg Bier](https://www.facebook.com/photo.php?fbid=741565559275751)
gepostet. Dieser Post fand große Resonanz - unter anderem auch durch das
Facebook-Team von Sternburg - welches den Beitrag noch auf der
[Sternburg Facebook Seite teilte.](https://www.facebook.com/sternburg.bier/posts/10153218808859438)
