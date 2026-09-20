---
categories:       blog
date:             2026-09-20 14:49:33 +0200
description:  >-
  This post contains an update to the previously described setup of my homelab
  with an encrypted root drive and Secure Boot with custom keys.
  The files `/etc/crypttab` and `/etc/crypttab.initramfs` were unified and I
  migrated from `sbupdate-git` to `sbctl`.
lang:             en
last_modified_at: 2026-09-20 14:49:33 +0200
layout:           post
tags:
  - Homelab
title: >-
  Revisiting the Secure Boot setup of my homelab
---

Previously, I set up
[Secure Boot with custom keys][x11scl_if_sb_post] and an encrypted root disk on
my homeserver in 2022.
Now, four years later I received a warning during a pacman update making me aware
that some parts of the previous setup are now obsolete:

> ==> WARNING: /etc/crypttab.initramfs is deprecated. Merge it into /etc/crypttab and add a x-initrd.attach option to the devices that need to be unlocked in the initramfs.

That warning made me check the whole setup again and adapt two parts of the
configuration:

## Unifying the configuration of encrypted devices

Beforehand, the configuration of encrypted block devices was split over two
files:

* `/etc/crypttab` for devices mounted after the boot process has finished like
    external drives, and
* `/etc/crypttab.initramfs` for the encrypted root disk that should be mounted
  early during the boot process.

  ```
  # /etc/crypttab.initramfs

  cryptlvm  UUID=bf8dc6fd-533f-48f2-881b-107f24b61c01 - luks,tpm2-device=/dev/tpmrm0
  ```

In the meantime, the option [`x-initrd.attach`][x_initrd_attach] was introduced
with systemd version 245 in 2020.
That option marks devices in `/etc/crypttab` for mount during early boot and
detachment in late shutdown.
With it, `/etc/crypttab.initramfs` becomes obsolete and entries for encrypted
disks, which should be mounted in the initramfs can be added to the main
`/etc/crypttab`.
So the entry for my root disk becomes

```
# /etc/crypttab

cryptlvm  UUID=bf8dc6fd-533f-48f2-881b-107f24b61c01 - luks,tpm2-device=/dev/tpmrm0,x-initrd.attach

```

## Migrating to sbctl

In the previous post, I recommended [`sbupdate`][sbupdate].
As of 2023 the repository for the project has been archived on GitHub as the
tool is now obsolete.
Nowadays [`sbctl`][sbctl] includes pacman hooks to sign updated binaries and
images automatically.

### Create a unified kernel image with mkinitcpio

Previously, `sbupdate` generated a unified kernel image with `systemd-ukify`.
Now, `mkinitcpio` will be configured to handle the UKI generation instead.
First, create `/etc/cmdline.d/root.conf` with the root drive

```
# /etc/cmdline.d/root.conf

root=/dev/CryptedArch/root
```

Then edit `/etc/mkinitcpio.d/linux-lts.preset` and make sure a single line

```
default_uki="/boot/EFI/Arch/linux-lts-signed.efi"
```

exists.
The path for the unified kernel image must match the image loaded by the
bootloader or configured in an UEFI boot entry.

In my case, the kernel is booted directly from the UEFI and I double-checked
the existing boot entry:

```
$ efibootmgr -u
BootCurrent: 0000
Timeout: 1 seconds
BootOrder: 0000
Boot0000* Arch Linux    HD(1,GPT,b95b2877-7029-48b0-937b-9aaa2091c558,0x800,0x400000)/\EFI\Arch\linux-lts-signed.efi
```

After that, run `mkinitcpio` again and see if the unified kernel image is
created successfully:

```
$ mkinitcpio -P
[...]
==> Creating unified kernel image: '/boot/EFI/Arch/linux-lts-signed.efi'
  -> Using ukify to build UKI
Using config file: /usr/lib/kernel/uki.conf
Wrote unsigned /boot/EFI/Arch/linux-lts-signed.efi
==> Unified kernel image generation successful
```

### Import existing keys to sbctl

After the installation of `sbctl`, the kernel is still not signed automatically.
The installation of a new kernel will output

> Secureboot key directory doesn't exist, not signing!

during the post hooks.

For `sbctl` to work, the existing keys first need be imported.
First, transfer the existing platform key, key exchange key and database
key to the system using a secure method like [`scp`][scp].
Then import them into `sbctl`'s structure with:

```
sbctl import-keys --db-cert db.crt --db-key db.key
sbctl import-keys --kek-cert KEK.crt --kek-key KEK.key
sbctl import-keys --pk-cert PK.crt --pk-key PK.key
```

Afterwards, make sure `sbctl` is ready to work by running
`sbctl setup --print-state --json`.
The output should look like
```
{
  "installed": true,
  "landlock": true
}
```
to indicate a working installation.

Lastly, reinstall the kernel and check if the post hook runs successfully.

```
# pacman -Syu linux-lts
[...]
==> Initcpio image generation successful
==> Running post hooks
  -> Running post hook: [sbctl]
Signing /boot/vmlinuz-linux-lts
✓ Signed /boot/vmlinuz-linux-lts
==> Post processing done
(4/4) Signing EFI binaries...
Generating EFI bundles....
```

## Cleaning up

Finally it's time to clean stuff up.
Remove the `sbupdate-git` package and clean up configuration files.

```
pacman -R sbupdate-git
rm -f /etc/sbupdate.conf.pacsave
rm -rf /etc/efi-keys
# I build AUR packages in `/opt/aur`
rm -rf /opt/aur/sbupdate-git
```

Furthermore, I checked the permissions of the stored key files:
```
ll /var/lib/sbctl/
total 4.0K
-rw-r--r-- 1 root root    0 Sep 18 23:24 bundles.json
-rw-r--r-- 1 root root    0 Sep 18 23:24 files.json
drwxr-xr-x 5 root root 4.0K Sep 18 23:29 keys
```

That's bad - the directory containing my Secure Boot keys is world-readable.
Let's fix that and make the directory as well as its subdirectories and the
key files readable only by root.

```
chmod -R 500 /var/lib/sbctl/keys
chmod 400 /var/lib/sbctl/keys/*/*
```

  [sbctl]: https://archlinux.org/packages/extra/x86_64/sbctl/
  [sbupdate]: https://github.com/andreyv/sbupdate
  [scp]: https://wiki.archlinux.org/title/SCP_and_SFTP#Secure_copy_protocol_(SCP)
  [x_initrd_attach]: https://www.freedesktop.org/software/systemd/man/latest/crypttab.html#x-initrd.attach
  [x11scl_if_sb_post]: {% post_url 2022-02-20-supermicro-X11SCL-IF-secureboot %}
