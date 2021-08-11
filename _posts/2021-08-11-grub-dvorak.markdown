---
categories:       blog
date:             2021-08-11 17:11:32 +0200
description:  >-
  Using Dvorak or any other custom keymap with the GNU GRUB bootloader.
  Delving into the different scan code sets of PS/2 keyboards and program
  the keyboard to send keystrokes in set 1.
lang:             en
last_modified_at: 2021-08-11 17:11:32 +0200
layout:           post
tags:
  - Coding
  - OsDev
title:            Using GNU GRUB with Dvorak and delving into PS/2 keyboards
---

Some time ago, I pulled most keys off my T480's keyboard and rearranged them
in the Dvorak layout for more ergonomic typing.

![ThinkPad T480 with Dvorak Keyboard][1]

At first I only changed the layout in the operating system and left it with
that, adapting the rest didn't fit in my tight schedule.
Lately I found the time again to finish the project.
The goal is to make the layout available during the boot process inside the
GNU GRUB bootloader to edit boot entries and use the GRUB shell.

<details>
  <summary>TL;DR</summary>
  This post explain in detail why switching GRUB terminal input to AT mode and
  setting a keymap may not work in some cases.
  If you do not care about the details and just want the necessary steps to
  solve the problem, you can <a href="#grub-dvorak-config">skip to the end</a>.
</details>

Starting with this, it seemed like an easy task.
Everything is documented in the [Arch wiki][2] as well [as several][3]
[blog posts][4] and [stackoverflow answers][5].

### Taking a look into GRUB keymaps

First the keymap must be converted into a format which GRUB understands.
Keymaps for GRUB usually end with `.gkb`.
I did not find any official nor unofficial documentation about the binary format
used by GRUB for keymaps.
However taking a look at the [source code of GRUBs `keymap` command][6]
reveals some basic facts about the format.

* the layout starts with the 8 magic bytes defined in
  [`grub2/include/grub/keyboard_layouts.h`][7] (`"GRUBLAYO"`)
* After that comes the version of the layout file as little endian `uint32_t`.
  [The current and only version][8] is `0x0A`.
  ```c
if (version != grub_cpu_to_le32_compile_time (GRUB_KEYBOARD_LAYOUTS_VERSION))
  {
    grub_error (GRUB_ERR_BAD_ARGUMENT, "invalid version");
    goto fail;
  }
  ```
  <small>
    [Free Software Foundation 2010, GRUB 2.04, `grub2/grub-core/commands/keylayouts.c`][9]
  </small>
* Finally comes the keyboard mapping as four arrays with 160 entries of four
  byte size (little endian `uint32_t`) each.
  ```c
  #define GRUB_KEYBOARD_LAYOUTS_ARRAY_SIZE 160

  struct grub_keyboard_layout
  {
    grub_uint32_t keyboard_map[GRUB_KEYBOARD_LAYOUTS_ARRAY_SIZE];
    grub_uint32_t keyboard_map_shift[GRUB_KEYBOARD_LAYOUTS_ARRAY_SIZE];
    grub_uint32_t keyboard_map_l3[GRUB_KEYBOARD_LAYOUTS_ARRAY_SIZE];
    grub_uint32_t keyboard_map_shift_l3[GRUB_KEYBOARD_LAYOUTS_ARRAY_SIZE];
  };
  ```
  <small>
    [Free Software Foundation 2010, GRUB 2.04, `grub2/include/grub/keyboard_layouts.h`][10]
  </small>

All together this makes a total size of `2572` bytes for a `.gkb` file.

### Converting the Dvorak keymap for GRUB {#convert-grub-keymap}

GRUB is shipped with the shell script [*grub-kbdcomp*][11] to convert keymaps
into `.gkb` files.
Unfortunately this script [depends on `ckbcomp`][12], which is not available in
the official Arch repos yet.
```
# grub-kbdcomp -o /boot/grub/layouts/dvorak.gkb dvorak
/usr/bin/grub-kbdcomp: line 76: ckbcomp: commant not found
ERROR: no valid keyboard layout found. Check the input.
```

As a workaround, [*ckbcomp* from the AUR][13] can be used or as *ckbcomp* is
just a perl script it can be extracted from the package without installing it on
the system:

```bash
cd /tmp
wget http://ftp.de.debian.org/debian/pool/main/c/console-setup/console-setup_1.205.tar.xz
tar -xf console-setup_1.205.tar.xz
cd console-setup-1.205
PATH=./Keyboard:$PATH grub-kbdcomp -o /boot/grub/layouts/dvorak.gkb dvorak
```

