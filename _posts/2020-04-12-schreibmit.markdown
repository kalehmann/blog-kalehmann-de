---
categories:       blog
date:             2020-04-12 13:23:27 +0100
description:  >-
  Hintergrundinformationen zur Aktion Schreib Mit! des Jugenrotkreuz Sachsen.
  Details zur technischen Umsetzung und der Entfernungsermittlung anhand der
  Postleitzahl in PHP und Symfony.
lang:             de
last_modified_at: 2020-09-13 21:00:00 +0200
layout:           post
tags:
  - Coding
title:            'SchreibMit! - Ostern in der Isolation'   
---

## SchreibMit!

Aufgrund der aktuell laufenden COVID-19-Pandemie müssen wir alle mit
Einschränkungen leben.
Alte Menschen sind davon besonders betroffen.
Sie gehören zur Risikogruppe für schwere Verläufe der Erkrankung und
bedürfen daher besonderen Schutz.
Deswegen ist in der
[Sächsischen Corona-Schutz-Verordnung](https://web.archive.org/web/20200406234231/https://www.coronavirus.sachsen.de/download/Fassung-RV-SaechsCoronaSchVO_31032020.pdf)
der Besuch von Alten- und Pflegeheimen untersagt.
Das [Jugenrotkreuz Sachsen](https://jrksachsen.de) hat daher die Aktion
[SchreibMit!](https://jrksachsen.de/schreibmit)
gestartet, um der Vereinsamung von Sachsens Seniorinnen und Senioren in dieser
Zeit entgegen zu wirken.

Vor 10 Tagen hat mich ein Kamerad des DRK Kreisverbandes Dresden angerufen und
kurz über die Idee informiert.
Die interessierten Nutzer sollen die Kontaktadresse eines Alten- oder
Pflegeheimes über eine Webanwendung erhalten.
Das ausgewählte Alten- oder Pflegeheim soll geografisch in der Nähe des Nutzers
liegen.
Dabei besteht die Hoffnung, dass sich ein Kontakt entwickelt, der auch in der
Zeit nach der Krise bestehen bleibt.
Natürlich habe ich mich sofort bereit erklärt, diese Anwendung zu entwickeln.

### Die Umkreissuche von Pflegeheimen

Die erste Herausforderung ist das Finden des nächstgelegenen Alten- oder
Pflegeheimes.
Der Nutzer der Anwendung gibt seine Position anhand seiner Postleitzahl preis.
Die Datenbank nach einem Pflegeheim mit der selben Postleitzahl zu durchsuchen
wäre insuffizient, da nicht für jeden Postleitzahlbereich ein Pflegeheim
eingetragen ist.
Deswegen erfolgt die Suche anhand der Koordinaten der Pflegeheime.
Dazu müssen als erstes jedem Postleitzahlbereich Koordinaten zugeordnet werden.
Dazu wird die
[Postleitzahlendatenbank des Lausitzer Unternehmens Launix](https://launix.de/launix/launix-gibt-plz-datenbank-frei/)
verwendet.
Die Daten dieser Datenbank sind gemeinfrei.
Jeder Eintrag enthält eine Postleitzahl, die zugehörige Stadt sowie Längen- und
Breitengrad für den Postleitzahlbereich.

Für die Pflegeheime werden in der Datenbank ebenfalls Längen- und Breitengrad
gespeichert.
Die Anwendung soll nur innerhalb von Sachsen / maximal innerhalb von Deutschland
zuverlässig funktionieren.
Für diesen kleinen Ausschnitt der Erdoberfläche kann man annehmen, dass er flach
ist und erhält trotzdem noch eine hinreichende Genauigkeit.
Auf einer solchen Fläche kann man den Abstand zwischen zwei Koordinaten mit dem
Satz des Pythagoras berechnen.
Um dabei auf ein Ergebnis in Kilometer zu kommen, benötigt man die Distanzen
zwischen zwei Längengraden und zwei Breitengraden in Kilometern.
Die Distanz zwischen zwei Breitengraden variiert minimal mit 110.6 Kilometern am
Äquator und 111.7 Kilometern an den Polen.
Für die Anwendung wird ein Mittelwert von 111.3 Kilometern angenommen.

Der Distanz zwischen zwei Längengrade variiert jedoch in Abhängigkeit vom
Breitengrad.
Am Äquator, mit dem Erdradius r<sub>0</sub> berechnet sich die Distanz zwischen
zwei Längengraden D<sub>0</sub> mit

![d0 = 40075/360 = 111.3]({{ "assets/schreibmit/d0.svg" | absolute_url }})

Allerdings nähert sich die Distanz zwischen zwei Längengraden zu den Polen hin
immer mehr dem Wert 0 an.
Um die Distanz in Abhängigkeit von der geografischen Breite φ zu bestimmen,
benötigt man den Radius des Breitengrades.

Dieser Radius, r<sub>φ</sub> berechnet sich

![rφ = cos(φ) * r0]({{ "assets/schreibmit/rphi.svg" | absolute_url }})

Zusammen mit der Formel für die Distanz zwischen zwei Längengraden am Äquator
lässt sich die Berechnung von D<sub>φ</sub> zusammenfassen auf

![Dφ = cos(φ) * D0]({{ "assets/schreibmit/dphi.svg" | absolute_url }})


![]({{ "assets/schreibmit/earth_longitude.png" | absolute_url }})

Für die Stadt Dresden werden die Koordinaten 51°05'N 13°45'E als Zentrum
angenommen.
Diese Koordinaten entsprechen in etwa dem Pirnaischen Platz.
Für diesen Breitengrad kann man einen Abstand zwischen zwei Längengraden von
70 Km annehmen

![DDresden = cos(51°) * 111.3Km = 70Km]({{ "assets/schreibmit/ddresden.svg" | absolute_url }})

Mit diesen Informationen kann der Abstand zwischen zwei Koordinaten berechnet
werden.
Angenommen man hat zwei Punkte P<sub>1</sub> und P<sub>2</sub>.
Deren Koordinaten werden mit den Breitengraden φ<sub>1</sub> und φ<sub>2</sub>
sowie den Längengraden λ<sub>1</sub> und λ<sub>2</sub> beschrieben.
Die Distanz zwischen diesen beiden Punkten wird wie folgt berechnet

![Dφ = cos(φ) * D0]({{ "assets/schreibmit/distance.svg" | absolute_url }})


### Die Webanwendung

Die Webanwendung ist in PHP7 geschrieben und baut auf dem Symfony-Framework auf.
Sie ist in zwei Komponenten unterteilt.
Zum einen die Startseite mit einem Formular, welches den Nutzer nach seinem
Namen, seiner Postleitzahl und seiner E-Mail-Adresse abfragt.

![]({{ "assets/schreibmit/schreibmit_symfony.jpg" | absolute_url }})

Nachdem der Nutzer diese Daten übermittelt hat, wird mittels der oben
beschriebenen Umkreissuche für Pflegeheime das nächstgelegene teilnehmende
Pflegeheim ermittelt und dem Nutzer per E-Mail mitgeteilt.
Danach kann sich der Nutzer auch schon mit dem Schreiben anfangen.

Die zweite Komponente ist das Backend.
Dieses baut auf dem
[EasyAdminBundle für Symfony](https://symfony.com/doc/master/bundles/EasyAdminBundle/index.html)
auf.
In dem Backend können die teilnehmenden Pflegeheime eingetragen werden und die
Verteilung der Nutzer auf die Pflegeheime kann eingesehen werden.

Der komplette Quellcode der Anwendung ist in dem
[GitHub Repository kalehmann/SchreibMit](https://github.com/kalehmann/SchreibMit)
öffentlich einsehbar.

### Das Briefeschreiben

Am wichtigsten ist bei dem Projekt nicht der technische Hintergrund, sondern
das auch tatsächlich Briefe und Postkarten geschrieben werden.
Zu Ostern war es in diesem Jahr gar nicht so einfach eine Osterkarte oder
Briefumschläge zu bekommen, da alle Schreibwarenläden geschlossen haben.
Ich habe mir mit allem, was ich noch an Schulzeug zuhause habe beholfen, um
eine einfache Grußkarten und eine Briefumschlag selber zu basteln.

![]({{ "assets/schreibmit/letter.jpg" | absolute_url }})
