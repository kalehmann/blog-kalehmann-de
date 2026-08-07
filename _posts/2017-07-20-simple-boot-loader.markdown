---
categories:       blog
date:             2017-07-20 14:14:21 +0200
description:  >-
  Writing a simple x86 bootloader from scratch in assembly. Use BIOS calls in
  assembly to load more than 512 bytes from a drive during the boot process on
  the x86 platform.
lang:             en
last_modified_at: 2026-08-07 21:32:00 +0200
layout:           post
tags:
  - Coding
  - OsDev
title:            Writing an x86 bootloader from scratch
---

Writing boot code using only the BIOS functions can be quite fun.
Implementing programs without loading additional data using only 512 bytes is
a nice challenge.
However, at some point, one may strive to implement more complex programs.
That was the day when I decided to write a bootloader for fun.

There are a handful of points that I have considered before writing a
bootloader.

The first question was: What do I want to load?
- A bunch of bytes from a fixed address at the drive?
- A file from a file system on the drive?

After answering that question I had to think about the design of the bootloader.
A bootloader can be single-stage or multi-stage.

Single-stage means that all the magic fits into 512 bytes and the bootloader
loads the data directly.

For bootloaders, that have to do some more complex things, like handling user
input or supporting multiple file systems, 512 bytes are unsatisfactory.
A solution is a bootloader that consists of two stages.
A big, bloated stage that does all the file loading and a small stage that
loads the second stage.
Such a bootloader is called a multi-stage bootloader.

I decided to write a bootloader that can load a file from the root directory of
a FAT12 partition by the name of the file.
Since FAT12 is fairly simple, the code for the bootloader fits in a single
stage.

I wrote the whole code during my first apprenticeship, most of it originated
during the daily train trips to school.

## The layout of a FAT12-formatted drive

Let's start with a little excursion about the layout of a FAT12-formatted
drive.
A FAT12-formatted drive begins with the boot record.
The boot record has a fixed size of 512 bytes.

### The BIOS Parameter Block (BPB)

The BPB is a structure in the boot record describing the drive and the file
system.
The bootloader contains a DOS 4.0 Extended BPB with the following data:

{% highlight nasm %}
;; 3 bytes for jump after the BPB
jmp short start
nop

OEMLabel:               db "mkfs.fat"
SectorSize:             dw 512
SectorsPerCluster:      db 1
ReservedForBoot:        dw 1
NumberOfFats:           db 2
NumberOfRootDirEntrys:  dw 224
LogicalSectors:         dw 2880
MediumByte:             db 0F0h
SectorsPerFat:          dw 9
SectorsPerTrack:        dw 18
NumberOfHeads:          dw 2
HiddenSectors:          dd 0
LargeSectors:           dd 0
DriveNumber:            dw 0
Signature:              db 41
VolumeID:               dd 0
VolumeLabel:            db "FatTest    "
FileSystem:             db "FAT12   "
{% endhighlight %}

The data in the BPB is essential information for loading additional code and
data from a drive.

### The File Allocation Table

The boot record is followed by one or more file allocation tables.
The file allocation table describes the distribution of the files on the drive.
The FAT12 file system organizes the data on the drive in clusters.
The size of a cluster may be equal to the size of a sector, but a cluster can
also span over multiple sectors.

A File Allocation Table is a list of all the clusters on the drive.
Each entry contains either the index of the next cluster in the cluster chain
for a file or special markers indicating an empty cluster or the end of the
cluster chain.

The first two entries in the file allocation table contain special values.
The first entry holds the fat id and the second entry holds the special
marker indicating the end of a cluster chain.

The **12** in FAT**12** describes the size of each entry in the file allocation
table: 12 bits.

### The root directory table

Directories are organized as tables on a FAT12 partition.
All those tables are organized as files on the drive except the root directory
table.
It starts right after the file allocation table(s) and has a fixed number of
entries.
Each entry has a size of 32 bytes and describes a file in the directory.

The entries have the following layout:

