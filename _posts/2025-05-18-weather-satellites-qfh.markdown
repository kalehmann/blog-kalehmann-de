---
categories:       blog
date:             2025-05-18 10:05:00 +0200
description:  >-
  Calculation and assembly of a QFH antenna for receiving images from weather
  satellites, as well as a detailed explanation how to setup SDR++ and SatDump
  to receive and decode images from NOAA-15, NOAA-18, NOAA-19 and Meteor-M N2-4.
lang:             en
last_modified_at: 2025-05-18 10:05:00 +0200
layout:           post
tags:
  - Make
  - Radio
title: >-
  Building a QFH antenna for weather satellites
---

Did you know, that you can set up an antenna in your backyard and receive live
satellite footage of the Earth?
And I am not talking about satellite television.
This is awesome!

The National Oceanic and Atmospheric Administration (NOAA) of the United States
owns or operates multiple satellites for various applications.
Some of these satellites transmit data to Earth that can be received by ordinary
people without any highly specialized equipment.
Of these, the easiest to receive are the three Polar-orbiting Operational
Environmental Satellites - short POES - NOAA-15, NOAA-18 and NOAA-19.
They each complete an orbit approximately every 102 minutes and transmit, among
other things, low-resolution image signals, which can be easily received.

## Understanding the signal

The three satellites from the NOAA POES constellation use the Automatic Picture
Transmission system (APT), which includes two image channels, a synchronization
signal and telemetry data.
Notably the system does not send full images, instead it transmits data line by
line.
These lines have a fixed width of 2080 pixels with 909 pixels for each image
channel at 4 kilometers per pixel.
In short, that means the longer you receive the signal from the satellite that
passes over you, the more vertical lines the resulting image will have.
If you could follow the satellite, you would receive a continuous image of our
Earth like a the skin of a peeled apple.
Unfortunately, the satellites' velocity of around 7.5 km/s poses a grave
obstacle to actually following them on the ground.

The signal itself is right-hand circularly polarized, because in contrast to
linear polarization you don't have to worry about the relative orientation
of the sender and transmitter - getting directions in space is still a problem
and the signal may rotate due to the [Faraday effect][faraday_effect].
Furthermore with a circularly polarized antenna, there is no need to worry about
reflections as left-hand polarized signals become right-hand polarized when
reflected and vice versa.

## Calculation and assembly of the antenna

Although a right-hand circularly polarized antenna is the best choice for
receiving the NOAA APT signal, building one is not so easy.
There is a [nice post on the RTL-SDR blog][v_dipole_antenna] describing how to
build a V-dipole antenna to receive NOAA APT transmissions.
With the multipurpose dipole antenna kit that can be ordered with the RTL-SDR,
it is quite easy and cheap to build that V-dipole antenna.

In any case, let's take it a step further and take a look at an actual
right-hand circularly polarized antenna: the quadrafilar helix antenna, also
known as the QFH antenna.

<div>
  <img
    alt="A QFH antenna with two half turn loops and a cylinder draw around it"
    class="float-left float-small"
    src="{{ "assets/2025-05-weather-satellites/qfh_cylinder.avif" | absolute_url }}"
  />
  <div>
    <p>
      It consists of two loops, one smaller and one larger.
      They are offset from each other by 90 degrees and rotated by half a turn
      around the vertical axis of the antenna.
    </p>
    <p>
      Given the length <math><mi>l</mi></math> of each loop, how can the
      diameter calculate and helix length of the antenna be calculated?
    </p>
    <p>
      First, there is one problem: The corners are probably going to be rounded,
      but it's much easier to calculate with straight corners.
      Correcting that is simple.
      The length of a loop with the same height and diameter, but straight
      corners is
      <math>
        <msub>
          <mi>l</mi>
          <mtext>adj</mtext>
        </msub>
        <mo>=</mo>
        <mi>l</mi>
        <mo>-</mo>
        <mfrac>
          <mrow>
            <mi>π</mi>
            <mo>⋅</mo>
            <msub>
              <mi>r</mi>
              <mi>b</mi>
            </msub>
          </mrow> 
          <mn>2</mn>
        </mfrac>
        <mo>+</mo>
        <mn>8</mn>
        <mo>⋅</mo>
        <msub>
          <mi>r</mi>
          <mi>b</mi>
        </msub>
      </math> depending on the bending radius
      <math><msub><mn>r</mn><mn>b</mn></msub></math>.
    </p>
    <p>
      The diameter-to-height ratio of the cylinder is chosen to be 0.44 as
      <a href="http://www.kunstmanen.net/WKfiles/Techdocs/RQHA/RQHA1999-1eng.pdf">described in</a>
      in <a href=" https://www.jcoppens.com/ant/qfh/index.en.php">different publications</a> online.
      However, decreasing the ratio may result in a better coverage at the
      horizon.
      Given the total length of each loop and the diameter-to-height ratio,
      all other relevant dimensions can be calculated.
    </p>
  </div>
