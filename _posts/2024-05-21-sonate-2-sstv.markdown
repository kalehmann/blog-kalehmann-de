---
categories:       blog
date:             2024-05-21 16:45:00 +0200
description:  >-
  Receiving a SSTV transmission from the SONATE-2 CubeSat launched by the
  University of Würzburg
lang:             en
last_modified_at: 2026-08-28 17:02:06 +0200
layout:           post
tags:
  - Radio
title: >-
  Receiving SSTV images from SONATE-2
---

In March 2024, the Julius Maximilian University of Würzburg launched a CubeSat
called SONATE-2 (**SO**lutus **NA**no satelli**TE** 2) with a ham radio payload.
The mission includes transmitting images via analog SSTV on several occasions.
Information about the downlink frequency and modulation, as well as the
transmission schedule, can be found on the
[projects page with information for radio amateurs][sonate_2_informations_for_radio_amateurs].

This satellite did a pass over my location which coincided with the SSTV
transmission scheduled for 20.05.2024 13:52:00 UTC.
I made two simultaneous recordings of the signal.
The first setup consisted of a V-dipole antenna built from the RTL-SDR blog
dipole antenna kit connected to an RTL-SDR and my phone running SDR++ and the
second setup used a QFH antenna built for NOAA-APT signals connected to an AirSpy
mini and my laptop.

<a class="image-left" href="{{ "assets/2024-05-sonate-2-sstv/v_dipole_antenna.jpg" | absolute_url }}">
<img src="{{ "assets/2024-05-sonate-2-sstv/v_dipole_antenna.jpg" | absolute_url }}" alt="V-dipole antenna" />
</a>
<a class="image-right" href="{{ "assets/2024-05-sonate-2-sstv/qfh_antenna.jpg" | absolute_url }}">
  <img src="{{ "assets/2024-05-sonate-2-sstv/qfh_antenna.jpg" | absolute_url }}" alt="QFH antenna" />
</a>

Both setups used narrowband FM centered at 145.88 MHz with a bandwidth of
12.5 kHz.
While the signal was clearly visible in the waterfall, the images resulting from
both recordings were suboptimal.
The image created from the recording made with the V-dipole antenna is rather
noisy.
Furthermore, QSSTV messed up the synchronization for the recording taken with
the QFH antenna, resulting in a distorted image.

<figure class="image-left">
  <a href="{{ "assets/2024-05-sonate-2-sstv/2024-05-20_13-52-00_sonate-2_sstv_dipole.png" | absolute_url }}">
    <img src="{{ "assets/2024-05-sonate-2-sstv/2024-05-20_13-52-00_sonate-2_sstv_dipole.png" | absolute_url }}" alt="" />
  </a>
  <figcaption>Noisy image received with the V-dipole antenna</figcaption>
</figure>
<figure class="image-right">
  <a href="{{ "assets/2024-05-sonate-2-sstv/2024-05-20_13-52-00_sonate-2_sstv_qfh.png" | absolute_url }}">
    <img src="{{ "assets/2024-05-sonate-2-sstv/2024-05-20_13-52-00_sonate-2_sstv_qfh.png" | absolute_url }}" alt="" />
  </a>
  <figcaption>Distorted image received with the QFH antenna</figcaption>
</figure>

After a bit of fiddling in Audacity - which was mostly trial and error - I was
able to align both recordings and combine them into a single sound file using
the better parts of each.

[![Combining both recordings in Audacity][audacity_combined_audio]][audacity_combined_audio]

Finally, the resulting image is considerably less noisy.
The beginning of the transmission is still missing, but in the top left corner
a yellow box with the satellite's call sign, DP0SNX, is faintly visible.

<figure>
  <a href="{{ "assets/2024-05-sonate-2-sstv/2024-05-20_13-52-00_sonate-2_sstv.png" | absolute_url }}">
    <img src="{{ "assets/2024-05-sonate-2-sstv/2024-05-20_13-52-00_sonate-2_sstv.png" | absolute_url }}" alt="" />
  </a>
  <figcaption>Result of the combined recordings</figcaption>
</figure>

The image was captured by the satellite's wide-angle color camera and shows the
Strait of Gibraltar.
This was not a live image.
Instead, it appears to be the
[first high-resolution image captured by the satellite][twitter_first_high_res_image]
several weeks before.

  [audacity_combined_audio]: {{ "assets/2024-05-sonate-2-sstv/audacity_combined_audio.jpg" | absolute_url }}
  [sonate_2_informations_for_radio_amateurs]: https://www.informatik.uni-wuerzburg.de/aerospaceinfo/mitarbeiter/kayal/forschungsprojekte/sonate-2/information-for-radio-amateurs/
  [twitter_first_high_res_image]: https://archive.is/jtNzK
