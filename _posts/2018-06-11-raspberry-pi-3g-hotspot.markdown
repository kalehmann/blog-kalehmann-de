---
layout: post
title:  "3G Hotspot mit einem Raspberry Pi"
date:   2018-06-11 18:06:31 +0200
categories: blog
---
Eine Verbindung über einen Wlan-Hotspot ist eine gute Möglichkeit für eine
Kommunikation zwischen einem Smartphone und einem Raspberry Pi.
Wenn der Raspberry Pi bei mobiler Nutzung nicht mit dem Internet verbunden ist,
entfällt in der Zeit, in der das Smartphone mit dem Wlan verbunden ist
allerdings die Möglichkeit Nachrichten wie Emails oder Whatsapp zu empfangen.

Um dies zu Umgehen wird in diesem Post erläutert, wie man mittels eines
3g-Modems und dem Raspberry Pi einen mobilen Hotspot mit Internetanbindung
einrichtet.

Dazu benötigt man als erstes ein 3G-Modem. Die Auswahl an solchen Geräten ist
ziemlich groß, dieser Beitrag richtet sich jedoch an Geräte welche HiLink
unterstützen.

HiLink-Modems melden sich am PC als Ethernet Adapter an und lassen sich über
ein eigenes Webinterface spielend leicht konfigurieren.

