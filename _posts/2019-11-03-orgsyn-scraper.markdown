---
layout:       post
title:        Writing a simple web scrapper in Python and grabbing the contents of orgsyn.org
date:         2019-11-03 22:17:11 +0200
last_modified_at: 2019-11-20 01:10:04 +0200
lang:         en
categories:   blog
tags:
  - Coding
---

### Introduction

A friend of mine studies chemistry. Sometimes I help him out with technical
problems, for example
[connecting a Raspberry Pi to old GDR equipment for automated temperature measurement]({% post_url 2018-07-30-automatische-temperaturerfassung-mit-ursamar-rk44 %})
of an experiment. A few days ago he asked me for my advice on the simplest way
to automate the download of various files from a website.

The website he talked about was the homepage of Organic Synthesis, an US
scientific journal publishing articles about the synthesis of organic compounds.
The journal is published annually and since the year 1998 all previous and new
annual volumes are available online at [http://orgsyn.org](http://orgsyn.org).
Going through the pages of the journal online is not the most convenient way of
reading it. Their server is slow, sometimes unreachable and the page itself is
not readily accessible.

### First approach

I received the message from my friend on my way home from work and just took a
quick glance at the website on my phone. It all seemed really easy, there is a
quick navigation with all the volumes, their pages and each field of that quick
navigation directs you to a page with a link to a PDF file. Just get the links
and then download the files, right?

At home I realized, that the task would not be as easy as I thought.
The navigation of the
journals synthesis procedures consists of two `<select>` elements. One for the
annual volume and one for the pages of that volume. I figured out, the first
step would be collecting the pages of each volume. But that already evolved into
the first problem. I hoped that the pages of the volume would just be embedded
into the page, but it turned out that was not the case. The pages of each volume
have to be requested separately. Well, there will be an endpoint for that,
taking just the volume as input and returning a list (hopefully JSON) with all
the pages. But that would be too easy. The page has one endpoint for everything
and all actions of the page are bundled in one big form and the responses from
that endpoint are mostly binary with some HTML embedded.

A request for the pages of a volume looks like this (please note all the
additional fields, that have nothing to do with the pages or the volume):

{% highlight json %}
{
    "ctl00$ScriptManager1": "ctl00$UpdatePanel1|ctl00$QuickSearchAnnVolList1",
    "ctl00$QuickSearchAnnVolList1" : "96",
    "ctl00$tab2_TextBox": "",
    "ctl00$TBWE3_ClientState": "",
    "ctl00$SrcType": "Anywhere",
    "ctl00$MainContent$QSAnnVol": "Select Ann. Volume",
    "ctl00$MainContent$QSCollVol": "Select Coll. Volume",
    "ctl00$MainContent$searchplace": "publicationRadio",
    "ctl00$MainContent$TextQuickSearch": "",
    "ctl00$MainContent$TBWE2_ClientState": "",
    "ctl00$MainContent$SearchStructure": "",
    "ctl00$MainContent$SearchStructureMol": "",
    "ctl00$HidSrcType": "",
    "ctl00$WarningAccepted": "0",
    "ctl00$Direction": "",
    "__LASTFOCUS": "",
    "__EVENTTARGET": "ctl00$QuickSearchAnnVolList1",
    "__EVENTARGUMENT": "",
    "__ASYNCPOST": "true",
    "__VIEWSTATE": "[long base 64 encoded data]",
    "__VIEWSTATEGENERATOR": "[whatever]",
    "__EVENTVALIDATION": "[long base 64 encoded data]",
}
{% endhighlight %}

and the response for this request is a few hundred kilobytes and contains
several HTML and JavaScript blocks as well as some binary data.

The website was built using ASP.NET and there are some special fields on the
form, namely `__VIEWSTATE`, `__VIEWSTATEGENERATOR` and `__EVENTVALIDATION`.
The values of these fields are tied to the session and the current state of the
website and cannot be easily generated on client side or be omitted. That
means before any POST request, an initial request has to be performed to obtain
these values.

At first I figured out the simplest way would be writing a userscript for the
browser, so I do not have to receive and process these values myself. The
browser would do all session related tasks for me, the JavaScript on the page
parses the response for me and I could scrape the page without additional
libraries using JavaScripts `Document.querySelector()` method.
So I wrote a simple script, that created an `<iframe>` element on the side,
redirected the main form to the `<iframe>` element and queried it for links to
PDF files after each request. In the end the script provided a JSON file with
all the links and file names for download.

It was a horrible solution - slow, hard to debug and it would get stuck
on some random server side problems, like the page being unreachable for a few
minutes. Last but not least the website has a few special cases like page 121 of
annual volume 49, which exists twice in the navigation and also has a different
layout than the other pages or page 1 of the annual volume 88 which links
directly to a PDF file. The latter was especially problematic, since I could
not easily catch the redirect, nor could I get the current URL of the `<iframe>`
due to the same origin policy.

### Second approach

In the end I still managed to obtain about 2700 links to PDF files on the site
over the span of several hours. Nevertheless I knew that I missed some through
the weak points of my script. Therefore I decided to write a working scraper for
that website in Python with real error handling and parallel scraping of
the site. From my previous attempt I knew that I need to perform three different
kinds of requests to the site:

* a request for all annual volumes
* a request for all pages of each volume
* a request for each page

Requesting all annual volumes is easy, the volumes are embedded in an option
element in the main page and can be obtained with a simple GET request. The
other two requests always need the `__VIEWSTATE`, `__VIEWSTATEGENERATOR` and
`__EVENTVALIDATION` values from the previous request. But in the end this was
not a huge problem and I finished the program within a few days.

By the time I had a working prototype I did a test run and downloaded all the
files from volume 96. Turns out there was 300 Megabytes of data in total.
With 96 volumes that would be almost 30 Gigabytes. I would not be meeting up
with my friend any time soon to give him a portable drive with all the Files,
I needed to
reupload them somewhere else. Downloading them to my PC and uploading them to
some free Cloud Storage would seem too inefficient for me, with my upstream at
home it would take several hours to upload the data again after I
have already downloaded it.
I figured out the best option would be to rent a cloud server, download all
the files to the server, repack them and let my friend download the
packed files from
the cloud server. Since cloud servers can be paid per hour this would
not be too much of an expense. I rented out a small server for about two days
and did a few test runs before the final download.
All in all it cost me about the deposit
of two beer bottles (or 16 cent if you are not familiar with the German bottle
deposit system). During the final tests on the server I also discovered some
problems, for example the names of some of the procedures names described by the
files were longer than the file name limit of 255 characters and had to be
shortened to use them as file names for the downloaded files.

### Final thoughts

At some point I let my script run through until the end, downloading all files.
Everything worked well and then I realized two things.

1. First of all, their ASP.NET application is the bottleneck.
Downloading all the
files took like five minutes, but collecting all the links was painfully slow.
2. My extrapolation of the file size was seriously wrong. Only the PDF
files of the last few volumes were that big, the overall size of all 3006 PDF
files was only about 3 gigabytes. After all my idea of renting a server for it
was like taking a sledgehammer to crack a nut.

Nevertheless the download went successfully, my friend got all the files and I
canceled the server. Last but not least, I made my scraper
[available GitHub](https://github.com/kalehmann/org-syn-scrapper), since I put
a lot of work in it and it may be useful to somebody else.
