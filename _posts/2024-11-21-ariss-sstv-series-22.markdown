---
categories:       blog
date:             2024-11-22 13:10:00 +0100
description:  >-
  Receiving a SSTV transmissions from the International Space Station in
  celebration of 40 years of amateur radio in human spaceflight
lang:             en
last_modified_at: 2024-11-22 13:20:00 +0100
layout:           post
tags:
  - Radio
title: >-
  ARISS SSTV 40th anniversary
---

Two weeks ago, another [ARISS SSTV event was announced][announcement] to
celebrate 40 years of amateur radio in human spaceflight.
Since I already received good pictures and had a lot of fun at the
[last ARISS SSTV event][sstv_post], I definitely wanted to participate in this
event again.
I advance to the event, last week I already built
[a new Yagi-Uda antenna][yagi_post] with excellent reception performance in the
2-meter band.

Again, 12 images were transmitted over the course of a week.
The ISS made several passes over my location that week and almost all of these
passes took place in the evening.
This fit in well with my schedule.
The pictures show the work and achievements of Owen Garriott, an astronaut and
radio amateur who operated the first amateur radio station in space during the
STS-9 mission under his callsign W5LFL.

With the new antenna, last week was a great success.
Thanks to the ability to attach my phone directly to the boom of the antenna and
track and record simultaneously with my smartphone meant, I only had to carry a
small amount of equipment and was able to set up my rig quickly.
As you can see in the video below, I received a strong signal even though the ISS
was only just above the horizon.
The transmission shown in the video is [picture 7/12](#picture-7) which became
a little blurry at the end due to the ISS passing beyond the horizon.

<video controls loop>
  <source src="{{ "assets/2024-11-ariss-sstv/recording.webm" | absolute_url }}" type="video/webm">
  Your browser does not support the video tag.
</video>

Unfortunately, I was having trouble tracking the signal on my phone due to the
Doppler shift.
Since SDR records at a fixed frequency while the actual frequency of the
transmission changes because of the Doppler shift, there was a DC offset in the
recorded audio file.

[![][dc_offset]][dc_offset]

This sometimes prevented [QSSTV][qsstv] from decoding the image from the recorded
audio file and I had to correct the DC offset manually in Audacity.
While this worked fine for a constant DC offset - e.g. for a recording while the
ISS was on the horizon moving towards or away from my position at an almost
constant speed - it was a pain for a recording of a pass over my head, where the
DC offset is not constant, but changing as in the picture above.

Nevertheless, I achieved good results:

<div class="gallery">
  <div class="preview">
    {% for picture in site.data.2024_11_ariss_sstv.transmissions.pictures %}
      {%- assign basename = picture.timestamp | date: "%Y-%m-%dUTC%H%M%S-0" | append: forloop.index  -%}
      {%- assign audio = basename | append: ".ogg" -%}
      {%- assign image = basename | append: ".avif" -%}
      <div id="picture-{{ forloop.index }}">
        <img alt="{{ picture.description }}" src="{{ "assets/2024-11-ariss-sstv/" | append: image | absolute_url }}" />
        <audio controls="" preload="none">
          <source src="{{ "assets/2024-11-ariss-sstv/" | append: audio | absolute_url }}" type="audio/ogg">
        </audio>
        <table>
          <thead>
            <tr>
              <th>Picture</th>
              <th>Antenna</th>
              <th>Start of recording</th>
              <th>QTH</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ forloop.index }} / 12</td>
              <td>{{ picture.antenna }}</td>
              <td>{{ picture.timestamp | date: "%Y-%m-%d %H:%M:%S UTC" }}</td>
              <td>{{ picture.qth }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    {% endfor %}
  </div>
  <ul class="thumbnails">
    {% for picture in site.data.2024_11_ariss_sstv.transmissions.pictures %}
      {%- assign basename = picture.timestamp | date: "%Y-%m-%dUTC%H%M%S-0" | append: forloop.index  -%}
      {%- assign audio = basename | append: ".ogg" -%}
      {%- assign image = basename | append: ".avif" -%}
      <li>
        <a href="#picture-{{ forloop.index }}">
          <img alt="{{ picture.description }}" src="{{ "assets/2024-11-ariss-sstv/" | append: image | absolute_url }}" />
        </a>
      </li>
    {% endfor %}
  </ul>
</div>

  [announcement]: https://old.reddit.com/r/amateursatellites/comments/1gl81mo/here_comes_another_sstv_event_ariss_will_conduct/
  [dc_offset]: {{ "assets/2024-11-ariss-sstv/dc_offset.avif" | absolute_url }}
  [picture_01]: {{ "assets/2024-11-ariss-sstv/2024-11-15UTC212410-01.avif" | absolute_url }}
  [picture_02]: {{ "assets/2024-11-ariss-sstv/2024-11-15UTC212819-02.avif" | absolute_url }}
  [picture_03]: {{ "assets/2024-11-ariss-sstv/2024-11-15UTC181258-03.avif" | absolute_url }}
  [picture_04]: {{ "assets/2024-11-ariss-sstv/2024-11-13UTC200940-04.avif" | absolute_url }}
  [picture_05]: {{ "assets/2024-11-ariss-sstv/2024-11-16UTC203548-05.avif" | absolute_url }}
  [picture_06]: {{ "assets/2024-11-ariss-sstv/2024-11-16UTC190011-06.avif" | absolute_url }}
  [picture_07]: {{ "assets/2024-11-ariss-sstv/2024-11-16UTC190420-07.avif" | absolute_url }}
  [qsstv]: https://github.com/ON4QZ/QSSTV
  [sstv_post]: {% post_url 2024-10-14-ariss-sstv-series-21 %}
  [yagi_post]: {% post_url 2024-11-17-4-element-yagi-uda-antenna %}