| Description                      | Size    |
|----------------------------------|---------|
| Short file name                  | 8 bytes |
| Short file extension             | 3 bytes |
| File attributes                  | 1 byte  |
| User attributes                  | 1 byte  |
| Creation time or first character | 1 byte  |
| Password hash or creation time   | 2 bytes |
| Creation date                    | 2 bytes |
| Owner id                         | 2 bytes |
| Access rights                    | 2 bytes |
| Last modification time           | 2 bytes |
| Last modification date           | 2 bytes |
| First cluster                    | 2 bytes |
| File size                        | 4 bytes |

## Implementing the bootloader

The bootloader has to complete several tasks to load and execute a program from
the drive:

- Relocate the bootloader, so that the program can be loaded to the memory
address where the BIOS loads boot code to.
This is the address `0x7C00`.
- Load the root directory table and find the entry for the file that should be
loaded.
- Follow the chain of entries in the file allocation table and load the file
into memory.
- Jump to the position where the file is loaded.
- A nice extra would be preserving the drive number of the boot drive and
passing it to the loaded program.

### Relocating the program

The relocation is a pretty simple task.
There is the **rep** instruction in x86 assembly.
It repeats a string operation until the **cx** register equals zero.
In combination with the **movsw** instruction, which moves a single word
(two bytes) from **ds:si** to **es:di**, it can be used to copy any amount
of data around.

After that comes a far jump to the new location, that also changes the code
segment **cs**.

{% highlight nasm %}
  ;; Move 512 bytes from 0x7c00 to 0x600 and jump to the new address
  mov ax, 0x7c0
  mov ds, ax
  mov ax, 0x60
  mov es, ax

  xor si, si
  xor di, di
  mov cx, 256
  rep movsw

  jmp 0x60:go_on
go_on:
{% endhighlight %}

### Loading actual data from a drive

This is not quite so simple.
The BIOS still accesses drives as floppy-like devices.
Floppy disks consisted of thin magnetical disks.
Some floppies were doubled-sided and writable, while others were single-sided or
readonly.
Reading and writing to such a disk happens by moving the read/write head across
the disk.
Therefore you can refer to a side of a specific disk by the number of its head.
The disk itself is split in many circular magnetic stripes called tracks for one
or two heads and cylinders for more heads.
Furthermore a cylinder is split in several sectors, which are 1-indexed.

Therefore the cylinder, the head and the sector need to be known to address a
sector on a floppy.
This is commonly referred to as _CHS_.
An alternative to this is the Logical Block Addressing - _LBA_.
This is a zero-indexed linear addressing scheme for sectors on a drive and a
useful abstraction.

However, most file systems including FAT do not think in sectors, but in
clusters.
A cluster may be equal to one sector, but can also span over two or more sectors.

This brings the need for some helper functions to get the cylinder, head and
sector from a cluster.

The LBA can be calculated from a cluster using the following formula (Note that
the cluster numbering starts at 2):

<math display="block">
  <mtable>
    <mtr>
      <mtd>
        <mi>LBA</mi>
      </mtd>
      <mtd>
        <mo>=</mo>
      </mtd>
      <mtd>
        <mo>(</mo>
        <mi>Cluster</mi>
        <mo>-</mo>
        <mn>2</mn>
        <mo>)</mo>
        <mo>⋅</mo>
        <mi>SectorsPerCluster</mi>
        <mo>+</mo>
      </mtd>
    </mtr>
    <mtr>
      <mtd></mtd>
      <mtd></mtd>
      <mtd columnalign="left">
        <mi>RootStartSector</mi>
        <mo>+</mo>
        <mi>RootDirSize</mi>
      </mtd>
    </mtr>
  </mtable>
</math>

{% highlight nasm %}
%macro cluster2LBA 0
    ;; This macro calculates the LBA from the cluster in ax and saves it in
    ;; the ax register.
    ;; Cluster numbering starts at 2, therefore first subtract 2 from the
    ;; cluster number to get zero-based cluster numbers.
    ;; LBA = Cluster * SectorsPerCluster + RootStartSector + RootSize
    sub ax, 2
    xor cx, cx
    mov cl, [SectorsPerCluster]
    mul cx
    add al, [RootStartSector]
    add ax, [RootSize]