</div>

<div>
  <div class="float-right float-small">
    {% include_relative embedded/2025_05_weather_satellites/cylinder.svg %}
  </div>
  <div>
    <p>
      Finally with the corrected loop length and some basic math, the diameter,
      height and helix length can be calculated.
      Imagine a cylinder around the smaller and the larger loops of the antenna.
      The horizontal elements correspond to the  cylinder's diameters, while the
      vertical elements are curved around the its surface.
    </p>
    <p>
      Let the diameter-to-height ratio be
      <math>
        <mi>ω</mi>
        <mo>=</mo>
        <mn>0.44</mn>
      </math>.
      Then
      <math displaystyle="true">
        <mi>α</mi>
        <mo>=</mo>
        <msup>
          <mtext>tan</mtext>
          <mn>-1</mn>
        </msup>
        <mtext>(</mtext>
        <mfrac>
          <mrow>
            <mi>ω</mi>
            <mo>⋅</mo>
            <mi>π</mi>
          </mrow>
          <mn>2</mn>
        </mfrac>
        <mtext>)</mtext>
      </math>
      and
      <math displaystyle="true">
        <mfrac>
          <mi>⌀</mi>
          <mi>s</mi>
        </mfrac>
        <mo>=</mo>
        <mtext>cos(</mtext>
        <mi>α</mi>
        <mtext>)</mtext>
        <mo>⋅</mo>
        <mi>ω</mi>
      </math>.
      With
      <math displaystyle="true">
        <msub>
          <mi>l</mi>
          <mtext>adj</mtext>
        </msub>
        <mo>=</mo>
        <mn>2</mn>
        <mo>⋅</mo>
        <mtext>(</mtext>
        <mi>⌀</mi>
        <mo>+</mo>
        <mi>s</mi>
        <mtext>)</mtext>
      </math>, it follows that
      <math displaystyle="true">
        <mi>s</mi>
        <mo>=</mo>
        <mfrac>
          <msub>
            <mi>l</mi>
            <mtext>adj</mtext>
          </msub>
          <mrow>
            <mn>2</mn>
            <mo>+</mo>
            <mn>2</mn>
            <mo>⋅</mo>
            <mtext>cos(</mtext>
            <mi>α</mi>
            <mtext>)</mtext>
            <mo>⋅</mo>
            <mi>ω</mi>
          </mrow>
        </mfrac>
      </math>
      and
      <math displaystyle="true">
        <mi>⌀</mi>
        <mo>=</mo>
        <mfrac>
          <msub>
            <mi>l</mi>
            <mtext>adj</mtext>
          </msub>
          <mn>2</mn>
        </mfrac>
        <mo>-</mo>
        <mi>s</mi>
      </math>
      as well as
      <math displaystyle="true">
        <mi>h</mi>
        <mo>=</mo>
        <mfrac>
          <mi>⌀</mi>
          <mi>ω</mi>
        </mfrac>
      </math>.
    </p>
  </div>
</div>

<p>
  Then how long should these loops be now?
  All three NOAA-POES satellites transmit at different frequencies around
  137.5 MHz.
  The wavelength in free space is calculated as follows:
  <math displaystyle="true">
    <mi>λ</mi>
    <mo>=</mo>
    <mfrac>
      <mi>c</mi>
      <mi>f</mi>
    </mfrac>
  </math>
  where <math><mi>c</mi></math> is the speed of light and
  <math><mi>f</mi></math> is the frequency.
</p>

<p>
  There is an elongation factor
  <math><msub><mi>Δ</mi><mi>l</mi></msub></math>
  for QFH antennas, which provides the length of the larger loop, as well as a
  deviation factor
  <math><msub><mi>Δ</mi><mi>f</mi></msub></math>
  which is determined by experiment depending on the conductor's diameter and
  gives the length of the smaller loop.
