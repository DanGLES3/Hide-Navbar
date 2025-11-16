#!/system/bin/sh
APIE=$(cat /system/build.prop | grep ro.build.version.sdk | cut -d '='-f2)
if [ -f /data/adb/modules/rboard-themes_addon/system.prop ] || [ -f /data/adb/modules/gboardnavbar/system.prop ] || [ -f /data/adb/modules/rboard-themes/system.prop ]; then
printf 'do nothing'
else
resetprop ro.com.google.ime.kb_pad_port_b 1.0
fi

 while [ "$(getprop sys.boot_completed | tr -d '\r')" != "1" ]; do sleep 1; done
 sleep 4
 cmd overlay enable com.android.internal.systemui.navobar.gestural
 sleep 1
 cmd overlay enable dan.overlaya
 sleep 1
 cmd overlay enable dan.overlayb
 sleep 1
 cmd overlay enable dan.overlayd
 sleep 1
 cmd overlay enable dan.overlaye
 sleep 1
 cmd overlay enable dan.overlayf
 sleep 1
 cmd overlay enable dan.overlayg
 sleep 1
 cmd overlay enable dan.sonymobile
 sleep 1
 cmd overlay enable dan.oneplus
 sleep 1
 cmd overlay enable com.dan.overlayi
