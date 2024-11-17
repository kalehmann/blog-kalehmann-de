---
categories:       blog
date:             2024-11-17 13:40:00 +0100
description:  >-
  Designing and building a four element tape measure Yagi-Uda antenna for the
  2-meter band.
lang:             en
last_modified_at: 2024-11-17 13:40:00 +0100
layout:           post
tags:
  - Radio
title: >-
  4 element Yagi-Uda antenna for the 2-meter band
---

The [previous post]({% post_url 2024-10-14-ariss-sstv-series-21 %})
describes my adventures in receiving SSTV images from the International Space
Station.
A few days ago [another SSTV event was announced][announcement], so I need to
hurry up and build a better antenna.
The tape-measure Yagi that I built last time worked more or less well, but was
not very portable.
So I want to build an antenna, that is more portable and robust.

Due to the fact, that satellites and space stations transmit at low power and
are high up in the sky, it should again be a directional antenna in order to
achieve a high gain.
So the Yagi-Uda design remains.

There are many different calculators for Yagi-Uda antennas on the internet, but
they all give different results without much explanation.
However computer aided antenna modeling has been around for 50 years now.
The generic term [NEC][nec_wikipedia] covers a range of computer programs,
that can numerical simulate the electromagnetic field around an antenna.
Unfortunately modeling an antenna in them is very cumbersome.
The tooling is still based the punched card stack input of the original software.
Hence, I have written small JavaScript program to generate the NEC files for my
Yagi-Uda antenna.

This script can be tried out with the subsequent form.

<noscript>
  <p>The following antenna designer requires JavaScript the be used.</p>
</noscript>

<form id="four_element_yagi_form">
  <label>
    Reflector length (cm)
    <input id="reflector_length" type="number" min="0" value="103" />
  </label>
  <label>
    Driven element offset (cm)
    <input id="driven_element_offset" type="number" min="0" value="29" />
  </label>
  <label>
    Driven element length (cm)
    <input id="driven_element_length" type="number" min="0" value="94" />
  </label>
  <label>
    1st director offset (cm)
    <input id="director_1_offset" type="number" min="0" value="61" />
  </label>
  <label>
    1st director length (cm)
    <input id="director_1_length" type="number" min="0" value="90" />
  </label>
  <label>
    2nd director offset (cm)
    <input id="director_2_offset" type="number" min="0" value="99" />
  </label>
  <label>
    2nd director length (cm)
    <input id="director_2_length" type="number" min="0" value="89" />
  </label>

  <input id="download_button" type="Button" value="Download NEC file" />
  <input id="reset_button" type="reset" value="Reset" />
</form>

{% include_relative embedded/four_element_yagi/yagi.svg %}

I played with the script for a whole day and found a set of parameters,
that have a promising radiation pattern and give an acceptable calculated SWR in
[Xnec2c][xnec2c].
They are set as default values in the form above.

[![][radiation_pattern]][radiation_pattern]{:class="image-left"}
[![][calculated_swr]][calculated_swr]{:class="image-right"}

So I decided on this design and build the antenna.
Almost all the parts came from the local hardware store.
The boom of the antenna consists of a 20x20 mm aluminum profile and plastic
connectors at each element.
In addition, the elements themselves are made out of standard tape measure with a
metal core.

[![][antenna_parts]][antenna_parts]

After cutting the parts and assembling the antenna, its SWR was measured with a
NanoVNA.
Sadly, the resonance frequency of the antenna was slightly above the 2-meter band
at 147 MHz.

[![][swr_without_beta_match]][swr_without_beta_match]{:class="image-left"}
[![][driven_element]][driven_element]{:class="image-right"}

I adjusted the antenna by adding a beta match between the two connectors of the
driven element.
After experimenting a bit with the length, I got a nice SWR below 1.20 over the
whole 2-meter band and the antenna resonates at 145 MHz.
Still, I recognize that good SWR is not synonymous with good antenna performance,
but it is nevertheless a decent indicator.

[![][beta_match]][beta_match]{:class="image-left"}
[![][swr_with_beta_match]][swr_with_beta_match]{:class="image-right"}

