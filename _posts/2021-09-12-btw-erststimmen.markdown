---
categories:       blog
date:             2021-09-12 23:33:32 +0200
description:  >-
  Welche Bedeutung haben die Erststimmen bei der Bundestagswahl?
  Wie repräsentativ sind Direktmandate für die politische Stimmung im
  Wahlkreis?
lang:             de
last_modified_at: 2021-09-12 23:33:32 +0200
layout:           post
tags:
  - Coding
  - Politics
title:            Repräsentation der Erststimmen zur Bundestagswahl
---

In der Regel findet in der Bundesrepublik Deutschland aller 4 Jahre die
Bundestagswahl zur Bestimmung der Abgeordneten des Bundestages statt.
Zur Wahl wird in der Bundesrepublik mit der personalisierten Verhältniswahl ein
Mischwahlsystem angewendet.
Dabei wird das Bundesgebiet in 299 Wahlkreise aufgeteilt und jeder Wahlkreis
darf einen Abgeordneten direkt in das Parlament wählen.
Doch wie repräsentativ ist dieser Abgeordnete für die Politik in dem Wahlkreis?

Um diese Frage zu beantworten sollen die Ergebnisse der letzten Wahl erfasst
und ausgewertet werden.

### Die Wahl

Die meisten erwachsenen Staatsbürger sollten mit dem Stimmzettel zur
Bundestagswahl vertraut sein.
Jeder Wähler besitzt eine Erst- und Zweitstimme.

Mittels der Erststimme wird für jeden der 299 Wahlkreise
ein Abgeordneter in einer _relativen Mehrheitswahl_ bestimmt.
Bei der _relativen Mehrheitswahl_ gewinnt ausschließlich der Abgeordnete mit
den meisten Stimmen, dabei muss dieser Abgeordnete allerdings keine absolute
Mehrheit erreichen.
Somit ist die Vertretung aller Regionen der Bundesrepublik im Parlament
gewährleistet.

Über die Zweitstimme wird eine Partei gewählt, deren Kandidierende über die
Landesliste in den Bundestag einziehen können.
Nach [_Artikel 38 des Grundgesetzes_][gg_38]

> Die Abgeordneten des Deutschen Bundestages werden in allgemeiner, unmittelbarer, freier, gleicher und geheimer Wahl gewählt.

besteht eine Gleichheit der Wahl.
Diese Gleichheit bedeutet unter anderem, dass jeder Wählende den gleichen Einfluss
auf die Sitzverteilung im Parlament hat.
Somit ist die Wahl per Zweitstimme eine _Verhältniswahl_, die über die
Sitzverteilung der Parteien in dem Bundestag entscheidet.

Der Bundestag besitzt mindestens 598 Abgeordnete, zusammengesetzt aus 299
Abgeordneten welche über Direktmandate in den Bundestag einziehen und
299 Abgeordneten, welchen über die Landeslisten in den Bundestag einziehen.

Wenn mehr Abgeordnete einer Partei über Direktmandate in den Bundestag
einziehen, als der Partei nach der Wahl über die Zweitstimme zustehen,
bezeichnet man die überschüssigen Mandate als _Überhangmandate_.
Diese können in der Regel keinen einzelnen Abgeordneten zugeordnet, sondern nur
in ihrer Gesamtzahl benannt werden.
Ausnahmen davon bilden Direktmandate von Abgeordneten ohne Parteizuordnung oder
Direktmandate aus Parteien, welche an der Sperrklausel (5% Hürde) gescheitert
sind.

Die Überhangmandate führen zu einem Missverhältnis zwischen den Sitzen einer
Partei im Parlament und dem Ergebnis der Verhältniswahl.
Um dieses Missverhältnis zu begrenzen werden Zweitstimmen von Wählern, die für
einen erfolgreichen Direktkandidierenden der nicht von einer Partei aufgestellt
wurde oder dessen Partei an der Sperrklausel scheiterte verworfen.

Weiterhin werden Parteien, die durch die Überhangmandate unterrepräsentiert
sind sogenannte _Ausgleichsmandate_ zugestanden.
Somit wird sichergestellt, dass die Parteien im Bundestag möglichst entsprechend
ihrem Zweitstimmenanteil vertreten sind.