</p>

| Diameter in mm | <math><msub><mi>Δ</mi><mi>l</mi></msub></math> by R.W. Hollander | <math><msub><mi>Δ</mi><mi>l</mi></msub></math> by Coppens | <math><msub><mi>Δ</mi><mi>f</mi></msub></math> by R.W. Hollander | <math><msub><mi>Δ</mi><mi>f</mi></msub></math> by Coppens |
|----------------|------------------------------------------------------------------|-----------------------------------------------------------|------------------------------------------------------------------|-----------------------------------------------------------|
| 4              | 4.6%                                                             | 6.8%                                                      | 1.3%                                                             | 1.7%                                                      |
| 8              | 6.7%                                                             | 7.1%                                                      | 2.8%                                                             | 2.5%                                                      |
| 12             | 7.2%                                                             | 7%                                                        | 2.5%                                                             | 3.6%                                                      |
| 15             | 7%                                                               | 6.8%                                                      | 3.3%                                                             | 4.9%                                                      |

<noscript>
  <strong>The following section is interactive with JavaScript enabled.</strong>
</noscript>
<form id="qfh_form" style="display: none;">
  <label>
    Conductor diameter
    <select id="conductor_diameter">
      <option value="4">4 mm</option>
      <option value="8">8 mm</option>
      <option value="12" selected>12 mm</option>
      <option value="15">15 mm</option>
    </select>
  </label>
  <label>
    Deviation and elongation factors
    <select id="source">
      <option value="coppens">Coppens</option>
      <option value="hollander">R.W. Hollander</option>
    </select>
  </label>
  <label>
    Width to height ratio
    <input id="width_to_height_ratio" type="number" min="0.01" value="0.44" />
  </label>
  <label>
    Frequency (MHz)
    <input id="frequency" type="number" min="0" value="137.5" />
  </label>
  <label>
    Bending radius (mm)
    <input id="bending_radius" type="number" min="0" value="32" />
  </label>
</form>

<p>
  Now the wavelength is
  <math>
    <msub>
      <mi>λ</mi>
      <mgroup>
        <mn id="freq">137.5</mn>
        <mi>MHz</mi>
      </mgroup>
    </msub>
    <mo>=</mo>
    <mn id="wavelength">2182</mn>
    <mtext>mm</mtext>
  </math>
  and the two loops have the following properties
</p>

