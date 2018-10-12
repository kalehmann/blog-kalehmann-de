---
layout:       post
title:        Save Your Master
date:         2013-05-06 14:28:57 +0200
lang:         de
categories:   blog
tags:
  - Coding
  - Games
---
{% comment %}
  Die für gewählte Uhrzeit der Veröffentlichung entspricht der
  kleinsten nicht trivialen zyklischen Zahl, 142857.
  .
  Das besondere an zyklischen Zahlen ist, dass diese mit einer natürlichen Zahl
  von 1 bis n multipliziert die selben Ziffern wie die Ausgangszahl erhält in
  der selben Reihenfolgen enthält, nur eben verschoben.
  .
  142857 * 2 = 285714
  142857 * 3 = 428571
  142857 * 4 = 571428
  142857 * 5 = 714285
  714285 * 6 = 857142  
  .
  Übrigens sind alle zyklischen Zahlen durch 9 teilbar.
{% endcomment %}

# Save Your Master

## Vorwort

Die Inhalte dieses Beitrages und des beschriebenen Spiels sollen schockieren und
unterhalten jedoch nicht die Meinungsbildung beeinflussen oder zu realen
Handlungen anregen.

## Spielprinzip

Mein erstes Computerspiel, fertiggestellt Mitte 2013. Damals war ich gerade
einmal 15 Jahre alt. Zu diesem Zeitpunkt befand sich die Masterarbeit meines
Bruders gerade in der Endphase, die Verteidigung stand unmittelbar bevor.

Und genau um dieses Kolloquium dreht sich das Spiel. Die Verteidigung der
Arbeit wird wortwörtlich genommen und ironisch überspitzt dargestellt. Die
Masterarbeit muss in einer Arena gegen Angreifer verteidigt werden.

Diese sollen mit grauen Haaren und Brille Professoren repräsentieren und
springen von rotierenden Plattformen auf das Spielfeld, welches über einem
Lavasee schwebt. In der Mitte des Spielfeldes wird die Masterarbeit durch ein
aufgeschlagenes Buch auf einem Podest symbolisiert.

Das Spiel gilt als verloren, sobald drei Professoren das Podest erreicht haben.
Das Ziel des Spielers ist es dies zu verhindern. Als Werkzeug dazu dient ihm
natürlich ein Flammenwerfern. Mit diesem können die Angreifer in Brand gesetzt
werden.

Zusätzlich befinden sich auf dem Spielfeld noch zwei Hindernisse in Form von
frei rotierenden Zahnrädern.
Wenn ein Angreifer von diesem erfasst wird, wird diesem der Unterkörper
abgetrennt und er kann nur noch auf dem Boden weiter kriechen.

<video width="740" controls>
  <source src="{{ "assets/save-your-master/save_your_master_gameplay.webm" | absolute_url }}" type="video/webm">
  Your browser does not support the video tag.
</video>

## Inspiration

Als Vorbild für das Spiel diente unter anderem das Kapital "We don't go to
Ravenholm" aus dem Spiel Half Life 2.

<video loop width="740" controls>
  <source src="{{ "assets/save-your-master/hl2_zombies.webm" | absolute_url }}" type="video/webm">
  Your browser does not support the video tag.
</video>


## Technischer Hintergrund

Das Spiel läuft in der in Blender integrierten Game Engine.
Die Modells wurden alle in Blender modelliert und die Texturen mittels Gimp
generiert. Allerdings hätte es Paint wohl auch getan.

Die Spiellogik wurde komplett mit dem Logic Editor von Blender umgesetzt.

Im Logiceditor werden **Sensoren** über **Controller** mit **Actuatoren**
verbunden. Damit lassen sich zum einen einfache Zusammenhänge abbilden, wie
Bluttropfen berührt den Boden (*Collision*) und verschwindet
(*End Object*) und hinterlässt einen Blutsfleck (*Add Object*).

![Blender Logic Editor simple logic]( {{ "assets/save-your-master/blender_logic_editor_simple.jpeg" | absolute_url }})

Aber auch komplexe Prozesse können mittels sogenannter States moduliert werden,
wie zum Beispiel die eingeblendete Lebensanzeige.

![Blender Logic Editor working with states]( {{ "assets/save-your-master/blender_logic_editor_states.jpeg" | absolute_url }})

Vom ersten State (volle Leben) wird bei Erhalt einer bestimmten Nachricht in den
zweiten State gewechselt. Dort wird das äußerste Leben entfernt und wieder bei
Erhalt der Nachricht in der nächsten State gewechselt. Dies geht so weiter, bis
alle Leben verbraucht sind.

## Wo kann man das spielen?

Das *.blend* File und die Texturen für das Spiel sind auf GitLab in dem
Repository
[kalehmann/SaveYourMaster](https://gitlab.com/kalehmann/saveyourmaster)
einsehbar.

## Trivia

- die für die Entwicklung verwendeten Blenderversionen sind 2.65 (Release
  Dezember 2012) und 2.66 (Release Februar 2013)
- auf meinem zweiten Blog wurde das Spiel in einem auf den 06.05.2013
  datierten Blog vorgestellt.
- am 11.07.2013 wurde das Spiel von mir an meinem Gymnasium in einem Workshop
  zum Thema Blender vorgestellt.

Schlussendlich habe ich mich entschieden, dass Veröffentlichungsdatum von
meinem ehemaligen Blog zu übernehmen.
