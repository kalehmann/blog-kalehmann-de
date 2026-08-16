---
categories:       blog
date:             2018-11-11 17:48:01 +0200
description:  >-
   SleepDungeon ist ein kurzer Dungeon Crawler, der im Rahmen einer
   GameJam an der TU Dresden entwickelt wurde.
image:
    path: assets/2018-11-sleepdungeon/og_image.png
    width: 500
    height: 500
lang:             de
last_modified_at: 2026-08-16 11:48:10 +0200
layout:           post
tags:
  - Coding
  - Games
title:            SleepDungeon - eine 48 Stunden GameJam
---

Sleepdungeon ist ein in Python 3 und [Pygame][pygame] entwickeltes Computerspiel.
Es wurde im Rahmen einer GameJam an der Technischen Universität Dresden
innerhalb von 48 Stunden durch ein fünfköpfiges Team entwickelt.

Der Name des Spiels leitet sich von dem Genre *Dungeon Crawler* und dem
Namen, den unser Team während der Einführung gewählt hat - *Team Sleep* -
ab.
Als Inspiration für das Spiel dienten die ersten Spiele der
*The Legend of Zelda*-Reihe sowie *The Binding of Isaac*.

Einen kurzen Einblick in das Spiel gibt das erste Level, welches gleichzeitig
das Tutorial darstellt.
Hier spiele ich das Tutorial durch<sup>[[1]](#quelle-1)</sup>:

<video controls>
  <source src="{{ "assets/2018-11-sleepdungeon/sleepdungeon-lets_play_the_tutorial.webm" | absolute_url }}" type="video/webm">
  Your browser does not support the video tag.
</video>

## Die GameJam

Bei der GameJam handelte es sich um die
[2. GameJam der Fakultät Informatik Dresden][gamejam].
Wie man der Website entnehmen kann, waren die Vorgaben der GameJam sehr
lose gesetzt:

> «Ihr habt 48h Zeit, um in Gruppen von 3-5 Personen spannende Spielideen in Form von interaktiven Prototypen umzusetzen»

> «Unser Ziel ist es, die Teilnahme am GameJam so offen wie möglich zu halten und jedem das Mitmachen zu ermöglichen»

> «Wir machen prinzipiell keine Vorgaben, welche Technologien ihr für die Erstellung eurer Spiele verwenden möchtet»

Die GameJam erstreckte sich über ein Wochenende von Freitag- bis Sonntagabend.
Am ersten Abend fand eine kurze Einführung in die Veranstaltung statt.
Zu diesem Zeitpunkt hatten sich bereits fast alle Teams gefunden.
Nach der Einführung verteilten sich die Teams dann auf die vorhandenen
Räumlichkeiten, finalisierten die Konzepte für die Spiele und unternahmen die
ersten Schritte der Implementierung.

Die erste GameJam in diesem Format im Jahr 2017 war eher kompetitiv.
Nun haben sich die Veranstalter 2018 dazu entschieden, auf den
Wettbewerbsaspekt zu verzichten.
Daraus resultierte ein freundschaftlicheres Verhältnis zwischen den Teams.
Wir vollzogen regelmäßig Rundgänge zu den anderen Teams, betrachteten deren
Fortschritte und sprachen mit ihnen über die verwendeten Technologien und deren
Ideen, welche realisiert werden sollten.
Im Gegenzug dazu wurden wir auch des Öfteren von anderen Teams besucht und
manchmal auch belästigt ;)

Im Verlauf der zwei Tage versuchten wir, so viel Zeit wie möglich in der Uni mit
der Entwicklung zu verbringen.
Verpflegt wurden wir dabei vom Studentencafé, dem Ascii.
Als Arbeitsplatz stand uns ein eigener Raum zur Verfügung, den wir inklusive
Tafel nutzen konnten.
Vor allem die Tafel erwies sich bei der Planung als sehr hilfreich.

[![Der Arbeitsplatz meines Teams][workplace]][workplace]

Am Sonntag gegen 16:00 Uhr war es dann schließlich so weit -
alle Arbeiten wurden eingestellt (oder sollten es zumindest werden) und die
Teams bereiteten sich auf die Präsentation vor.
Obwohl wir zwischendurch einige Male daran zweifelten, ob wir denn auch fertig
werden, sind wir in der kurzen Zeit doch zu einem vorzeigbaren Ergebnis gekommen,
auf das wir auch stolz sein können.

