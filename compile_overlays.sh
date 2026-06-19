#!/system/bin/sh

export TMPDIR=/data/local/tmp

# Handle MODPATH location dynamically
if [ -d "/data/adb/modules_update/HideNavBar" ]; then
    MODPATH="/data/adb/modules_update/HideNavBar"
elif [ -d "/data/adb/modules/HideNavBar" ]; then
    MODPATH="/data/adb/modules/HideNavBar"
else
    echo "Error: HideNavBar module not found in /modules or /modules_update!"
    exit 1
fi

# Load saved WebUI configurations
if [ -f /data/adb/HideNavBar_config.sh ]; then
    . /data/adb/HideNavBar_config.sh
else
    echo "Configuration file /data/adb/HideNavBar_config.sh not found!"
    exit 1
fi

# Determine AAPT version to use first so the function can utilize it
chmod +x "$MODPATH"/tools/*
if "$MODPATH"/tools/aapt2 version >/dev/null 2>&1; then
    AAPT="aapt2"
elif "$MODPATH"/tools/aapt264 version >/dev/null 2>&1; then
    AAPT="aapt264"
else
    echo "Error: No compatible aapt2/aapt264 binary found!"
    exit 1
fi

# Determine Zipalign binary
if [ -f "$MODPATH/tools/zipalign" ]; then
    ZIPALIGN="$MODPATH/tools/zipalign"
elif [ -f "$MODPATH/tools/zipalign32" ]; then
    ZIPALIGN="$MODPATH/tools/zipalign32"
else
    ZIPALIGN=zipalign
fi

# Helper function to compile, zipalign (16KB aligned), and sign an overlay package
compile_and_sign_overlay() {
    # POSIX Parameter Map:
    # $1 = src_dir, $2 = unsigned_apk, $3 = signed_apk_destination, $4 = compile_out

    # Compile resources
    "$MODPATH"/tools/"$AAPT" compile -v --dir "$MODPATH"/Mods/"$1"/res -o "$MODPATH"/"$4" || return 1

    # Link resources against framework
    "$MODPATH"/tools/"$AAPT" link -v --no-resource-deduping -o "$MODPATH"/"$2" \
        -I /system/framework/framework-res.apk \
        --manifest "$MODPATH"/Mods/"$1"/AndroidManifest.xml \
        "$MODPATH"/"$4"/* || return 1

    # Align binary (16KB boundary for Android 15/16 compatibility)
    "$ZIPALIGN" -f -p 16 "$MODPATH"/"$2" "$MODPATH"/aligned.apk && \
        mv -f "$MODPATH"/aligned.apk "$MODPATH"/"$2" || return 1

    # Resolve the zipsigner jar once for both API levels
    local JAR=$(ls "$MODPATH"/tools/zipsigner*.jar 2>/dev/null | head -n 1)

    # Sign APK package OR move to destination if signing is bypassed
    if [ "$API" -ge 30 ]; then
        /apex/com.android.art/bin/dalvikvm -Djava.io.tmpdir="$TMPDIR" -Xnodex2oat -Xnoimage-dex2oat -cp "$JAR" com.topjohnwu.utils.ZipSigner "$MODPATH"/"$2" "$MODPATH"/"$3" 2>/dev/null \
        || /apex/com.android.art/bin/dalvikvm -Djava.io.tmpdir="$TMPDIR" -Xnoimage-dex2oat -cp "$JAR" com.topjohnwu.utils.ZipSigner "$MODPATH"/"$2" "$MODPATH"/"$3" || return 1
    elif [ "$API" -eq 29 ] && [ "$2" = "unsigned.apk" ]; then
        # Legacy signing for Android 10 gestural overlays (requires standard dalvikvm path)
        dalvikvm -Djava.io.tmpdir="$TMPDIR" -Xnodex2oat -Xnoimage-dex2oat -cp "$JAR" com.topjohnwu.utils.ZipSigner "$MODPATH"/"$2" "$MODPATH"/"$3" 2>/dev/null \
        || dalvikvm -Djava.io.tmpdir="$TMPDIR" -Xnoimage-dex2oat -cp "$JAR" com.topjohnwu.utils.ZipSigner "$MODPATH"/"$2" "$MODPATH"/"$3" || return 1
    else
        # Move the APK to the final destination
        mv -f "$MODPATH"/"$2" "$MODPATH"/"$3" || return 1
    fi

    return 0
}

API=$(getprop ro.build.version.sdk)

# Prepare clean directories
rm -rf "$MODPATH"/unsigned*.apk
rm -rf "$MODPATH"/compiled*
rm -rf "$MODPATH"/system/app
mkdir -p "$MODPATH"/system/app

rm -rf "$MODPATH"/Mods/Qtmp
mkdir -p "$MODPATH"/Mods/Qtmp
cp -rf "$MODPATH"/Mods/QS/* "$MODPATH"/Mods/Qtmp/

# Target XML dimension resource paths
RES="$MODPATH"/Mods/Qtmp/res/values/dimens.xml
PIXEL="$MODPATH"/Mods/HPS1/res/values/dimens.xml
STOCK="$MODPATH"/Mods/HPS2/res/values/dimens.xml
SONY="$MODPATH"/Mods/HPS3/res/values/dimens.xml
OP="$MODPATH"/Mods/HPS4/res/values/dimens.xml
NOTHING="$MODPATH"/Mods/HPS5/res/values/dimens.xml
HYPER="$MODPATH"/Mods/HPS6/res/values/dimens.xml
XOS="$MODPATH"/Mods/HPS7/res/values/dimens.xml

if [ "$API" -ge 29 ]; then
    # Inject user settings into temporary overlay sources
    sed -i -e "s/0.3/$BH/g" -e "s/0.1/$FH/g" -e "s/0.2/$GS/g" "$RES"
    for file in "$PIXEL" "$STOCK" "$SONY" "$OP" "$NOTHING" "$HYPER" "$XOS"; do
        sed -i -e "s/0.2/$BH/g" -e "s/0.1/$FH/g" "$file"
    done

    # Generate density/dimension subdirectories dynamically via loops
    for num in 1 2 3 4 5 6 7; do
        mkdir -p "$MODPATH"/Mods/HPS${num}/res/values-sw600dp-land/
    done
    for config in sw900dp sw600dp 440dpi xhdpi xxhdpi xxxhdpi; do
        mkdir -p "$MODPATH"/Mods/Qtmp/res/values-${config}/
    done

    # FIX: Prepare target directories directly inside system/app/
    mkdir -p "$MODPATH"/system/app/NavigationBarModeGestura/ \
             "$MODPATH"/system/app/P/ \
             "$MODPATH"/system/app/L/ \
             "$MODPATH"/system/app/O/ \
             "$MODPATH"/system/app/S/ \
             "$MODPATH"/system/app/N/ \
             "$MODPATH"/system/app/H/ \
             "$MODPATH"/system/app/X/

    mkdir -p "$MODPATH"/compiled
    for num in 2 3 4 5 6 7 8 9; do
        mkdir -p "$MODPATH"/compiled${num}
    done

    # Synchronize dimensions layout changes
    for num in 1 2 3 4 5 6 7; do
        cp -rf "$MODPATH"/Mods/HPS${num}/res/values/dimens.xml "$MODPATH"/Mods/HPS${num}/res/values-sw600dp-land/
    done
    for config in sw900dp sw600dp 440dpi xhdpi xxhdpi xxxhdpi; do
        cp -rf "$MODPATH"/Mods/Qtmp/res/values/dimens.xml "$MODPATH"/Mods/Qtmp/res/values-${config}/
    done

    # FIX: Compile overlays DIRECTLY to their system/app/ destinations
    compile_and_sign_overlay "Qtmp" "unsigned.apk" "system/app/NavigationBarModeGestura/NavigationBarModeGesturalOverlay.apk" "compiled" || { echo "Failed to compile Qtmp"; exit 1; }
    compile_and_sign_overlay "HPS1" "unsigned2.apk" "system/app/P/Pixel.apk" "compiled2" || { echo "Failed to compile HPS1"; exit 1; }
    compile_and_sign_overlay "HPS2" "unsigned3.apk" "system/app/L/L3.apk" "compiled3" || { echo "Failed to compile HPS2"; exit 1; }
    compile_and_sign_overlay "HPS3" "unsigned4.apk" "system/app/S/Sony.apk" "compiled4" || { echo "Failed to compile HPS3"; exit 1; }
    compile_and_sign_overlay "HPS4" "unsigned5.apk" "system/app/O/O.apk" "compiled5" || { echo "Failed to compile HPS4"; exit 1; }
    compile_and_sign_overlay "HPS5" "unsigned6.apk" "system/app/N/N.apk" "compiled6" || { echo "Failed to compile HPS5"; exit 1; }
    compile_and_sign_overlay "HPS6" "unsigned7.apk" "system/app/H/Hyper.apk" "compiled7" || { echo "Failed to compile HPS6"; exit 1; }
    compile_and_sign_overlay "HPS7" "unsigned8.apk" "system/app/X/Xos.apk" "compiled8" || { echo "Failed to compile HPS7"; exit 1; }

    if [ "$HKB" = true ]; then
        mkdir -p "$MODPATH"/system/app/HTK/
        compile_and_sign_overlay "HKBT" "unsigned9.apk" "system/app/HTK/HTK.apk" "compiled9" || { echo "Failed to compile HKBT"; exit 1; }
    fi

    # FIX: Cleanly copy conditional extras directly to system/app/ while blocking Q, QS, and Qtmp
    for var in "$VAR3" "$VAR4" "$VAR5"; do
        if [ "$var" != "a" ] && [ "$var" != "Q" ] && [ "$var" != "QS" ] && [ "$var" != "Qtmp" ] && [ -d "$MODPATH"/Mods/"$var" ]; then
            mkdir -p "$MODPATH"/system/app/"$var"
            cp -rf "$MODPATH"/Mods/"$var"/. "$MODPATH"/system/app/"$var"/ 2>/dev/null
        fi
    done

    if [ "$HKB" = true ] && [ -d "$MODPATH"/Mods/HKB ]; then
        mkdir -p "$MODPATH"/system/app/HKB
        cp -rf "$MODPATH"/Mods/HKB/. "$MODPATH"/system/app/HKB/ 2>/dev/null
    fi
fi

# Clean up temporary build folders AND leftover Qtmp source
rm -rf "$MODPATH"/compiled*
rm -rf "$MODPATH"/unsigned*.apk
rm -rf "$MODPATH"/Mods/Qtmp

# Apply dynamic (rebootless) back gesture configuration
if [ "$DBG" = true ]; then
    if [ "$SD" = "l" ]; then
        settings put secure back_gesture_inset_scale_left -1
        settings delete secure back_gesture_inset_scale_right &>/dev/null
    else
        settings put secure back_gesture_inset_scale_left -1
        settings put secure back_gesture_inset_scale_right -1
    fi
else
    settings delete secure back_gesture_inset_scale_left &>/dev/null
    settings delete secure back_gesture_inset_scale_right &>/dev/null
fi

echo "Compilation completed successfully!"
exit 0