Soweit zur Wahl, im folgenden wird Dokumentiert, wie man die Daten zur
Bundestagswahl auswerten kann.

### Wahlergebnisse strukturiert erfassen

In der Bundesrepublik ist es die Aufgabe des Bundeswahlleiters - traditionell
der Präsident des Statistischen Bundesamtes - das endgültige Wahlergebnis
bekannt zu geben.

Die Ergebnisse der letzten Bundestagswahl im Jahr 2017 sind auf der Website
des Bundeswahlleiters im maschinenlesbaren CSV Format verfügbar.
Zur Auswertung der Daten wird im Folgenden Python verwendet.
Python bringt im [`csv` Modul die `reader` Funktion][csv_reader] mit.

> Return a reader object which will iterate over lines in the given csvfile.
> csvfile can be any object which supports the iterator protocol

Um die CSV Datei als Iterator zu behandeln bietet sich die [`requests`][py_req]
Bibliothek an.
Diese bietet mit der [`iter_lines` Methode der `Response` Klasse][req_iter]
eine Iterator über eine HTTP-Ressource an.

```
pip3 install requests
```

Schließlich kann man den CSV-Inhalt mittels folgendem Code laden:


```python
import csv
import requests

def lade_wahlergebnis() -> list:
    response = requests.get(
        'https://www.bundeswahlleiter.de/dam/jcr/72f186bb-aa56-47d3-b24c-6a46f5de22d0/btw17_kerg.csv',
        stream=True,
    )
    response.encoding = 'utf-8'
    reader = csv.reader(
        response.iter_lines(decode_unicode=True),
        delimiter=';',
    )
    return list(reader)

```

In dem vom Bundestagswahlleiter bereitgestelltem Format sind die Daten schwer
verwertbar.
Ein Format, mit dem sich eher arbeiten lässt wäre:

```json
{
    "<Wahlkreisnummer>" : {
        "bundesland" : "<Name des Bundeslandes>",
        "bundesland_nr" : "<Nummer des Bundeslandes>",
        "erststimmen" : {
            "<Name der Partei>" : 0.1
        },
        "name" : "<Name des Wahlkreises>",
        "wahlberechtigte_erststimme": 1,
        "wahlberechtigte_zweitstimme": 1,
        "zweitstimmen" : {
            "<Name der Partei>" : 0.1
        }
    }
}
```

In den vorliegenden Daten sind lediglich die absoluten Stimmen aufgelistet,
das relative Ergebnis muss noch berechnet werden.

```python
def konvertiere_wahldaten(daten: list) -> dict:
    bundeslaender = {}
    # Die Parteien beginnen ab der 20. Spalte in der 6. Zeile im Abstand von 4
    # Feldern.
    parteien = [
        daten[5][i] for i in range(19, len(daten[5]) - 8, 4)
    ]
    wahlkreise = {}
    # Die Wahlkreise starten ab der Reihe 9
    for reihe in daten[8:]:
        if not reihe[0] or reihe[0] == '99':
            # Ignoriere leere Reihen
            # Der Schlüssel '99' steht für das Bundesgebiet
            continue
        if reihe[2] =='99':
            # Bundesländer gehören zu Gebiet 99.
            # Die Ergebnisse der Bundesländer sind fúr diese Auswertung nicht
            # relevant.
            bundeslaender[reihe[0]] = reihe[1]
            continue
        erststimmen_total = int(reihe[15])
        zweitstimmen_total = int(reihe[17])
        erststimmen = [reihe[i] for i in range(19, len(reihe) - 8, 4)]
        zweitstimmen = [reihe[i] for i in range(21, len(reihe) - 8, 4)]
        wahlkreise[reihe[0]] = {
            "bundesland_nr" : reihe[2],
            "erststimmen" : {
                # Besitmme relatives Ergebnis der Erststimmen
                partei : int(ergebnis) / erststimmen_total if ergebnis else 0
                    for partei, ergebnis in zip(parteien, erststimmen)
            },
            "name": reihe[1],
            "wahlberechtigte_erststimme": int(reihe[3]),
            "wahlberechtigte_zweitstimme": int(reihe[5]),
            "zweitstimmen" : {
                # Besitmme relatives Ergebnis der Zweitstimmen
                partei : int(ergebnis) / zweitstimmen_total if ergebnis else 0
                    for partei, ergebnis in zip(parteien, zweitstimmen)
            },
        }
    for wk in wahlkreise.values():
        wk["bundesland"] = bundeslaender[wk["bundesland_nr"]]
    return wahlkreise
```

