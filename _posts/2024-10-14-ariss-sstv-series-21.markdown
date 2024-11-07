---
categories:       blog
date:             2024-10-14 21:08:00 +0200
description:  >-
  Receiving a SSTV transmission from the International Space Station in
  celebration of the 67th anniversary of the Sputnik mission.
lang:             en
last_modified_at: 2024-11-07 21:19:00 +0200
layout:           post
tags:
  - Radio
title: >-
  Receiving SSTV images from the International Space Station
---

67 years ago - on October 4th, 1957 - Sputnik 1, the first artificial satellite
of our Earth was launched into orbit.
In celebration of this anniversary, the crew of the International Space Station
broadcasted a series of 12 images using an amateur radio station in the Russian
module of the ISS.
I found out about the event [via reddit][reddit_announcement] where further
details like schedule, mode and frequency were posted.

Three overarching themes of important milestones in the (Russian) history of space
exploration are depicted by 4 pictures each.
In the first group of pictures, the manufacturing, launch and mission of Sputnik 1
are illustrate.
The second group describes the life and work of Konstantin Eduardovich
Tsiolkovsky - a pioneer in rocket science and astronautics known among other
things for the Tsiolkovsky rocket equation.
Bringing us back to the present day, the final group concludes with the current
satellite research of the South-West State University (SWSU) near Kursk.

The illustrations where transmitted using slow-scan television (SSTV) in the mode
PD120.
Each picture has a resolution of 640 x 496 pixels and took 126 seconds to fully
transmit followed by a break of about 2 minutes until the next picture in the
series.
Since the ISS has an orbital period of about 93 minutes, nearly 23 pictures are
transmitted per orbit.
A typical pass of the ISS over my QTH lasts about 10 minutes, so I am able to
receive up to two images per pass with one likely being the one I already got
on the previous pass.
Therefore it was unfortunately not possible for me to capture all pictures of
that series.

[![A Yaesu FT-70DE tuned to 145.800 MHz][yaesu_ft70de]][yaesu_ft70de]{:.float-left}
Due to the fact, that event happened from Tuesday to Monday and many good
passes were on weekdays, I had to improvise the places and methods used to
capture images.
I kept track of the ISS and upcoming passes using the [App Look4Sat][look4sat]
for Android on my phone.
For mobile decoding, I bought two cheap 3.5mm Audio/Video to composite cables and
(mis)used them to wire the right audio channel from my Yaesu FT-70DE via the
CT-44 accessory into the microphone input of my smartphone.
Then I decoded the images with the [App Robot36][robot36].
Unfortunately I did not found a way to simultaneously record and decoded an
image on my phone, as modern Android does not allow recording or capturing
audio in the background.

At home and at the weekend, I had more freedom to experiment and test different
methods to receive the signal.

[![Dirt cheap 3-element tape measure yagi antenna][tape_measure_yagi]][tape_measure_yagi]

For example with a dirt cheap tape-measure-yagi-uda antenna build from wood, tape
measure and tho RTL-SDR blog dipole kit.
The reflector and dipole each measured 1 meter in length and were spaced 50
centimeters apart.
A 94 centimeter long director was then added 15 centimeters behind the dipole.
While I did not do any measurements on the antenna's SWR or gain, testing it in
the field proved it to be good enough.

[![A V-dipole mounted on top of a roof][dipole_roof]][dipole_roof]{:.image-left}
[![A V-dipole in the field][dipole_mobile]][dipole_mobile]{:.image-right}

I also made use of a V-dipole (50 centimeters per leg) either on top of an
attic window and out in the field.
The results were at least better than the hand held radio.

For these attempts I always recorded the signal using an SDR and my laptop for
the ability to optimize gain and bandwidth while receiving and tweaking the
settings for decoding later on.

[![Screenshot from SDR++ showing the signal from the ISS][sdr]][sdr]

Here a slight shift because of the Doppler effect is visible in the waterfall
chart.
Anyway, enough with the technical stuff.
Here come the images:

### Picture 1/12

[![First picture in the series; Sputnik][picture_01]][picture_01]

| Antenna           | Start of recording      | QTH    |
|-------------------|-------------------------|--------|
| tape measure yagi | 2024-10-12 10:50:55 UTC | JO60tq |