Since this antenna is highly directional, it must always be pointed at the source
of the transmission.
For this reason, I have added a smartphone mount to its boom, as there are many
Apps for phones that help tracking satellite or space stations.

[![][assembled_antenna]][assembled_antenna]

With the boom not being continuous, but separated into several parts that are
held together by the plastic connectors, the antenna can be disassembled into
multiple parts.
And as an additional feature, the individual parts fit easily into a backpack.

[![][disassembled_antenna]][disassembled_antenna]

As final rehearsal, I tested the antenna with a transmission from the Cubesat
Sonate-2.
This satellite, launched by the Julius Maximilian University of Würzburg, will
be [actively transmitting SSTV][sonate_2_sstv] from October 15, 2024 to October
18, 2024.
Since its transmission power of 500 mW is rather low, it is well suited as a test
object for the reception performance of the antenna.

[![][yagi_antenna_satellite]][yagi_antenna_satellite]

In the end, the antenna performed really well.
With my smartphone mounted on the boom running [Look4Sat][look4sat] and
[SDR++][sdr++], the satellite could be tracked with ease and I received a strong
signal.
(The following video is 2x accelerated)

<video controls loop>
  <source src="{{ "assets/2024-11-yagi-antenna/recording.webm" | absolute_url }}" type="video/webm">
  Your browser does not support the video tag.
</video>

The resulting images are significantly better than my
[previous attempts]({% post_url 2024-05-21-sonate-2-sstv %})
to receive transmissions from Sonate-2 with either a V-dipole or a QFH-antenna.
The callsign DP0SNX is clearly recognizable and there are almost no visual
artifacts in the resulting images:

[![][sonate_2_image_1]][sonate_2_image_1]{:class="image-left"}
[![][sonate_2_image_2]][sonate_2_image_2]{:class="image-right"}

<script src="{{ "assets/2024-11-yagi-antenna/yagi_designer.js" | absolute_url }}"></script>

  [announcement]: https://old.reddit.com/r/amateursatellites/comments/1gl81mo/here_comes_another_sstv_event_ariss_will_conduct/
  [antenna_parts]: {{ "assets/2024-11-yagi-antenna/antenna_parts.avif" | absolute_url }}
  [assembled_antenna]: {{ "assets/2024-11-yagi-antenna/assembled_antenna.avif" | absolute_url }}
  [beta_match]: {{ "assets/2024-11-yagi-antenna/beta_match.avif" | absolute_url }}
  [calculated_swr]: {{ "assets/2024-11-yagi-antenna/calculated_swr.avif" | absolute_url }}
  [disassembled_antenna]: {{ "assets/2024-11-yagi-antenna/disassembled_antenna.avif" | absolute_url }}
  [driven_element]: {{ "assets/2024-11-yagi-antenna/driven_element.avif" | absolute_url }}
  [look4sat]: https://github.com/rt-bishop/Look4Sat
  [nec_wikipedia]: https://en.wikipedia.org/wiki/Numerical_Electromagnetics_Code
  [radiation_pattern]: {{ "assets/2024-11-yagi-antenna/radiation_pattern.avif" | absolute_url }}
  [sdr++]: https://github.com/AlexandreRouma/SDRPlusPlus/releases
  [sonate_2_sstv]: https://www.informatik.uni-wuerzburg.de/en/space-technology/projects/active/sonate-2/information-for-radio-amateurs/
  [sonate_2_image_1]: {{ "assets/2024-11-yagi-antenna/sonate2_image_1.avif" | absolute_url }}
  [sonate_2_image_2]: {{ "assets/2024-11-yagi-antenna/sonate2_image_2.avif" | absolute_url }}
  [swr_with_beta_match]: {{ "assets/2024-11-yagi-antenna/swr_with_beta_match.avif" | absolute_url }}
  [swr_without_beta_match]: {{ "assets/2024-11-yagi-antenna/swr_without_beta_match.avif" | absolute_url }}
  [yagi_antenna_satellite]: {{ "assets/2024-11-yagi-antenna/yagi_antenna_satellite.avif" | absolute_url }}
  [xnec2c]: https://www.xnec2c.org/