### Auswertung der Daten

Für jeden Wahlkreis soll zuerst der Gewinner der Erststimme ermittelt werden.

```python
def gewinner_erststimme(wahlkreis: dict) -> str:
    return reduce(
        lambda a, b: a if a[1] > b[1] else b,
        wahlkreis["erststimmen"].items(),
    )[0]
```

Anschließend sollen aus den Ergebnissen der Zweitstimme mögliche Koalitionen
ermittelt werden:

```python
def bestimme_koalitionen(wahlkreis: dict) -> list:
    koalitionen_1 = map(
        lambda x: [x],
        wahlkreis["zweitstimmen"].items(),
    )
    koalitionen_2 = combinations(
        wahlkreis["zweitstimmen"].items(),
        2,
    )
    koalitionen_3 = combinations(
        wahlkreis["zweitstimmen"].items(),
        3,
    )
    koalitionen = [*koalitionen_1, *koalitionen_2, *koalitionen_3]
    return list(
        map(
            lambda a: tuple(map(lambda b: b[0], a)),
            filter(
                # Entferne Koalitionen ohne absolute Mehrheit
                lambda x: sum(map(lambda a: a[1], x)) >= 0.5,
                koalitionen,
            )
        )
    )
```

Wann ist der Direktkandidat nun repräsentativ für die lokale Politik in seinem
Wahlkreis?
Ich lege dafür das Kriterium fest, dass **keine** Koalition mit maximal 3
Parteien gebildet werden kann, in welcher die Partei des Direktkandidaten
**nicht** enthalten ist.

```python
from functools import reduce
from itertools import combinations

def erststimme_in_koalition(wahlkreis: dict) -> bool:
    erststimme = gewinner_erststimme(wahlkreis)
    koalitionen = bestimme_koalitionen(wahlkreis)
    return all(erststimme in koalition for koalition in koalitionen)
```

Mit allem zusammen lassen sich die Wahlkreise auflisten, in denen der
Direktkandidat keiner Partei mit Chance auf eine Mehrheit durch eine
Koalition angehört.

```python
def terminal_output(daten: dict) -> None:
    for wk_nr, wk in daten.items():
        print(
            f"Im Wahlkreis {wk_nr} sind Koalition ohne die Partei des "
             "Direktkandidaten möglich",
        )
        print(f" > Direktkandidat aus der Partei {gewinner_erststimme(wk)}")
        print(f" > Ergebnisse Zweitstimme:")
        for name, ergebnis in wk["zweitstimmen"].items():
            if ergebnis < 0.05:
                continue
            print(f"    {name:45} : {int(ergebnis * 100):2}%")

daten = konvertiere_wahldaten(
    lade_wahlergebnis(),
)
# Daten nach Bundesland, Name des Wahlkreises sortieren
daten = sorted(daten.items(), key=lambda a: a[1]["bundesland"] + a[1]["name"])
kritisch = {
    wk_nr : wk for wk_nr, wk in daten if not erststimme_in_koalition(wk)
}

terminal_output(kritisch)

```

Außerdem können die Daten auch im YAML Format exportiert werden:

```python
import yaml

def str_presenter(dumper, data):
    return dumper.represent_scalar('tag:yaml.org,2002:str', data, style='"')

yaml.representer.SafeRepresenter.add_representer(str, str_presenter)

with open("<path>.yaml", "w") as f:
    f.write(yaml.safe_dump(kritisch, allow_unicode=True, sort_keys=False))
```

# Diskussion

Die interaktive Karte listet Wahlkreise in den Koalitionen ohne die Partei des
Direktkandidaten möglich sind.

<style>
    figure > svg {
        height: fit-content;
        width: 100%;
    }
</style>

