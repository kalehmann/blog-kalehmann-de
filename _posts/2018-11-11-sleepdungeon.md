---
layout:       post
title:        SleepDungeon - eine 48 Stunden GameJam
date:         2018-09-29 17:48:01 +0200
lang:         de
categories:   blog
tags:
  - Coding
  - Games
---

## SleepDungeon

Sleepdungeon ist ein in Python3 und PyGame entwickeltes Computerspiel.
Es wurde im Rahmen einer GameJam an der technischen Universität Dresden
innerhalb von 48 Stunden von einem fünfköpfigen Team entwickelt.

Als Inspiration für das Spiel dienten die ersten *The Legend of Zelda* Spiele
und *The Binding of Isaac.*

Der Name des Spiels ist von dem Genre des Games, *Dungeon Crawler* und dem
Namen den unser Team während der Einführung gewählt hat, *Team Sleep*
abgeleitet.

Hier kommentiere ich das erste Level<sup>[[1]](#quelle-1)</sup>:

<video width="740" controls>
  <source src="{{ "assets/sleepdungeon/sleepdungeon-lets_play_the_tutorial.webm" | absolute_url }}" type="video/webm">
  Your browser does not support the video tag.
</video>

## Die GameJam

Bei der GameJam handelte es sich um die
[2. GameJam der Fakultät Informatik Dresden](https://imld.de/gamejam/)

Am ersten Abend fand eine kurze Einführung in die Veranstaltung statt, die
Teams hatten sich zu diesem Zeitpunkt bereits fast alle gefunden.

Danach verteilten sich die Teams auf die vorhandenen Räumlichkeiten und begannen
sowohl die ersten Konzepte festzulegen und die Spiel zu implementieren.

Wie man bereits der Website entnehmen kann waren die Vorgaben der GameJam sehr
lose gesetzt:

> «Ihr habt 48h Zeit, um in Gruppen von 3-5 Personen spannende Spielideen in Form von interaktiven Prototypen umzusetzen»

> «Unser Ziel ist es, die Teilnahme am GameJam so offen wie möglich zu halten und jedem das Mitmachen zu ermöglichen»

> «Wir machen prinzipiell keine Vorgaben, welche Technologien ihr für die Erstellung eurer Spiele verwenden möchtet»

Nachdem die erste GameJam im Jahr zuvor eher kompetitiv war, hat man sich im
diesem Jahr dazu entschieden, auf dem Wettbewerbsaspekt zu verzichten. Daraus
resultierte ein freundschaftlicheres Verhältnis zwischen den Teams.

Wir vollzogen regelmäßig Rundgänge zu den anderen Teams, betrachteten deren
Fortschritte und redeten mit ihnen über die verwendeten Technologien und deren
Ideen welche realisiert werden sollten.
Im Gegenzug dazu wurden wir auch des öfteren von anderen Teams besucht und
manchmal auch belästigt ;)

Im Verlauf der zwei Tage versuchten wir so viel Zeit wie möglich in der Uni mit
der Entwicklung zu verbringen. Verpflegt wurden wir dabei vom Studentencafé,
dem Ascii.

Als Arbeitsplatz stand uns ein eigener Raum zur Verfügung, den wir inklusive
Tafel nutzen konnten. Dies war uns vor allem bei der Planung sehr hilfreich.

![Der Arbeitsplatz meines Teams]({{ "assets/sleepdungeon/team_workplace.jpg" | absolute_url }})

Am Sonntag gegen 16:00 war es dann schließlich soweit. Alle Arbeiten wurden
eingestellt (oder sollten es zumindest) und die Teams bereiteten sich auf die
Präsentation vor. Obwohl sich zwischendurch einige Zweifel regten, ob wir denn
fertig werden, sind wir in der kurzen Zeit doch zu einem vorzeigbaren Ergebnis
gekommen, auf das man auch mal Stolz sein kann.

Zur Präsentation bauten die Teams ihre PCs auf und ließen die anderen Teilnehmer
und hinzugekommenen Zuschauer ihre Spiele testen.

Hier spiele ich SleepDungeon zur Präsentation:
![Ein Bild von mir, wie ich SleepDungeon mit einem Controller spiele]({{ "assets/sleepdungeon/playing_sleepdungeon.jpg" | absolute_url }})

Das Gameplay ist zum Zeitpunkt der Präsentation komplett implementiert. Alle
grundlegenden Funktionen sind vorhanden, das Spiel lässt sich spielen ohne
abzustürzen. Die Texturen sind dank durchgehend passionierter Arbeit unseres
Designers, [Robert Ludwig](https://github.com/MinniFlo), alle fertig und
sehen wahnsinnig gut aus.
Dank der Arbeit von [Martin](https://github.com/MartinOehme) existieren auch
zwei Ebenen. Davon stellt die erste das Tutorial mit einem einzigen Raum dar,
während die zweite das eigentliche Spiel mit ganzen 30 Räumen enthält.
Aufgrund des großen Aufwandes, diese Anzahl an Räumen allein aus dem Kopf zu
erstellen hat er sich dabei auch Skizzen auf Papier erstellt:

![Eine der initialen Skizzen der Karte des Spiels]({{ "assets/sleepdungeon/map_sketch.jpg" | absolute_url }})

Der Stand zum Release lässt sich auf dem
[original Branch des Repositories](https://github.com/r0bertu/gamejam2/tree/original)
nachvollziehen.


## Weiterentwicklung nach der GameJam

Im Verlauf der letzten Woche sind noch einige Änderungen hinzugekommen.
Zusammen mit [Robert](https://github.com/r0bertu) habe ich noch ein Hauptmenü
implementiert. Dazu sind auch noch zwei weitere Schwierigkeitsgrade
hinzugekommen.

Es hat sich nämlich herausgestellt, dass das Spiel für einige Spieler zu
anspruchsvoll ist. Somit ist noch ein leichter Schwierigkeitsgrad hinzugekommen,
in dem die Gegner signifikant mehr Herzen droppen und diese auch die doppelte
Heilungskraft besitzen. In diesem Modus ist es einfach zum finalen Raum des
Spiels zu gelangen.

Außerdem gibt es nun noch einen Hardmode, in diesem droppen die Gegner keine
Herzen mehr.

Zusätzlich hat [Lars](https://github.com/pixix4) noch die Pfadfindung der
Gegner überarbeitet, diese laufen nun auch noch umher, wenn sie den Spieler
nicht erreichen können.

## Wo kann man das Zocken?

Das Spiel kann prinzipiell auf allen Plattformen gezockt werden, auf denen
Python3 und PyGame läuft. Dazu checkt man einfach das zur Entwicklung
genutzte [Repository von Robert](https://github.com/r0bertu/gamejam2) aus und
startet das Spiel mittels folgendem Befehl:

```
python3 bin/sleepdungeon
```

Wer macOS oder Windows nutzt und wem das zu kompliziert ist, der kann sich
auch eine fertig gebundelte Version des Spiels herunterladen.

Diese gibt es für beide Systeme auf der
[Website des Spiels](https://sleepdungeon.de).


## Einzelnachweise

<small>
1: <a id="quelle-1"></a>
Der im Hintergrund laufende Soundtrack des Spiels ist eine modifizierte Version
von [*La Calahorra*](http://freemusicarchive.org/music/Rolemusic/~/calahorra)
des Künstlers [*Rolemusic*](http://rolemusic.sawsquarenoise.com/) und lizensiert
unter
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
</small>