### Loading the keymap in GRUB

GRUB supports [different sources][14] for input.
The input sources are defined by the `terminal_input` command inside the GRUB
shell or `GRUB_TERMINAL_INPUT` in `/etc/default/grub`.
For example `serial` for serial keyboards or `at_keyboard` for the IBM AT
compatible 8042 PS/2 controller emulation.
The default value is `console ` for the [`EFI_SIMPLE_TEXT_INPUT_PROTOCOL`][15].
Custom keymaps are not supported with the `console` input, as the EFI performs
the mapping and feeds the resulting unicode characters to GRUB.
Therefore the `at_keyboard` input is required, as this mode provides scan codes
from the keyboard, that can be translated by GRUB.

The first step is to edit `/etc/default/grub` and change

```bash
GRUB_TERMINAL_INPUT=console
```

to

```bash
GRUB_TERMINAL_INPUT=at_keyboard
```

Next GRUB needs to actually load the Dvorak keymap.
To use the `keymap` command, the `keylayouts` module needs to be loaded first.

To permanently add the aforementioned changes to the GRUB configuration, edit
`/etc/grub.d/40_custom` and insert these two lines:

```
insmod keylayouts
keymap dvorak
```

Finally the configuration needs to be recreated with
```
grub-mkconfig -o /boot/grub/config.cfg
```
and after a reboot everything should work right away.

Except it doesn't for me.

### Debugging the keymap problem

With the above mentioned configuration almost nothing worked inside GRUB.
Pressing keys on the keyboard does mostly nothing and sometimes issues weird
input.
I was still able to boot my system by waiting for the GRUB timeout to finish,
but could not do any action - for example selecting another entry - inside Grub.

It first I reverted all my changes, restarted the ThinkPad and entered the GRUB
console by pressing `c` (or `k` on my not yet configured Dvorak keyboard) inside
the GRUB menu.
There I tried to perform all the changes manually to see which one breaks the
keyboard.
It out, that `terminal_input at_keyboard` was responsible for the degradation
right away.
After some digging through the internet I found a [relevant bug report][16] at
the Debian Bug tracker explaining what is going on.
The keyboard sends data to the computer indicating which action where performed
on it - namely which keys where pressed and released.
This data is called *"scan code"*.

### Understanding scan code sets

Same as always, there are several standards for translating keystrokes into
scan codes.

![xkcd 927 - STANDARDS][17]

<small>
  [Randall Munroe July 20, 2011 - 927: STANDARDS][18]
</small>

Historically it started with the IBM Personal Computer/XT in 1983.
This PC introduced the XT keyboard which send keystrokes encoded in what is
nowadays known as *scan code set 1*.
Most common keys have single byte keystrokes with the most significant bit
equal set if the key is pressed and cleared when the key is released.
A little over a year later, the IBM Personal Computer/AT was introduced and
brought a new protocol - the scan code set 2 - for communication with the
keyboard.
The scan code set 2 is mostly incompatible with the scan code set 1, as most
scan codes have an entirely different meaning.
Also releasing a key is not indicated by the byte `0xF0` followed by the
scan code of the key.
Furthermore around the same time the scan code set 3 was introduced, which
can be best described as a superset of the second scan code set.
However the scan code set 3 is not relevant for this post.

The following table list a selected variety of scan codes and their translation
to set 1 and 2.

{% assign scancodes = site.data.grub_dvorak.scancodes %}

| Scan code(s) | Set1 | Set2 |
|--------------|------|------|
{% for row in scancodes -%}
| **{{ row[0] }}** | {{ row[1]["set1"]}} | {{ row[1]["set2"]}} |
{% endfor %}

### So what is going on now

As the aforementioned [bug report indicates][16], the keyboard sends scan codes
in scan code set 2 while GRUB interprets the input as set 1.
This can be verified either by trial and error - pressing the key `c`
(in US ANSI layout).
The keyboard will issue
```
0x21 0xF0 0x21
 │    │    └──  Key `c` in set 2, interpreted as `f` in set 1
 │    └───────  Indicating key release in set 2, ignored in set 1
 └────────────  Key `c` in set 2, interpreted as `f` in set 1
```
and GRUB reads it as `ff`.
Otherwise GRUB provides the `inb` and `outb` commands to read bytes
directly from specific ports.
The PS/2 controller uses `0x60` as data port (where the keyboard data can be
read).
To read a scan code press the key on the keyboard connected to the PS/2
controller and enter `inb 0x60` into the GRUB shell from another serial or
USB keyboard.

