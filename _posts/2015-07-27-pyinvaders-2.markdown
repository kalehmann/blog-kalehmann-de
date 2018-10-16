---
layout:       post
title:        PyInvaders2 - Space Invaders in Pygame
date:         2015-07-27 11:23:58 +0200
lang:         de
categories:   blog
tags:
  - Coding
  - Games
---

{% comment %}
  Leider lässt sich die Entwicklung von Veröffentlichung dieses Projektes nicht
  mehr genau Datieren.
  .
  Folgende Fakten ermöglichen zumindest ein grobe Datierung:
   - das Vorgängerprojekt wurde im Jahr 2014 im Juli in einem Workshop verwendet
   - dieses Projekt wurde Mitte 2015 in einem Workshop verwendet
   - der erste Commit auf GitHub ist auf den 08.10,2014 datiert
  .
   Das Datum wurde daraufhin zufallsbasiert auf einen Zeitraum nach dem Workshop
   festgelegt.
   .
   Die Uhrzeit der Veröffentlichung entspricht dem Anfang der Fibonacci Folge:
   1, 1, 2, 3, 5, 8, ...   
{% endcomment %}

# PyInvaders2

Dieses Spiel stellt den Retro-Klassiker Space Invaders nach. Es wurde für einen
Workshop zur Gestaltung von Texturen in Videospielen geschrieben.

Daraus folgte die Anforderung alle Assets so flexibel wie möglich anpassen zu
können. Alle Ressourcen können nach Belieben ersetzt werden.
Dabei können Texturen sowohl statisch als auch animiert sein. Dazu ist keine
weitere Konfiguration notwendig. Wenn die Ressource als einzelne Datei vorliegt,
wird diese als statische Textur verwendet. Wenn eine Ordner mit dem Namen der
Ressource existiert und durchnummerierten Bildern enthält werden diese als
animierte Textur verwendet. Andernfalls wird eine entsprechende Fehlermeldung
ausgegeben.  

Das Spiel und dessen Quellcode kann [auf GitLab heruntergeladen werden](https://gitlab.com/kalehmann/PyInvaders2).

# Das Spiel

Das Spiel orientiert sich lose an dem originalen Space Invaders, das ich jedoch
selbst nie gespielt habe. Es gibt Reihen von Aliens - den Invadern - die sich
vom oberen Spielfeldrand nach unten bewegen und dabei sporadisch Schüsse
abfeuern.

Am unteren Bildschirmrand befindet sich ein vom Spieler gesteuertes Raumschiff,
welches in der Horizontalen bewegt werden kann und die Möglichkeit besitzt
selbst Schüsse auf die Invaders abzusetzen. Sind alle Invaders ausgelöscht
erscheinen prompt die nächsten Reihen.

Das Spiel ist beendet, wenn das Raumschiff 6 Mal von Schüssen der Aliens
getroffen wurde - dass heißt die 6 Leben des Raumschiffs welche in der rechten
oberen Ecke symbolisiert werden verbraucht sind - oder ein Alien das Raumschiff
oder den unteren Bildschirmrand berührt.

Im Unterschied zum Original existieren in PyInvaders2 jedoch keine Barrieren
hinter denen das Raumschiff Schutz findet. Außerdem bleibt die Geschwindigkeit
der Aliens mit fortlaufendem Spiel konstant.

<video width="740" controls>
  <source src="{{ "assets/pyinvaders2/pyinvaders2-gameplay.webm" | absolute_url }}" type="video/webm">
  Your browser does not support the video tag.
</video>

# Der Workshop

Der Workshop zu dem Spiel beinhaltete die Arbeit mit verschiedenen
Grafikprogrammen zum Modifizieren der Texturen. Dazu wurde den Teilnehmern
[dieses Dokument mit der Beschreibung von allen relevanten Dateien ausgehändigt](https://gitlab.com/kalehmann/PyInvaders2/blob/master/doc/info.pdf).
Auf den Wunsch einiger Teilnehmer wurde jedoch auch die Erstellung von
Audiodateien mit einbezogen.

Danach wurden noch die einzelnen Level bearbeitet, sprich die Anordnung der
Invaders auf dem Spielfeld. Die einzelnen Levels werden durch Textdateien
abgebildet. Diese bestehen aus jeweils 5 Zeilen zu 19 Zeichen. Dabei bildet eine
"**0**" einen leeren Platz und ein "**#**" einen Invader ab.

Zur Erstellung dieser Dateien existiert ein Levelcreator, welcher dem Spiel
beiliegt.

<video loop width="740" controls>
  <source src="{{ "assets/pyinvaders2/pyinvaders2-editor.webm" | absolute_url }}" type="video/webm">
  Your browser does not support the video tag.
</video>

Am Ende folgte die Präsentation der entstandenen Werke. Die Vielfalt reichte von
einigen Space Invader klonen zu kreativen Ausreißern wie dem Kuchen der in der
Küche die Fruchtfliegen abschießt.

# Trivia

- bereits im Sommer 2014 fand ein Workshop mit der Vorgängerversion dieses Spiels
statt. PyInvaders war mein erstes Programmierprojekt. Es wurde ebenfalls in
Python geschrieben, allerdings komplett funktional ohne eine einzige Klasse.
- PyInvaders2 wurde direkt im Anschluss an den ersten Workshop entwickelt und im
Oktober 2014 auf GitHub veröffentlicht.