<table>
  <thead>
    <tr>
      <th></th>
      <th>Small loop</th>
      <th>Large loop</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Length</td>
      <td>
        <math>
          <msub>
            <mi>l</mi>
            <mtext>small</mtext>
          </msub>
          <mo>=</mo>
          <mn id="small_length">2103</mn>
          <mtext>mm</mtext>
        </math>
      </td>
      <td>
        <math>
          <msub>
            <mi>l</mi>
            <mtext>large</mtext>
          </msub>
          <mo>=</mo>
          <mn id="large_length">2335</mn>
          <mtext>mm</mtext>
        </math>
      </td>
    </tr>
    <tr>
      <td>Length (adjusted for bending)</td>
      <td>
        <math>
          <msub>
            <mi>l</mi>
            <mtext>small (adjusted)</mtext>
          </msub>
          <mo>=</mo>
          <mn id="small_length_adjusted">2158</mn>
          <mtext>mm</mtext>
        </math>
      </td>
      <td>
        <math>
          <msub>
            <mi>l</mi>
            <mtext>large (adjusted)</mtext>
          </msub>
          <mo>=</mo>
          <mn id="large_length_adjusted">2389</mn>
          <mtext>mm</mtext>
        </math>
      </td>
    </tr>
    <tr>
      <td>Diameter (without bending)</td>
      <td>
        <math>
          <msub>
            <mi>⌀</mi>
            <mtext>small</mtext>
          </msub>
          <mo>=</mo>
          <mn id="small_diameter_wo_bending">287</mn>
          <mtext>mm</mtext>
        </math>
      </td>
      <td>
        <math>
          <msub>
            <mi>⌀</mi>
            <mtext>large</mtext>
          </msub>
          <mo>=</mo>
          <mn id="large_diameter_wo_bending">318</mn>
          <mtext>mm</mtext>
        </math>
      </td>
    </tr>
    <tr>
      <td>Diameter (with bending)</td>
      <td>
        <math>
          <msub>
            <mi>⌀</mi>
            <mtext>small (adjusted)</mtext>
          </msub>
          <mo>=</mo>
          <mn id="small_diameter_with_bending">223</mn>
          <mtext>mm</mtext>
        </math>
      </td>
      <td>
        <math>
          <msub>
            <mi>⌀</mi>
            <mtext>large (adjusted)</mtext>
          </msub>
          <mo>=</mo>
          <mn id="large_diameter_with_bending">254</mn>
          <mtext>mm</mtext>
        </math>
      </td>
    </tr>
    <tr>
      <td>Height</td>
      <td>
        <math>
          <msub>
            <mi>h</mi>
            <mtext>small</mtext>
          </msub>
          <mo>=</mo>
          <mn id="small_height">652</mn>
          <mtext>mm</mtext>
        </math>
      </td>
      <td>
        <math>
          <msub>
            <mi>h</mi>
            <mtext>large</mtext>
          </msub>
          <mo>=</mo>
          <mn id="large_height">722</mn>
          <mtext>mm</mtext>
        </math>
      </td>
    </tr>
    <tr>
      <td>Helix length (without bending)</td>
      <td>
        <math>
          <msub>
            <mi>s</mi>
            <mtext>small</mtext>
          </msub>
          <mo>=</mo>
          <mn id="small_helix_wo_bending">792</mn>
          <mtext>mm</mtext>
        </math>
      </td>
      <td>
        <math>
          <msub>
            <mi>s</mi>
            <mtext>large</mtext>
          </msub>
          <mo>=</mo>
          <mn id="large_helix_wo_bending">877</mn>
          <mtext>mm</mtext>
        </math>
      </td>
    </tr>
    <tr>
      <td>Helix length (with bending)</td>
      <td>
        <math>
          <msub>
            <mi>s</mi>
            <mtext>small (adjusted)</mtext>
          </msub>
          <mo>=</mo>
          <mn id="small_helix_with_bending">728</mn>
          <mtext>mm</mtext>
        </math>
      </td>
      <td>
        <math>
          <msub>
            <mi>s</mi>
            <mtext>large (adjusted)</mtext>
          </msub>
          <mo>=</mo>
          <mn id="large_helix_with_bending">813</mn>
          <mtext>mm</mtext>
        </math>
      </td>
    </tr>
  </tbody>
</table>

With all the necessary values ready, the antenna can finally be assembled.
Copper tubing with a 12 mm diameter and a 40 mm diameter PVC pipe for the boom
were purchased from the local hardware store for that purpose.
The bending radius was determined to be 32 mm because those were the only
right-angle joints available.

[![A 90 degree joint for 12mm copper tubing][bending]][bending]{:.image-left}
[![12 mm copper tubing cut into multiple elements for the antenna][elements]][elements]{:.image-right}

First, all of the elements were cut to the correct length.
Next, holes were drilled into the PVC pipe, through which the copper elements
were assembled.
The elements are continuous at the bottom of the antenna, while they are
electrically separated by a non-conducting piece of plastic at the top.

[![Drilling a hole in a PVC pipe wrapped in paper to mark the position][drilling]][drilling]{:.image-left}
[![Assembly of copper tubing through the PVC pipe][assembly]][assembly]{:.image-right}

The wiring is straightforward.
A piece of coaxial cable with a connector of your choice enters the boom near
the top of the antenna.
First, connect the center conductor and the shielding of the coaxial cable to
each of the longer loops.
Then, wire them in a clockwise direction to one of the
shorter loops:

{% include_relative embedded/2025_05_weather_satellites/qfh_wiring.svg %}


## Setup a PC for receive operation

Finally, it's time to set up the antenna and receive some birds.

[![A QFH antenna outdoors on a tripod][qfh_setup]][qfh_setup]

SDR++ will be used to record the satellite's audio signal.
But why focus on only one satellite when multiple satellites can be received at
once?
SDR++ is capable of operating multiple VFOs (variable frequency oscillators)
simultaneously, enabling it to record two or three NOAA satellites that are
passing by at the same time.

For ease of use, the appropriate frequencies for the satellites should be entered
into the frequency manager first.
The transmissions themselves have a bandwidth of 34 kHz.
However due to the satellites moving quite fast and the Doppler effect, the
center frequency varies during a pass.
Setting a broader bandwidth of 45 kHz eliminates the need to manually adjust
each VFO to track the satellite.