### How to fix the problem?

Multiple places in the internet mention setting the input method with
`terminal_input at_keyboard ; outb 0x64 0x60 ; outb 0x60 0x64`
from GRUB.
Aside from the fact, that this does not work for me, what should it even do?

The ports `0x64` and `0x60` are both used for communication with the PS/2
controller.
The first port (`0x64`) reads the status of the controller and sends commands,
the other port (`0x60`) reads and sends data.

The command
```
outb 0x64 0x60
```
writes the byte `0x60` into port `0x64` and tells the PS/2 controller to write
the next byte from the data port into offset 0 off the controllers RAM.
Then the next command
```
outb 0x60 0x64
```

sends the *controller configuration byte* `0x64` to the controller.
The format of the configuration byte is

| Bit | Description                                  |
|-----|----------------------------------------------|
| 0   | First port interrupt enabled                 |
| 1   | Second port interrupt enabled                |
| 2   | Has the system passed POST?                  |
| 3   | ?                                            |
| 4   | First port clock enabled                     |
| 5   | Second port clock enabled                    |
| 6   | XLAT (translation of set 2 to set 1) enabled |
| 7   | ?                                            |

This byte send to the controller has the 2nd and 5ft and 6th bit set -
so it tells the system, that the **P**ower **O**n **S**elf **T**est has been
passed, enables the translation from set 2 to set 1, which is exactly what
I need and also enables the second port clock?
I am not sure about the third part, some sources list the 5th byte as enabling
the keyboard in general, which would make more sense I guess.
Since I do not exactly now the meaning of the 5th byte, I will leave it cleared.

1. attempt.
    I use `terminal_input at_keyboard console` instead.
    That way a USB keyboard keeps working and I can recover the system after the
    internal keyboard is gone.

    ```
grub> terminal_input at_keyboard console ; outb 0x64 0x60 ; outb 0x60 0x40
    ```
    After this command, my internal keyboard was still behaving weird.

2. attempt, running the commands one after another

    ```
grub> terminal_input at_keyboard console
grub> outb 0x64 0x60 ; outb 0x60 0x40
    ```
    Still not the desired result.

Well then, are there any other ways to get the keyboard to send keystrokes in
set 1.
There is indeed another way.
Up until now I only talked to the PS/2 controller and trick it into translating
the scan codes from set 1 to set 2.
The keyboard itself can also be told which scan code set it should use.
Communication with the keyboard happens by writing to port `0x60`.
The command `0xf0` lets one set or read the current scan code set.
These arguments are available for the command:

| Argument | Description                     |
|----------|---------------------------------|
| `0x00`   | Read the current scan code set. |
| `0x01`   | Set the scan code set 1.        |
| `0x02`   | Set the scan code set 2.        |
| `0x03`   | Set the scan code set 3.        |

As a first attempt, I will try to read the current scan code set:
```
grub> outb 0x60 0xf0 ; outb 0x60 0x00 ; inb 0x60
0x2
```

Well, this seems correct.
Now let's try to change the scan code set:
```
grub> outb 0x60 0xf0 ; outb 0x60 0x01
```

aaaaaand the keyboard works.
Now I just enter `normal` to go back to the GRUB menu and select my Linux
system.
At that point I realized, that my keyboard was now entering gibberish in Linux.

### Forcing Linux to reset the AT keyboard {#linux-reset-at-keyboard}

After digging a bit around in the source code of the
[Linux AT and PS/2 keyboard driver][19], there is a parameter with the name *reset*
defined:

```c
#if defined(__i386__) || defined(__x86_64__) || defined(__hppa__)
static bool atkbd_reset;
#else
static bool atkbd_reset = true;
#endif
module_param_named(reset, atkbd_reset, bool, 0);
MODULE_PARM_DESC(reset, "Reset keyboard during initialization");
```
<small>
  [Vojtech Pavlik 1999-2002, Linux, `drivers/input/keyboard/atkbd.c`][20]
</small>

This parameter is used for the following code - which is exactly what I need.
```c
/*
 * Some systems, where the bit-twiddling when testing the io-lines of the
 * controller may confuse the keyboard need a full reset of the keyboard. On
 * these systems the BIOS also usually doesn't do it for us.
 */

if (atkbd_reset)
        if (ps2_command(ps2dev, NULL, ATKBD_CMD_RESET_BAT))
                dev_warn(&ps2dev->serio->dev,
                         "keyboard reset failed on %s\n",
                         ps2dev->serio->phys);
```
<small>
  [Vojtech Pavlik 1999-2002, Linux, `drivers/input/keyboard/atkbd.c`][19]
