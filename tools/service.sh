#!/system/bin/sh

# ---------------------------------------------------------
# 1. KEYBOARD PROPERTY CHECK
# If none of the specific Rboard/Gboard modules are installed,
# adjust the Google Keyboard padding property.
# ---------------------------------------------------------
MOD_DIR="/data/adb/modules"

if [ ! -f "$MOD_DIR/rboard-themes_addon/system.prop" ] && \
   [ ! -f "$MOD_DIR/gboardnavbar/system.prop" ] && \
   [ ! -f "$MOD_DIR/rboard-themes/system.prop" ]; then

    # Apply the property only when the above files do NOT exist
    resetprop ro.com.google.ime.kb_pad_port_b 1.0

fi

# ---------------------------------------------------------
# 2. BOOT COMPLETION CHECK
# Wait in a loop until Android signals that booting is 100% finished.
# ---------------------------------------------------------
while [ "$(getprop sys.boot_completed | tr -d '\r')" != "1" ]; do
    sleep 1
done

# Give the system an extra 4 seconds to stabilize before applying overlays
sleep 4

# ---------------------------------------------------------
# 3. ENABLE OVERLAYS
# Loop through a predefined list of overlays to enable them
# one by one, pausing for 1 second between each.
# ---------------------------------------------------------
OVERLAYS="
com.android.internal.systemui.navobar.gestural
dan.overlaya
dan.overlayb
dan.overlayd
dan.overlaye
dan.aosp
dan.overlayf
dan.overlayg
dan.sonymobile
dan.oneplus
dan.nothing
com.dan.overlayi
dan.transsion
"

for overlay in $OVERLAYS; do
    cmd overlay enable "$overlay"
    sleep 1
done
