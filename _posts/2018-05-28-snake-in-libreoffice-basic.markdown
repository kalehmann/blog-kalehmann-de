---
categories:       blog
date:             2018-05-28 13:12:29 +0200
description:  >-
  Ein Computerspiel in einem Tabellenkalkulationsprogramm? Dieser Beitrag
  beschreibt die Implementierung von Snake in LibreOffice Calc.
lang:             de
last_modified_at: 2026-08-10 23:02:00 +0200
layout:           post
tags:
  - Coding
title:            Wie man Snake in LibreOffice Calc umsetzt
---

In der Berufsausbildung zum Fachinformatiker gehört es natürlich auch dazu,
den Schülern den Umgang mit Excel beizubringen.
An meiner Berufsschule war dafür sogar ein Zeitraum von ganzen 20
Unterrichtsstunden eingeplant - nur um den Umgang mit den Funktionen `WENN`
und `SVERWEIS` zu erlernen.
Vor lauter Langeweile habe ich nach kreativen Wegen gesucht, auf denen ich
mich weiter in Excel einarbeiten kann.
Dabei bin ich schließlich auf die Idee gekommen, ein Spiel nur in einem
Tabellenkalkulationsprogramm zu entwickeln.

Als Spiel habe ich Snake ausgewählt - zeitlos, aber dennoch simpel genug
umzusetzen.

Um auch außerhalb des Schulunterrichts an dem Projekt arbeiten zu können,
entschied ich mich in der Umsetzung freie Software zu verwenden.
Somit wählte ich die freie Office-Suite LibreOffice anstatt der in der Schule
hauptsächlich verwendeten, proprietären und kostenpflichtigen Office-Suite
Microsoft Office.

## Technische Umsetzung

Zuerst habe ich überprüft, ob LibreOffice mir überhaupt die Möglichkeiten bietet,
mittels Macros auf Tastaturevents zu reagieren um die Schlange zu steuern.
Nach kurzer Recherche im Internet fand ich dann einen
[Beitrag im LibreOffice Forum][forum_macro_shortcut], welcher zeigt, wie man
Basic-Routinen programmatisch an Tastatur-Events binden kann.

Nachdem damit die Machbarkeit des Projekts geklärt war, begann ich direkt mit
der Umsetzung.
Zuerst habe ich mir überlegt, welche Parameter ich für das Spiel benötige - zum
Beispiel die Startposition der Schlange oder die Größe des Spielfeldes.
Diese Parameter habe ich dann zum einen direkt in das Tabellendokument
eingetragen und eine Subroutine geschrieben, welche diese programmatisch
ausliest und in einem Basic-Objekt vom Typ `Parameters` speichert.

{% highlight visualbasic %}
Type Parameters
	arena_x as Integer
	arena_y as Integer
	arena_width as Integer
	arena_height as Integer
	snake_start_x as Integer
	snake_start_y as Integer
	delay as Integer
	snake_color(2) as Integer
	bounty_color(2) as Integer
	arena_color(2) as Integer
End Type

Sub loadParameters
	sheet = thisComponent.sheets(0)
	arena_x = sheet.getCellByPosition(1, 3)
	arena_y = sheet.getCellByPosition(1, 4)
	arena_width = sheet.getCellByPosition(1, 5)
	arena_height = sheet.getCellByPosition(1, 6)
	snake_start_x = sheet.getCellByPosition(1, 7)
	snake_start_y = sheet.getCellByPosition(1, 8)
	delay = sheet.getCellByPosition(1, 9)
	snake_color_R = sheet.getCellByPosition(1, 10)
	snake_color_G = sheet.getCellByPosition(2, 10)
	snake_color_B = sheet.getCellByPosition(3, 10)
	arena_color_R = sheet.getCellByPosition(1, 11)
	arena_color_G = sheet.getCellByPosition(2, 11)
	arena_color_B = sheet.getCellByPosition(3, 11)
	bounty_color_R = sheet.getCellByPosition(1, 12)
	bounty_color_G = sheet.getCellByPosition(2, 12)
	bounty_color_B = sheet.getCellByPosition(3, 12)
	
	Dim params as new Parameters
	
	params.arena_x = arena_x.value
	params.arena_y = arena_y.value
	params.arena_width = arena_width.value
	params.arena_height = arena_height.value
	params.snake_start_x = snake_start_x.value
	params.snake_start_y = snake_start_y.value
	params.delay = delay.value
	params.snake_color(0) = snake_color_R.value
	params.snake_color(1) = snake_color_G.value
	params.snake_color(2) = snake_color_B.value
	params.arena_color(0) = arena_color_R.value
	params.arena_color(1) = arena_color_G.value
	params.arena_color(2) = arena_color_B.value
	params.bounty_color(0) = bounty_color_R.value
	params.bounty_color(1) = bounty_color_G.value
	params.bounty_color(2) = bounty_color_B.value