</small>

To force the reset, add `atkbd.reset=1` to the kernel command line by editing
the variable `GRUB_CMDLINE_LINUX_DEFAULT` in the file `/etc/default/grub`.

### Configuring GRUB with the Dvorak keyboard layout {#grub-dvorak-config}

All the steps to change the keymap inside GRUB pulled together:

1. [Convert the Dvorak keymap in a format understood by GRUB](#convert-grub-keymap).
    ```bash
cd /tmp
wget http://ftp.de.debian.org/debian/pool/main/c/console-setup/console-setup_1.205.tar.xz
tar -xf console-setup_1.205.tar.xz
cd console-setup-1.205
PATH=./Keyboard:$PATH grub-kbdcomp -o /boot/grub/layouts/dvorak.gkb dvorak
    ```
2. Tell GRUB to use the AT keyboard driver for input by editing
    `/etc/default/grub` and changing
	```
GRUB_TERMINAL_INPUT="console"
	```
	to
	```
GRUB_TERMINAL_INPUT="at_keyboard"
	```
3. Load the keymap inside GRUB and switch the keyboard to scan code set 1.
   Edit `/etc/grub.d/40_custom` and add
   ```
insmod keylayouts
keymap dvorak
# Tell the PS/2 keyboard to switch to scan code set 1
outb 0x60 0xf0 ; outb 0x60 0x01
   ```
   at the end.
4. Force the [Linux Kernel to reset the keyboard](#linux-reset-at-keyboard) upon starting.
   Edit `/etc/default/grub` again and add
   ```
atkbd.reset=1
   ```
   to `GRUB_CMDLINE_LINUX_DEFAULT`.
5. Recreate the GRUB configuration.
   Run
   ```
grub-mkconfig -o /boot/grub/grub.cfg
   ```


  [1]: {{ "assets/grub-dvorak/thinkpad_t480_dvorak.jpg" | relative_url }}
  [2]: https://wiki.archlinux.org/title/Talk:GRUB#Custom_keyboard_layout
  [3]: https://blog.habets.se/2015/11/How-I-made-my-custom-keyboard-layout-on-Linux-and-Windows.html
  [4]: https://itectec.com/unixlinux/linux-how-to-use-dvorak-keyboard-layout-in-grub2-luks-passphrase-prompt/
  [5]: https://askubuntu.com/questions/751259/how-to-change-grub-command-line-grub-shell-keyboard-layout#answer-751260
  [6]: https://github.com/rhboot/grub2/blob/a53e530f8ad3770c3b03c208c08ae4162f68e3b1/grub-core/commands/keylayouts.c#L198
  [7]: https://github.com/rhboot/grub2/blob/a53e530f8ad3770c3b03c208c08ae4162f68e3b1/include/grub/keyboard_layouts.h#L22
  [8]: https://github.com/rhboot/grub2/blob/a53e530f8ad3770c3b03c208c08ae4162f68e3b1/include/grub/keyboard_layouts.h#L24
  [9]: https://github.com/rhboot/grub2/blob/a53e530f8ad3770c3b03c208c08ae4162f68e3b1/grub-core/commands/keylayouts.c#L250
  [10]: https://github.com/rhboot/grub2/blob/a53e530f8ad3770c3b03c208c08ae4162f68e3b1/include/grub/keyboard_layouts.h#L26
  [11]: https://man.archlinux.org/man/core/grub/grub-kbdcomp.1.en
  [12]: https://bugs.archlinux.org/task/64285
  [13]: https://aur.archlinux.org/packages/ckbcomp/
  [14]: https://www.gnu.org/software/grub/manual/grub/html_node/Simple-configuration.html#:~:text=GRUB_TERMINAL_INPUT
  [15]: https://tianocore-docs.github.io/edk2-UefiDriverWritersGuide/draft/22_text_console_driver_design_guidelines/222_simple_text_input_protocol_implementation/
  [16]: https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=741464
  [17]: https://imgs.xkcd.com/comics/standards.png
  [18]: https://xkcd.com/927/
  [19]: https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/drivers/input/keyboard/atkbd.c
  [20]: https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/drivers/input/keyboard/atkbd.c#n39
  [21]: https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/drivers/input/keyboard/atkbd.c#n768
