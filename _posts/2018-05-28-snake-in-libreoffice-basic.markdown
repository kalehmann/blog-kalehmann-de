---
layout:       post
title:        Snake in LibreOffice Basic
date:         2018-05-28 13:12:29 +0200
lang:         de
categories:   blog
tags:
  - Coding
---

In der Berufsausbildung zum Fachinformatiker gehört es natürlich auch dazu,
den Schülern den Umgang mit Excel beizubringen.

Über einen Zeitraum von 20 Unterrichtsstunden.

Um mir vollumfängliches Wissen über die Arbeit mit Office anzueignen, habe ich
mich nicht nur wie im Unterricht gefordert mit den **WENN** und **SVERWEIS**
Funktionen von Excel beschäftigt, sondern zusätzlich noch in die
Makroprogrammierung eingearbeitet.
(Um auch außerhalb der Schule an dem Projekt weiterarbeiten zu können habe ich
dabei auf das freie Officepaket LibreOffice gesetzt).

Damit am Ende des ganzen auch ein motivierendes Ziel steht, wählte ich als
Aufgabe die Umsetzung des Spieleklassikers Snake in LibreOffice Basic aus.

Das ganze erfolgte ohne größere Hürden, LibreOffice Basic bietet nämlich sogar
die Möglichkeit auf Tastaturevents zu reagieren.
[Dies ist im LibreOffice Forum bereits ausgiebig diskutiert wurden.](https://ask.libreoffice.org/en/question/77006/how-can-i-write-a-macro-to-assign-a-shortcut-to-another-macro/)

Die Daten für das Spiel, zum Beispiel die Größe des Spielfeldes in Feldern,
Startposition der Schlange und Farben der einzelnen Elemente können dabei
direkt in der Tabelle konfiguriert werden und die erreichte Punktzahl wird
innerhalb des Dokumentes ausgegeben.

LibreOffice selbst ist dabei jedoch an seine Grenzen gestoßen. Mit zunehmender
Länge der Schlange macht sich eine Abnahme der Spielgeschwindigkeit bemerkbar.

Alles in allem ein gutes Projekt um sich in einer Doppelstunde Unterricht
spielerisch an die Makroprogrammierung heran zu tasten.

Das Ergebnis kann im nachfolgenden Video betrachtet werden.

<video style="max-width: 480px" controls>
  <source src="https://raw.githubusercontent.com/kalehmann/LibreofficeGames/master/media/snake.mp4" type="video/mp4">
  Ihr Browser scheint den video-Tag leider nicht zu unterstützen.
</video>

Der Quellcode steht natürlich auch auf GitHub bereit:
[kalehmann/LibreofficeGames](https://github.com/kalehmann/LibreofficeGames)

Um das Spiel zu starten müssen die Makros in LibreOffice aktiviert werden. Dazu
muss die Makrosicherheit unter **Extras->Optionen->LibreOffice->Sicherheit->Macrosicherheit**
auf **Niedrig (nicht empfehlenswert)** gestellt werden.