Next, in the module manager, two radios need to be configured to have two
independent VFOs.
Additionally, each radio also needs its own recorder.

[![Frequency manager of SDR++ with the frequencies and bandwiths of the three NOAA satellites][sdrpp_frequencies]][sdrpp_frequencies]{:.image-left}
[![Adding a new radio module in the module manager of SDR++][sdrpp_radio_recorder_modules]][sdrpp_radio_recorder_modules]{:.image-right}

After that, enable the additional noise reduction filter for NOAA APT in each radio module.
And don't forget to set the stream to the appropriate radio for each recorder.

[![Configuring a radio for NOAA-18 with noise reduction in SDR++][sdrpp_radio_setup]][sdrpp_radio_setup]{:.image-left}
[![Setting up a recorder for the new radio module in SDR++][sdrpp_recorder_setup]][sdrpp_recorder_setup]{:.image-right}

Finally, set up the source module.
It is advised that you enable decimation, which antialiases and downsamples the
data from the SDR thus decreasing the available bandwidth.
However, this should improve the signal-to-noise ratio (SNR) by about 3 dB for
each doubling of the decimation.
With a sampling rate of <math displaystyle>
    <mn>2.048</mn>
    <mfrac>
      <mtext>MS</mtext>
      <mtext>s</mtext>
    </mfrac>
</math>
and a decimation of 2, there is still enough bandwidth left to receive all
three NOAA satellites simultaneously.

[![SDR++ with an RTL-SDR as source receiving NOAA-18 and NOAA-19 simultanuously][sdrpp_source_setup]][sdrpp_source_setup]

Now each of the three NOAA satellites carries an advanced very-high-resolution
radiometer (AVHRR/3), which scans the Earth in [six channels][avhrr_description].
The data transmitted via the APT system contains two of these channels, typically
one of the infrared spectrum between 10.3 and 11.3 micrometers and one from either
near-visible infrared between 0.725 and 1 micrometers or mid-wave infrared between
3.55 - 3.93 micrometers, depending whether it's daytime or nighttime.

[![Two black and white raw images of central europe from NOAA-19 with telemetry lines next to them][noaa19_raw]][noaa19_raw]

The vertical bars next to each image contain synchronization and telemetry
information.
Now each channel is only grayscale, but two channels can be combined to create
enhanced composite images.
A description of these enhancements can be found in the
[WXtoIMG manual][wxtoimg_manual].

See the two images below for examples.
The first images shows cold cloud top temperatures indicating heavy rainfall
in the first image (clouptop enhancement), and the second image shows greatly
increased IR contrast with cloud coloring (NO enhancement).
 
[![Black and white image of central Europe with cloud tops highligthed in color][noaa19_cloudtop]][noaa19_cloudtop]{:.image-left}
[![Grayscale image of central Europe with multiple color enhancements][noaa19_no]][noaa19_no]{:.image-right}

The process of decoding and projecting multiple transmissions together in
SatDump is a bit more complicated and comprises some more steps.
All of these steps are all documented in the following video:

<video controls>
  <source src="{{ "assets/2025-05-weather-satellites/satdump_noaa_composite.webm" | absolute_url }}" type="video/webm">
  Your browser does not support the video tag.
</video>

And voilà!
Here is the result.
It's still a bit blurry at the top and bottom since it's an analog transmission.

[![False color composite image of central europe with blury lines at the bottom and top][noaa_1819_composite_msa]][noaa_1819_composite_msa]

## Side note to Meteor-M N2-4

Aside from the 3 NOAA satellites, there is also a Russian weather satellite
Meteor-M N2-4 transmitting around 137 MHz.
Instead of the analog APT, it uses digital low rate picture transmission (LRPT)
with quadrature phase shift keying modulation,  so recording an audio file to
decode it later won't work here.
Instead directly record the baseband in SatDump.
Go to the **Recording** tab, select **Meteor M2-x LRPT 72k**, choose the primary
frequency for 137.9 MHz click **Start** and when the signal can be seen in the
waterfall or the demodulator in the bottom shows four green dots, start the
recording.

[![Receiving and recording Meteor-M N2-4 in SatDump with a signal clearly visible in the waterfall][satdump_meteor_m2_4_recording]][satdump_meteor_m2_4_recording]