<audio controls="" preload="none">
  <source src="{{ "assets/2024-10-ariss-sstv/2024-10-12UTC105055-01.ogg" | absolute_url }}" type="audio/ogg">
</audio>

### Picture 2/12

[![Second picture in the series; Sputnik][picture_02]][picture_02]

| Antenna           | Start of recording      | QTH    |
|-------------------|-------------------------|--------|
| tape measure yagi | 2024-10-12 09:15:22 UTC | JO60uq |

<audio controls="" preload="none">
  <source src="{{ "assets/2024-10-ariss-sstv/2024-10-12UTC091522-02.ogg" | absolute_url }}" type="audio/ogg">
</audio>

### Picture 10/12

[![10th picture in the series; on board of the ISS][picture_10]][picture_10]

| Antenna  | Start of recording      | QTH    |
|----------|-------------------------|--------|
| V-dipole | 2024-10-14 10:50:37 UTC | JO61vb |

<audio controls="" preload="none">
  <source src="{{ "assets/2024-10-ariss-sstv/2024-10-14UTC105037-10.ogg" | absolute_url }}" type="audio/ogg">
</audio>


### Picture 11/12

[![11th picture in the series; showing satellites][picture_11]][picture_11]

| Antenna  | Start of recording      | QTH    |
|----------|-------------------------|--------|
| V-dipole | 2024-10-14 09:16:05 UTC | JO61vb |

<audio controls="" preload="none">
  <source src="{{ "assets/2024-10-ariss-sstv/2024-10-14UTC091605-11.ogg" | absolute_url }}" type="audio/ogg">
</audio>

### Picture 12/12

[![Final picture in the series; showing satellites][picture_12]][picture_12]

| Antenna           | Start of recording      | QTH    |
|-------------------|-------------------------|--------|
| tape measure yagi | 2024-10-13 10:03:42 UTC | JO61sr |

<audio controls="" preload="none">
  <source src="{{ "assets/2024-10-ariss-sstv/2024-10-13UTC100342-12.ogg" | absolute_url }}" type="audio/ogg">
</audio>


### QSL Card

It is possible to obtain a QSL card for receiving images from the ARISS SSTV
event.
Further details on how to do so are liste on the [ARISS homepage][qsl_details].
My QSL card arrived in the post at the beginning of November.

[![A QSL card depicting the ISS][qsl_card]][qsl_card]



  [dipole_mobile]: {{ "assets/2024-10-ariss-sstv/v_dipole_mobile.avif" | absolute_url }}
  [dipole_roof]: {{ "assets/2024-10-ariss-sstv/v_dipole_roof.avif" | absolute_url }}
  [look4sat]: https://github.com/rt-bishop/Look4Sat
  [picture_01]: {{ "assets/2024-10-ariss-sstv/2024-10-12UTC105055-01.avif" | absolute_url }}
  [picture_02]: {{ "assets/2024-10-ariss-sstv/2024-10-12UTC091522-02.avif" | absolute_url }}
  [picture_10]: {{ "assets/2024-10-ariss-sstv/2024-10-14UTC105037-10.avif" | absolute_url }}
  [picture_11]: {{ "assets/2024-10-ariss-sstv/2024-10-14UTC091605-11.avif" | absolute_url }}
  [picture_12]: {{ "assets/2024-10-ariss-sstv/2024-10-13UTC100342-12.avif" | absolute_url }}
  [qsl_card]: {{ "assets/2024-10-ariss-sstv/qsl_card.avif" | absolute_url }}
  [qsl_details]: https://www.ariss.org/qsl-cards.html
  [reddit_announcement]: https://old.reddit.com/user/ARISS_Intl/comments/1fv8p1v/how_about_some_sstv_were_planning_a_slow_scan/
  [robot36]: https://github.com/xdsopl/robot36
  [sdr]: {{ "assets/2024-10-ariss-sstv/sdr.avif" | absolute_url }}
  [tape_measure_yagi]: {{ "assets/2024-10-ariss-sstv/tape_measure_yagi.avif" | absolute_url }}
  [yaesu_ft70de]: {{ "assets/2024-10-ariss-sstv/yaesu_ft70de_145800.avif" | absolute_url }}