Zur Präsentation bauten die Teams ihre PCs auf und ließen die anderen Teilnehmer
und hinzugekommenen Zuschauer ihre Spiele testen.

[![Ein Bild von mir, wie ich SleepDungeon mit einem Controller spiele][playing]][playing]

Das Gameplay war zum Zeitpunkt der Präsentation komplett implementiert.
Alle grundlegenden Funktionen waren vorhanden, das Spiel ließ sich spielen und
es gab keine Abstürze.
Dank der durchgehend passionierten Arbeit unseres Designers,
[Robert Ludwig](https://github.com/MinniFlo), waren alle Texturen fertig und sehen
immer noch wahnsinnig gut aus.

Außerdem umfasst das Spiel dank [Martin](https://github.com/MartinOehme)
zwei Ebenen.
Davon stellt die erste Ebene das Tutorial mit einem einzigen Raum dar und die
zweite Ebene enthält das eigentliche Spiel mit ganzen 30 Räumen.
Natürlich hat er diese Räume nicht nur im Kopf entworfen.
Hier ist die Skizze der Räume auf der zweiten Ebene:

[![Eine der initialen Skizzen der Karte des Spiels][map_sketch]][map_sketch]

Der Stand zum Release lässt sich auf dem
[`original`-Branch des Repositories][original_branch] nachvollziehen.

## Weiterentwicklung nach der GameJam

Im Verlauf der Woche nach dem Ende der GameJam sind noch einige Änderungen
hinzugekommen.
Zusammen mit [Robert](https://github.com/robuf) habe ich noch ein Hauptmenü
implementiert.
Außerdem hat [Lars](https://github.com/pixix4) noch die Pfadfindung der
Gegner überarbeitet.
Diese laufen nun auch umher, wenn sie den Spieler nicht erreichen können.

Weiter haben wir noch zwei weitere Schwierigkeitsgrade implementiert.
Denn es hat sich herausgestellt, dass das Spiel für einige Spieler zu
anspruchsvoll ist.
Somit ist zum einen ein leichter Schwierigkeitsgrad hinzugekommen, in dem die
Gegner signifikant mehr Herzen droppen und diese auch die doppelte
Heilungskraft besitzen.
In diesem Modus ist es nun einfach, zum finalen Raum des Spiels zu gelangen.
Zum anderen ist ein Hardmode hinzugekommen.
In diesem droppen die Gegner hingegen gar keine Herzen mehr.

## Wo kann man das Zocken?

Das Spiel kann prinzipiell auf allen Plattformen gespielt werden, auf denen
Python 3 und Pygame laufen.
Dazu checkt man einfach das zur Entwicklung genutzte
[Repository von Robert](https://github.com/robuf/sleepdungeon) aus und startet
das Spiel mittels folgendem Befehl:

```
python3 bin/sleepdungeon
```

Wer macOS oder Windows nutzt und wem das zu kompliziert ist, der kann sich
auch eine fertig kompilierte Version des Spiels herunterladen.
Diese gibt es für beide Systeme auf der
[Website des Spiels](https://sleepdungeon.de).

## Einzelnachweise

<small>
1: <a id="quelle-1"></a>
Der im Hintergrund laufende Soundtrack des Spiels ist eine modifizierte Version
von [*La Calahorra*](http://freemusicarchive.org/music/Rolemusic/~/calahorra)
des Künstlers [*Rolemusic*](http://rolemusic.sawsquarenoise.com/) und lizenziert
unter
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
</small>

  [gamejam]: https://imld.de/gamejam/
  [map_sketch]: {{ "assets/2018-11-sleepdungeon/map_sketch.jpg" | absolute_url }}
  [original_branch]: https://github.com/robuf/sleepdungeon/tree/original
  [playing]: {{ "assets/2018-11-sleepdungeon/playing_sleepdungeon.jpg" | absolute_url }}
  [pygame]: https://www.pygame.org/docs/
  [workplace]: {{ "assets/2018-11-sleepdungeon/team_workplace.jpg" | absolute_url }}