<figure>
    {% include_relative assets/btw_erststimmen/brd.svg %}
    <figcaption>
        <a href="https://commons.wikimedia.org/wiki/File:Karte_Deutsche_Bundesl%C3%A4nder_(nummeriert).svg">Karte der Bundesrepublik</a>,
        <a href="https://commons.wikimedia.org/wiki/User:David_Liuzzo">David Liuzzo</a>,
        <a href="https://creativecommons.org/licenses/by-sa/2.0/de/deed.en">(CC BY-SA 2.0 DE)</a>,
        Nummerierung entfernt / Änderungen am Code
    </figcaption>
</figure>

<style>
    table tr > td {
        padding: 5px 7.5px;
    }

    td > table {
        margin: -5px -7.5px;
        width: auto;
    }

    .wahlergebnis {
        height: auto;
        font-size: 0.9rem;
        overflow: hidden;
    }

    .wahlergebnis > div {
        overflow-x: auto;
    }

    .wahlergebnis:not(:target) {
        height: 0px;
    }
</style>

{% assign wahlkreise = site.data.btw_erststimmen.wahlkreise_2017 %}
{% assign bundesland = "" %}
{% for wk in wahlkreise %}
    {%- unless wk[1]["bundesland"] == bundesland -%}
        {%- unless bundesland == "" -%}
    </tbody>
</table>
</div>
</div>
        {% endunless %}
<div class="wahlergebnis" id="{{ wk[1]["bundesland"] }}">
<h3>{{ wk[1]["bundesland"] }}</h3>
<div>
<table>
    <thead>
        <tr>
            <th>Nr.</th>
            <th>Gewinner Erststimme</th>
            <th>Ergebnisse Zweitstimme</th>
        </tr>
    </thead>
    <tbody>
        {%- assign bundesland = wk[1]["bundesland"] -%}
    {% endunless %}
        <tr>
            <td>
                <a href="https://bundeswahlleiter.de/bundestagswahlen/2017/ergebnisse/bund-99/land-{{ wk[1]["bundesland_nr"] }}/wahlkreis-{{ wk[0] }}.html">{{ wk[0] }} - {{ wk[1]["name"] }}</a>
            </td>
            {%- assign gewinner = "" -%}
            {%- assign stimmen = 0 -%}
            {%- assign erststimmen = wk[1]["erststimmen"] -%}
            {%- for ergebnis in  erststimmen -%}
                {%- if ergebnis[1] > stimmen -%}
                    {%- assign gewinner = ergebnis[0] -%}
                    {%- assign stimmen = ergebnis[1] -%}
                {%- endif -%}
            {% endfor %}
            <td>{{ gewinner }}</td>
            <td>
                <table>
                    <tbody>
                        {%- assign zweitstimmen = wk[1]["zweitstimmen"] -%}
                        {%- for ergebnis in zweitstimmen -%}
                            {% if ergebnis[1] > 0.05 %}
                        <tr>
                            <td>{{ ergebnis[0] }}</td>
                            <td>{{ ergebnis[1] | times: 100 | round: 1 }}%</td>
                        </tr>
                            {%- endif -%}
                        {% endfor %}
                    </tbody>
                </table>
            </td>
        </tr>
{%- endfor -%}
    </tbody>
</table>
</div>
</div>

**Was bedeuten diese Ergebnisse? - wenig**

Während die Partei der Direktmandate unter Umständen nicht die politische
Stimmung im Wahlkreis der Mandatsträger widerspiegelt, halten sich die
Auswirkungen davon in Grenzen.
Zum einen bleibt das Stimmverhältnis im Bundestag davon durch die
Ausgleichsmandate unbeeinflusst.
Zum anderen fällt bei dieser Analyse komplett herunter, dass der
Direktkandidierende möglicherweise Positionen außerhalb der Parteilinie
vertritt und gerade deswegen gewählt wurde.

Schließlich wird auch nicht darauf eingegangen, ob die möglichen Koalitionen
tatsächlich zustande kommen würden und auch politisch stabil wären.


  [csv_reader]: https://docs.python.org/3/library/csv.html#csv.reader
  [gg_38]: https://dejure.org/gesetze/GG/38.html
  [py_req]: https://docs.python-requests.org/en/master/
  [req_iter]: https://docs.python-requests.org/en/latest/api/#requests.Response.iter_lines