%endmacro
{% endhighlight %}

From that the cylinder, head and sector can be calculated with

<math display="block">
  <mtable>
    <mtr>
      <mtd>
        <mi>cylinder</mi>
      </mtd>
      <mtd>
        <mo>=</mo>
      </mtd>
      <mtd>
        <mfrac>
            <mi>LBA</mi>
            <mrow>
              <mi>SectorsPerTrack</mi>
              <mo>⋅</mo>
              <mi>NumberOfHeads</mi>
            </mrow>
        </mfrac>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi>sector</mi>
      </mtd>
      <mtd>
        <mo>=</mo>
      </mtd>
      <mtd>
        <mrow>
          <mi>LBA</mi>
          <mo>mod</mo>
          <mi>SectorsPerTrack</mi>
          <mo>+</mo>
          <mn>1</mn>
        </mrow>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi>head</mi>
      </mtd>
      <mtd>
        <mo>=</mo>
      </mtd>
      <mtd>
        <mrow>
          <mfrac>
            <mi>LBA</mi>
            <mi>SectorsPerTrack</mi>
          </mfrac>
          <mo>mod</mo>
          <mi>NumberOfHeads</mi>
        </mrow>
      </mtd>
    </mtr>
  </mtable>
</math>

{% highlight nasm %}
%macro lbachs 0
    ;; This macro converts a LBA address stored in ax to a CHS address
    ;; and saves the track/cylinder in the ch register, the sector in the
    ;; cl register and the head in the dh register.
    xor dx, dx
    div word [SectorsPerTrack]
    ;; ax -> lba / spt
    ;; dx -> lba % spt
    inc dx
    ;; sectors = lba mod spt + 1
    mov cl, dl
    xor dx, dx
    div word [NumberOfHeads]
    ;; ax -> lba / (spt * heads)
    ;; dx -> (lba / spt) % heads
    ;; Save the head to dh
    mov dh, dl
    ;; Save the cylinder to ch
    mov ch, al
%endmacro
{% endhighlight %}

With this knowledge a function that reads multiple sectors from a drive can be
implemented.

The data can be loaded using the interrupt `0x13,2`.
This interrupt takes the number of sectors to read in **al**, the cylinder in
the two most significant bits of **cl** and **ch**, the head in **dh**,
the drive number in **dl** and a pointer to a buffer in **es:bx**.

An important thing to remember is that this interrupt sets the carry flag in
case of an error.
This is important for reading from real floppies.
Several read attempts may be necessary to give the motor some time to reach the
required speed.

{% highlight nasm %}
readsectors:
    ;; Read n sectors starting from LBA with n in ax and LBA in bx to the
    ;; segment:address stored in es:cx
    push bp
    mov bp, sp
    sub sp, 8
    mov [bp-2], ax
    mov [bp-4], bx
    mov [bp-6], cx
    mov word [bp-8], MAX_READ_ATTEMPTS

.read_loop:
    ;; Let's read data from the drive. There are at maximum 5 attempts to
    ;; read, so that the motor has enough time to reach the correct speed.
    ;; Knowing how a floppy is made up really helps understanding the
    ;; following code.
    ;; Floppy disks had those thin magnet disks. Some disks were readable and
    ;; writable and both sides and others only at one. Reading and writing
    ;; to such a disk happens by the head over the disk, so a side of the
    ;; is commonly referred the by the number of its head.
    ;; Each disk is split in many circular magnet stripes. These are
    ;; called tracks for one or two heads and cylinders for more heads.
    ;; Furthermore a cylinder is split in several sectors, which are
    ;; 1-indexed.
    ;; For this bootloader a 3.5" High Density floppy with 1.44Mb and 80
    ;; tracks/cylinders, each with 18 sectors of 512 bytes is simulated.
    mov ax, [bp-4]
    lbachs
    ;; Read to es:[bp-6]
    mov bx, [bp-6]
    ;; ch, cl and dh are already set from the call to the lbachs function
    mov dl, [BootDrive]
    ;; Move 2 in ah and 1 in al
    mov ax, 0000001000000001b
    int 0x13
    jnc .read_next_sector
    dec word [bp-8]
    jnz .read_loop
    ;; Enter an endless loop if reading wasn't successful in the fifth try.
    mov si, ReadError
    call print_error