Later in the **Offline Processing** tab, select **Meteor M2-x LRPT 72k** again
and open the previously created recording.
The **Input level**, **Baseband Format** and **Samplerate** fields will then
be filled in automatically with the appropriate values.
Finally select an **Output Directory** and start decoding the signal.

[![Decoding Meteor-M N2-4 in SatDump][satdump_meteor_m2_4_decoding]][satdump_meteor_m2_4_decoding]

The resulting image (MSA enhancement) is quite nice - with no noise, unlike the
images from the NOAA satellites:

[![Noiseless color-image of central Europe][meteor_m2_4_image]][meteor_m2_4_image]

  
## End of service for NOAA satellites

Unfortunately in April 2025, NOAA [announced the end of service][end_of_service]
for June 16, 2025 for the three satellites from the POES constellation.
In practice however, this should no be as tragic as it sounds.
The satellites will not be suddenly turned off, but no efforts will be taken to
resolve any issues.
So hopefully, they will continue transmitting for many more years.

<script src="{{ "assets/2025-05-weather-satellites/calculator.js" | absolute_url }}"></script>

  [avhrr_description]: https://web.archive.org/web/20170214103708/https://www.ncdc.noaa.gov/oa/pod-guide/ncdc/docs/klm/html/c1/sec12-2.htm
  [assembly]: {{ "assets/2025-05-weather-satellites/assembly.avif" | absolute_url }}
  [bending]: {{ "assets/2025-05-weather-satellites/bended_element.avif" | absolute_url }}
  [drilling]: {{ "assets/2025-05-weather-satellites/drilling.avif" | absolute_url }}
  [elements]: {{ "assets/2025-05-weather-satellites/elements.avif" | absolute_url }}
  [end_of_service]: https://www.ospo.noaa.gov/data/messages/2025/04/MSG_20250425_1905.html
  [faraday_effect]: https://en.wikipedia.org/wiki/Faraday_effect
  [meteor_m2_4_image]: {{ "assets/2025-05-weather-satellites/meteor_m2_4_2025-05-10UTC13-03-13.avif" | absolute_url }}
  [noaa_1819_composite_msa]: {{ "assets/2025-05-weather-satellites/NOAA-18-19_composite_msa.avif" | absolute_url }}
  [noaa19_cloudtop]: {{ "assets/2025-05-weather-satellites/NOAA-19_2025-05-10UTC10-04-20_cloudtop_enhancement.avif" | absolute_url }}
  [noaa19_no]: {{ "assets/2025-05-weather-satellites/NOAA-19_2025-05-10UTC10-04-20_NO_enhancement.avif" | absolute_url }}
  [noaa19_raw]: {{ "assets/2025-05-weather-satellites/NOAA-19_2025-05-10UTC10-04-20_raw.avif" | absolute_url }}
  [qfh_setup]: {{ "assets/2025-05-weather-satellites/qfh_setup.avif" | absolute_url }}
  [satdump_meteor_m2_4_decoding]: {{ "assets/2025-05-weather-satellites/satdump_meteor_m2_4_decoding.avif" | absolute_url }}
  [satdump_meteor_m2_4_recording]: {{ "assets/2025-05-weather-satellites/satdump_meteor_m2_4_recording.avif" | absolute_url }}
  [sdrpp_frequencies]: {{ "assets/2025-05-weather-satellites/sdrpp_frequencies.avif" | absolute_url }}
  [sdrpp_radio_recorder_modules]: {{ "assets/2025-05-weather-satellites/sdrpp_radio_recorder_modules.avif" | absolute_url }}
  [sdrpp_radio_setup]: {{ "assets/2025-05-weather-satellites/sdrpp_radio_setup.avif" | absolute_url }}
  [sdrpp_recorder_setup]: {{ "assets/2025-05-weather-satellites/sdrpp_recorder_setup.avif" | absolute_url }}
  [sdrpp_source_setup]: {{ "assets/2025-05-weather-satellites/sdrpp_source_setup.avif" | absolute_url }}
  [v_dipole_antenna]: https://www.rtl-sdr.com/simple-noaameteor-weather-satellite-antenna-137-mhz-v-dipole/
  [wxtoimg_manual]: https://web.archive.org/web/20150923170514/https://www.wxtoimg.com/support/wxtoimg.pdf