Als Beispiel wird hier der Huawei E3131 verwendet.
Für die Simkarte ist [Netzclub](https://www.netzclub.net/) empfehlenswert,
da deren Tarif [Sponsored Surf Basic](https://www.netzclub.net/sponsored-surf-basic/)
kostenlos ein Datenvolumen von 100 MB im Monat bietet. Danach lässt sich immer
noch mit verminderter Geschwindigkeit weitersurfen.

## Stromaufnahme des 3g-Modems und eines Wlan-Sticks

Da die Stromaufnahme von WLan-Stick und 3G-Modem zusammen bereits 300 mA
beträgt, empfiehlt sich die Verwendung eines aktiven USB-Hubs.
![USB-3g-Modem mit angeschlossenem Amperemeter]( {{ "assets/raspberry-pi-3g-hotspot/Stromaufnahme_3g_modem.jpg" | absolute_url }})
![USB-Wlan-Stick mit angeschlossenem Amperemeter]( {{ "assets/raspberry-pi-3g-hotspot/Stromaufnahme_wlan_stick.jpg" | absolute_url }})

Nachdem man das 3g-Modem an den Raspberry Pi angeschlossen hat, muss als erstes
überprüfen werden, ob es per USB ModeSwitch bereits in den HiLink-Modus versetzt
wurde. Dazu führt man dem Befehl `ifconfig` aus und schaut, ob dort ein zweites
Ethernet-Interface gelistet ist. Wenn dies der Fall ist kann der nächste
Schritt übersprungen werden.

## Usb ModeSwitch für ein 3g-Modem konfigurieren

Ist dies nicht der Fall, muss USB ModeSwitch manuell für den Stick konfiguriert
werden. Das Programm sollte bereits mit den Paketen **usb-modeswitch** und
**usb-modeswitch-data** unter Raspbian vorinstalliert sein.
Wenn dem nicht so ist, kann man die Installation mit folgendem Befehl nachholen:
```
sudo apt-get install usb-modeswitch usb-modeswitch-data
```
Anschliessend führt man den Befehl `lsusb` aus. Dort sollte ein Gerät mit
folgendem oder ähnlichem Eintrag gelistet sein:
```
Bus 001 Device 036: ID 12d1:1f01 Huawei Technologies Co., Ltd.
```
Als erstes probiert man das Gerät manuell in den HiLink-Modus zu versetzen.
Dazu verwendet man folgenden Befehl:
```
sudo usb_modeswitch -v 12d1 -p 1f01 -M '55534243123456780000000000000a11062000000000000100000000000000'
```
Die Optionen **-v** und **-p** sind dabei an die Vendor- und Produkt-ID der
Ausgabe von lsusb anzupassen.
**Achtung:** Die Nachricht, die an den Stick gesendet wird kann je nach Gerät
variieren. Falls es mit dieser hier nicht funktioniert muss nach der passenden
Nachricht für das gegebene Modell recherchiert werden.

Jetzt sollte man bei dem Ausführen von `ifconfig` ein zweites Ethernet Interface
sehen. Um diese Änderung bei jedem Neustart automatisch auszuführen, muss man
die Datei **/etc/usb_modeswitch.conf** editieren.
Vorher benötigt man aber noch die aktualisierte Product-ID des 3G-Modems im
HiLink-Modus. Dazu führt man erneut `lsusb` aus.

Die Product-Id sollte sich mittlerweile geändert haben:
```
Bus 001 Device 036: ID 12d1:14dc Huawei Technologies Co., Ltd.
```

Nun sind alle benötigten Werte gesammelt und man kann an das Ende der Datei
**/etc/usb_modeswitch.conf** folgendes einfügen:
{% highlight python %}
DefaultVendor = 0x12d1
DefaultProduct = 0x1f01

TargetVendor = 0x12d1
TargetProduct = 0x14dc

CheckSuccess = 1

MessageContent = "55534243123456780000000000000a11062000000000000100000000000000"
{% endhighlight %}

Um den Modus des Sticks beim Booten automatisch zu wechseln fügt man in der
Datei **/etc/rc.local** vor dem **exit 0** noch folgendes ein:
```
/usr/sbin/usb_modeswitch -c /etc/usb_modeswitch.conf
```

## Das Webinterface des 3g-Modems

Das tolle an den HiLink-Modems ist, dass sie sich wie bereits erwähnt als
USB-Ethernet Adapter anmelden können und die Konfiguration über ein Webinterface
erfolgt. Bei dem Huawei E3131 ist dieses unter der Adresse 192.168.8.1 zu
erreichen.
![Webinterface Huawei E3131]( {{ "assets/raspberry-pi-3g-hotspo/huawei_e3131_webinterface.jpg" | absolute_url }})

Die Einwahl in das Internet erfolgt automatisch, zur Not können im Webinterface
aber auch Änderungen vorgenommen werden.
Wem nur das 3G Internet auf dem Raspberry Pi wichtig ist, der kann hier
aufhören. Falls das Internet auch noch per Wlan an weitere Geräte verteilt
werden soll, lohnt es sich weiter zu lesen.

## 3G Internet per Hotspot verfügbar machen
Jetzt muss das Internet noch per Hotspot verfügbar gemacht werden. Dafür
installiert man zuerst die Pakete für Zugangspunkt, Netzwerkbrücke, DHCP-Server
und DNS-Server:
```
sudo apt-get install hostapd bridge-utils udhcpd dnsmasq
```
Als nächstes erstellt man mit hostapd ein verschlüsseltes oder unverschlüsseltes
Wlan-Netzwerk. Dies konfiguriert man in der Datei **/etc/hostapd/hostapd.conf**.

### Verschlüsseltes Netzwerk:
{% highlight python %}
bridge=br0
interface=wlan0
driver=nl80211
ssid=NameDesZugangspunktes
hw_mode=g
channel=6
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=Passphrase
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
{% endhighlight %}

### Offenes Netzwerk:
{% highlight python %}
bridge=br0
interface=wlan0
ssid=NameDesZugangspunktes
hw_mode=g
channel=6
auth_algs=1
{% endhighlight %}

Jetzt aktiviert man hostapd, in dem man in der Datei **/etc/default/hostapd**
die Zeile mit **DAEMON_CONF** einkommentiert und den Pfad
**/etc/hostapd/hostapd.conf** einträgt.

## Erstellen der Netzwerkbrücke zwischen dem 3g-Modem und dem Wlan-Hotspot

Die Netzwerkkonfiguration mit **bridge-utils** funktioniert nur mit der Datei
**/etc/network/interfaces**. Deswegen muss man dem dhcpcd mitteilen sich nicht
an den Netzwerkinterfaces der Bridge zu vergreifen. Dazu trägt man an der Datei
**/etc/dhcpcd.conf** folgendes ein:
```
denyinterfaces wlan0 eth1
```
Jetzt kann man die Datei **/etc/network/interfaces** der Bridge entsprechend
modifizieren.
{% highlight python %}
# localhost
auto lo
iface lo inet loopback

# LAN
auto eth0
allow-hotplug eth0
iface eth0 inet manual

# HiLink modem
auto eth1
allow-hotplug eth1
iface eth1 inet manual

# WLAN
auto wlan0
allow-hotplug wlan0
iface wlan0 inet manual

# Bridge
iface br0 inet static
  bridge_ports eth1 wlan0
  bridge_fd 0
  bridge_stp off
  address 192.168.8.2
  netmask 255.255.255.0
gateway 192.168.8.1
{% endhighlight %}

## Einrichten des DHCP-Servers

Anschließend konfiguriert man den DHCP-Server über die Datei
**/etc/udhcpd.conf** entsprechend dem HiLink-Modem:


{% highlight python %}
start           192.168.8.100
end             192.168.8.255

interface       br0

opt     dns     192.168.8.2 8.8.8.8 8.8.4.4           
opt     subnet  255.255.255.0
opt     router  192.168.8.1
opt lease 864000 # 10 days of seconds
{% endhighlight %}

Auf den Autostart der Bridge und des DHCP_Servers während dem Bootvorgang wird
hier bewusst verzichtet, da dieser vor dem Umschalten des USB-Modems in den
HiLink-Modus geschehen würde. Deswegen modifiziert man nochmals die Datei
**/etc/rc.local** und ersetzt die vorhin eingefügte Zeile durch
```
(/usr/sbin/usb_modeswitch -c /etc/usb_modeswitch.conf && /bin/sleep 5 && /sbin/ifup br0 &&; /usr/sbin/udhcpd /etc/udhcpd.conf)&
```

## Den DHCP-Server des 3g-Modems deaktivieren

Damit wird das 3G Modem während des Bootvorgangs in den HiLink-Modus versetzt,
anschließend wird 5 Sekunden gewartet und dann werden noch die Netzwerkbrücke
und der DHCP-Server gestartet.

Möglicherweise könnte der DHCP-Server mit dem des HiLink-Modems in die Quere
kommen. Dagegen hilft ein kleiner Hack mit Hilfe von **ebtables**.
Als erstes wird das Paket **ebtables** installiert:
```
sudo apt-get install ebtables
```
Danach erstellt man ein Skript, welches allen eingehenden und ausgehenden
Verkehr auf den Ports 67 und 68 (DHCP) an die Adresse des Modems blockiert unter
**/opt/setup_ebtables.sh**.

{% highlight bash %}
#! /bin/bash

# load modules
modprobe ebtables && modprobe ebtable_filter && modprobe ebt_ip

# DROP everything on ports 67 and 68 from and to 192.168.8.1
ebtables -I INPUT --protocol ipv4 --ip-protocol udp --ip-src 192.168.8.1 --ip-source-port 67:68 -j DROP
ebtables -I INPUT --protocol ipv4 --ip-protocol udp --ip-dst 192.168.8.1 --ip-source-port 67:68 -j DROP

ebtables -I INPUT --protocol ipv4 --ip-protocol udp --ip-src 192.168.8.1 --ip-destination-port 67:68 -j DROP
ebtables -I INPUT --protocol ipv4 --ip-protocol udp --ip-dst 192.168.8.1 --ip-destination-port 67:68 -j DROP

ebtables -I FORWARD  --protocol ipv4 --ip-protocol udp --ip-src 192.168.8.1 --ip-destination-port 67:68 -j DROP
ebtables -I FORWARD  --protocol ipv4 --ip-protocol udp --ip-dst 192.168.8.1 --ip-destination-port 67:68 -j DROP

ebtables -I FORWARD --protocol ipv4 --ip-protocol udp --ip-src 192.168.8.1 --ip-source-port 67:68 -j DROP
ebtables -I FORWARD --protocol ipv4 --ip-protocol udp --ip-dst 192.168.8.1 --ip-source-port 67:68 -j DROP
{% endhighlight %}

Das Skript macht man jetzt noch ausführbar mittels
```
sudo chmod +x /opt/setup_ebtables.sh
```
Schließlich sorgt man noch mithilfe eines Eintrages in der Datei
**/etc/rc.local** dafür, dass dieses Skript auch beim Start ausgeführt wird.
Dazu trägt man in der Datei **/etc/rc.local** noch **vor** der Zeile **exit 0**
folgendes ein: `/opt/setup_ebtables.sh`

## Den DNS-Server einrichten.

Der DNS-Server läuft bereits von allein, allerdings müssen für ihn noch 2
Einträge in der Datei **/etc/hosts** vorgenommen werden:
{% highlight bash %}
127.0.0.1     localhost
::1           localhost ip6-localhost ip6-loopback
ff02::1       ip6-allnodes
ff02::2       ip6-allrouters

127.0.1.1     raspberrypi

192.168.8.1   rout.er
192.168.8.2   raspberry.pi
{% endhighlight %}
Damit ist das Webinterface des Modems unter http://rout.er und der Raspberry Pi
unter http://raspberry.pi erreichbar.