End Sub
{% endhighlight %}

Anschließend habe ich die einzelnen Routinen für das Spiel implementiert.
Dazu gehören zum Beispiel
- `drawBounty`, welche die Zelle mit dem Ziel im Dokument farblich markiert
- `drawSnake`, welche die Hintergrundfarbe der Zellen welche die Schlange
darstellen, ändert
- `doesSnakeCollideArena`, die überprüft, ob die Schlange mit dem Rand des
Spielfeldes kollidiert
- `doesSnakeCollideSelf`, die prüft, ob die Schlange mit sich selbst
kollidiert.

Außerdem sind die vier Routinen `onKeyDown`, `onKeyLeft`, `onKeyRight` und
`onKeyUp` an die Pfeiltasten gebunden und setzen die neue Richtung der Schlange
in einer globalen Variable.

Am Ende wird alles in der Routine `Start`, welche die Hauptschleife des Spiels
enthält, zusammengefügt.

{% highlight visualbasic %}
Sub Start
	Randomize
	ctx.score = -1
	loadParameters
	drawArena
	createSnake
	placeBounty

	do while isNoCollision()
		updateSnake
		drawSnake
		drawBounty
		wait(ctx.params.delay)
	loop
End Sub
{% endhighlight %}

Diese Routine ist an den Startbutton gebunden.

## Herausforderungen

Leider erwies sich das programmatische Ändern der Hintergrundfarben von Zellen
in LibreOffice als vergleichsweise langsam.
Mit zunehmender Länge der Schlange macht sich eine Abnahme der
Spielgeschwindigkeit auf langsamen Geräten wie Schulrechnern bemerkbar.

Außerdem wird ein Button in den Standardeinstellungen von LibreOffice nach einem
Mausklick automatisch fokussiert.
Somit werden Events der Pfeiltasten nach einem Klick auf den Startbutton
automatisch auf diesen umgeleitet und stehen nicht für die Macros des Spiels
zur Verfügung.

Dies lässt sich einfach beheben, indem man unter **Ansicht** -> **Symbolleisten**
die **Formular-Steuerelemente** Symbolleiste aktiviert und in dieser Symbolleiste
den Entwurfsmodus aktiviert.
Anschließend lässt sich in den Einstellungen für den Startbutton die Option
**Fokussieren bei Klick** auf **Nein** setzen.

Schließlich sind Macros in Officeprogrammen zwar ein mächtiges Werkzeug, aber
gleichzeitig auch eine schwere Gefahrenquelle, da mit ihnen beliebiger Code auf
dem Rechner eines Endnutzers ausgeführt werden kann.
Somit sind Macros in allen gängigen Office-Programmen - wie auch LibreOffice -
standardmäßig deaktiviert und müssen erst per Hand aktiviert werden.

Dazu muss die Macrosicherheit unter **Extras** -> **Optionen** -> **LibreOffice**
-> **Sicherheit** -> **Macrosicherheit**
auf **Niedrig (nicht empfehlenswert)** gestellt werden.

## Das Ergebnis

Am Ende ist Snake in LibreOffice Calc erstaunlich spielbar, wie das folgende
Video zeigt:

<video controls loop>
  <source src="{{ "assets/2018-05-snake/snake.webm" | absolute_url }}" type="video/webm">
  Ihr Browser scheint den video-Tag leider nicht zu unterstützen.
</video>

Der Quellcode sowie das `.ods`-Dokument stehen auf GitHub im Repository
[kalehmann/LibreofficeGames](https://github.com/kalehmann/LibreofficeGames)
bereit.

Zwar ist ein Tabellenkalkulationsprogramm zur Spieleentwicklung eher
ungeeignet, aber dieser Beitrag zeigt, dass es nicht unmöglich ist.
Alles in allem ein gutes Projekt, um sich in einer Doppelstunde Unterricht
spielerisch an die Macroprogrammierung in Tabellenkalkulationsprogrammen
heranzutasten.


  [forum_macro_shortcut]: https://ask.libreoffice.org/en/question/77006/how-can-i-write-a-macro-to-assign-a-shortcut-to-another-macro/