.read_next_sector:
    dec word [bp-2]
    ;; Finish if no sectors are remaining
    jz .read_done
    inc word [bp-4]
    mov ax, [SectorSize]
    add [bp-6], ax
    mov word [bp-8], MAX_READ_ATTEMPTS
    jmp .read_loop

.read_done:
    add sp, 8
    pop bp
    ret
{% endhighlight %}

Now one or more continuous sectors can be loaded.
This is suitable for loading a single cluster.
But a file may be distributed over multiple clusters.
And these clusters may not be stored in a continuous chain.
This is called fragmentation.
To gather all the sectors of a file one has to follow the cluster chain of the
file in the file allocation table.

The entry of the current cluster in the file allocation table contains either
the index of the next cluster in the chain or a special marker indicating that
this cluster is the last one in the cluster chain of the file.

{% highlight nasm %}
%macro getNextCluster 0
    ;; Get the next cluster for the cluster in ax
    ;; Saves the next cluster in ax.
    mov cx, ax
    mov dx, ax
    ;; The current cluster is now in ax, cx and dx
    ;; Divide ax by two
    shr     ax, 1
    ;; The cluster size in FAT12 is 12 bits, 3/2 bytes. The next cluster
    ;; is the FAT pointer + 3/2 the current cluster.
    add     cx, ax
    mov     bx, [FatPointer]
    add     bx, cx
    ;; Read two bytes
    mov     ax, [bx]
    ;; Test if even or odd cluster number and extract the 12 bits of the
    ;; cluster.
    test    dx, 1
    jnz     %%odd_cluster

%%even_cluster:
    ;; Get the least significant 12 bits.
    and ax, 0111111111111b
    jmp %%done

%%odd_cluster:
    ;; Shift ax 4 bits right to get the 12 most significant bits.
    shr ax, 4
%%done:
%endmacro
{% endhighlight %}

With this information, a file can be loaded cluster by cluster from the drive.

{% highlight nasm %}
load_file:
    ;; This function loads a file with the starting cluster in ax to the
    ;; address stored in bx.
    push bp
    mov bp, sp
    sub sp, 4

    mov [bp-2], ax
    mov [bp-4], bx

.load_file_loop:
    mov ax, [bp-2]
    cluster2LBA

    ;; Read cluster into memory
    mov bx, ax
    xor ax, ax
    mov al, [SectorsPerCluster]
    mov cx, [bp-4]
    call readsectors

    ;; Increase the file pointer by the size of a cluster
    xor ax, ax
    mov al, [SectorsPerCluster]
    mov cx, [SectorSize]
    mul cx
    add [bp-4], ax

    mov ax, [bp-2]
    getNextCluster
    mov [bp-2], ax
    ;; Test for the special "end of file" marker
    cmp ax, 0xFFF
    jne .load_file_loop

    add sp, 4
    pop bp
    ret
{% endhighlight %}

At one point the bootloader was almost finished, however I could not load a file
larger than one sector.
This bothered me for several weeks.
One night I woke up at 3 AM and just knew what the bug was.
I got up, turned on my PC, quickly typed my solution and went back to sleep.
Two hours later I got up again and went to work.
The whole day I got more and more excited to see whether my solution actually
worked and was so happy in the evening to know that I finally finished my
bootloader.

In the end my problem was that I had not increased the pointer to the buffer for
the file to load by the size of one cluster, but by a single byte.

## Load the root directory table

To process the root directory table, it first needs to be loaded into the
memory.
To load the root directory table into memory, its location has to be known.
The root directory table is located right after the reserved boot sector(s)
and the file allocation table(s).

The information needed to calculate the start address of the root directory
table can be gathered from the BIOS parameter block.

The formula for the first sector of the root directory table is:

<math display="block">
  <mrow>
    <mi>RootStartSector</mi>
    <mo>=</mo>
    <mi>NumberOfFats</mi>
    <mo>⋅</mo>
    <mi>SectorsPerFat</mi>
    <mo>+</mo>
    <mi>ReservedForBoot</mi>
  </mrow>
</math>

And the size of the root directory table in sectors can be calculated with:

<math display="block">
  <mrow>
    <mi>RootSize</mi>
    <mo>=</mo>
    <mfrac>
      <mrow>
        <mo>(</mo>
        <mi>NumberOfRootDirEntries</mi>
        <mo>⋅</mo>
        <mi>EntrySize</mi>
        <mo>)</mo>
      </mrow>
      <mi>SectorSize</mi>
    </mfrac>
  </mrow>
</math>

### Processing a root directory table entry

Each entry starts with the filename in the 8.3 format.
That means 8 bytes for the name and 3 bytes for the file extension.
If the name is shorter than 8 bytes, the rest is padded with spaces.

Processing such an entry is easy, just compare the first 11 bytes of the entry
with the name of the file the bootloader loads.

If both are equal, the file can be loaded and control passed to it.
Switching to the loaded file happens through a far jump that changes the code
segment register **cs** to the segment the file is loaded to.

``` nasm
process_entry:
    ;; This function processes an entry of the root directory table with its
    ;; address in ax and loads the file described by the entry if the name
    ;; matches the 8.3 name stored in FileName.
    mov cx, 11
    mov si, ax
    mov di, FileName
    repe cmpsb
    je .pass_control
    ret

.pass_control:
    ;; The si register holds the address of the root directory table entry
    ;; of the file to load + 11
    ;; The address of the first cluster of the file to load is the address
    ;; of the root directory table entry + 26
    ;; [si+15] holds the first cluster.
    mov ax, [si+15]
    mov bx, FILE_SEGMENT
    ;; Load to FILE_SEGMENT:0
    mov es, bx
    xor bx, bx
    call load_file
    ;; Pass the boot drive to the next stage.
    mov dl, [BootDrive]
    ;; Far jump to the next stage
    jmp FILE_SEGMENT:0
```

At this point the task of the bootloader is done.
The full source code, including all the pieces shown above, is available in the
repository [kalehmann/SiBoLo](https://gitlab.com/kalehmann/SiBoLo) on GitLab.

## Installation on a drive

The bootloader comes with a little C program for the installation on a drive.

## Example usage

Setting up the bootloader to load a program - such as my
[Pong from scratch]({% post_url 2016-07-13-pong %}) -
is pretty straightforward.

### Building the project

First the bootloader and its installer have to be built.
This can be done using the makefile of the project.
Note that **nasm** and **gcc** have to be installed in order to build
the project.

### Creating a floppy image

Creating a floppy image can be done using the _mkfs.fat_ utility.
The following command creates a new FAT12 image named _floppy.flp_ with a size
of 1.44 MB.

``` bash
mkfs.fat -C floppy.flp 1440
```

To copy files onto the image, it needs to be mounted first.
And to mount a regular file under Linux, a loop device has to be associated
with it.
_losetup_ is the tool of choice for this task.
The following commands assume that the Pong binary has already been built and
copied to the projects directory.

``` bash
LOOP_DEV=$(losetup -f)
losetup ${LOOP_DEV} floppy.flp
mount ${LOOP_DEV} /mnt
cp PONG.BIN /mnt/
umount /mnt
```

### Using the installer

The bootloader gets written on the floppy image with the supplied installer.
The installer takes 3 arguments:

1. the bootloader binary
2. the floppy image to write the bootloader onto
3. the name of the file the bootloader should load

Note that the name of the file that the bootloader loads needs to comply with
the 8.3 format.
The length of the base name must not exceed 8 bytes and the length of the file
extension must not exceed 3 bytes.
All letters must be upper case.

```
./sibolo-install bootloader.bin floppy.flp PONG.BIN
```

### Testing with QEMU

The QEMU PC System emulator can be used to test the created floppy.
The `-fda` option tells QEMU to use the following file as floppy.

```
qemu-system-x86_64 -fda floppy.flp
```
