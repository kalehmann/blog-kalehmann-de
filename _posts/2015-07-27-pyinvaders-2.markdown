---
layout:           post
title:            PyInvaders2 - Space Invaders in Pygame
date:             2015-07-27 11:23:58 +0200
lang:             de
last_modified_at: 2026-08-05 23:26:00 +0200
categories:       blog
tags:
  - Coding
  - Games
---

PyInvaders2 ist eines meiner ersten selbstprogrammierten Computerspiele.
Das Spiel stellt den Retro-Klassiker Space Invaders nach und wurde für einen
Workshop zur Gestaltung von Texturen in Videospielen geschrieben.

Daraus entstand die Anforderung, alle Assets so flexibel wie möglich anpassen zu
können - alle Ressourcen können nach Belieben angepasst werden.
Dabei können Texturen sowohl statisch als auch animiert sein - ohne weitere
Konfiguration.
Wenn eine Textur als einzelne Datei vorliegt, wird sie als statisches Bild
verwendet.
Falls stattdessen ein Ordner mit dem Namen der Textur existiert und
durchnummerierte Bildern enthält, dann werden diese als Animation angezeigt.
Andernfalls wird eine entsprechende Fehlermeldung ausgegeben.

Das Spiel und dessen Quellcode kann
[auf GitLab heruntergeladen werden](https://gitlab.com/kalehmann/PyInvaders2).

# Das Spielprinzip

Das Spiel orientiert sich lose an dem originalen Space Invaders, welches ich
jedoch selbst nie gespielt habe.
Es gibt Reihen von Aliens - den Invaders - die sich vom oberen Spielfeldrand
nach unten bewegen und dabei sporadisch Schüsse abfeuern.

Am unteren Bildschirmrand befindet sich ein vom Spieler gesteuertes Raumschiff,
welches in der Horizontalen bewegt werden kann und die Möglichkeit besitzt
selbst Schüsse auf die Invaders abzufeuern.
Sind alle Invaders ausgelöscht, erscheint unmittelbar die nächste Welle.

Dass Raumschiff hat zu Beginn des Spiels sechs Lebenspunkte, welche in der
rechten oberen Ecke angezeigt werden.
Das Spiel ist beendet, wenn entweder das Raumschiff sechsmal von Schüssen der
Aliens getroffen wurde - dabei verbraucht jeder Treffer einen Lebenspunkt - oder
ein Invader das Raumschiff oder den unteren Bildschirmrand berührt.

Im Unterschied zum Original existieren in PyInvaders2 jedoch keine Barrieren,
hinter denen das Raumschiff Schutz finden kann.
Außerdem bleibt die Geschwindigkeit der Aliens mit fortlaufendem Spiel konstant.

<video controls>
  <source src="{{ "assets/pyinvaders2/pyinvaders2-gameplay.webm" | absolute_url }}" type="video/webm">
  Your browser does not support the video tag.
</video>

# Der Workshop zum Spiel

Der Workshop zu dem Spiel beinhaltete die Arbeit mit verschiedenen
Grafikprogrammen zum Modifizieren der Texturen.
Dazu wurde den Teilnehmern
[dieses Dokument mit der Beschreibung aller relevanten Dateien](https://gitlab.com/kalehmann/PyInvaders2/blob/master/doc/info.pdf)
ausgehändigt.
Auf Wunsch einiger Teilnehmer wurde später zusätzlich auch die Erstellung von
Audiodateien mit einbezogen.

Anschließend wurden noch die einzelnen Level bearbeitet, also die Anordnung der
Invaders auf dem Spielfeld.
Dabei werden die einzelnen Level durch Textdateien beschrieben.
Jede Level-Datei besteht aus fünf Zeilen mit jeweils 19 Zeichen.
In dieser Level-Datei bildet eine "**0**" einen leeren Platz und ein "**#**"
einen Invader ab.

Zur Erstellung dieser Dateien existiert auch ein Level-Editor, welcher dem Spiel
beiliegt.

<video loop controls>
  <source src="{{ "assets/pyinvaders2/pyinvaders2-editor.webm" | absolute_url }}" type="video/webm">
  Your browser does not support the video tag.
</video>

Am Ende des Workshops präsentierten die Teilnehmer die entstandenen Werke.
Die Vielfalt reichte von einigen Space-Invades-Klonen zu kreativen Ausreißern
wie dem Kuchen, welcher in der Küche die Fruchtfliegen abschießt.
