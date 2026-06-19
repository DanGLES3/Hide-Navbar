##########################################################################################
#
# NavTweaks / HideNavBar - Custom Installation Logic
#
##########################################################################################

# ----------------------------------------------------------------------------------------
# 0. INITIALIZE LANGUAGE & CHECK FOR METAMODULES
# ----------------------------------------------------------------------------------------
LANG=$(settings get system system_locales)
LANGS=$(echo "${LANG:0:2}")

# Verify locale files exist, otherwise default to English
if [ -f "$MODPATH"/Lang/"$LANGS"/"$LANGS"10.txt ]; then
    :
else
    LANGS=en
fi

LNG="$MODPATH"/Lang/"$LANGS"/"$LANGS"

if [ -d "/data/adb/ksu" ] || [ -d "/data/adb/ap" ]; then
    METAMODULE_FOUND=false
    METAMODULE_DISABLED=false
    for PROP in /data/adb/modules/*/module.prop; do
        [ -f "$PROP" ] || continue
        if grep -qE "^metamodule=(1|true)" "$PROP"; then
            MODDIR=$(dirname "$PROP")
            if [ -f "$MODDIR/disable" ]; then
                METAMODULE_DISABLED=true
            else
                METAMODULE_FOUND=true
                break
            fi
        fi
    done
    if ! $METAMODULE_FOUND; then
        if $METAMODULE_DISABLED; then
            cat "$LNG"14.txt
        else
            cat "$LNG"13.txt
        fi
        sleep 10
        am start -a android.intent.action.VIEW -d "https://github.com/Hybrid-Mount/meta-hybrid_mount/releases" >/dev/null 2>&1
        abort "! No active metamodule found. Aborting!"
    fi
fi

# ----------------------------------------------------------------------------------------
# 1. LOAD CONFIGURATION OR COMMENCE INTERACTIVE VOLUME KEY SETUP
# ----------------------------------------------------------------------------------------
if [ -f /data/adb/HideNavBar_config.sh ] && $KSU; then
    ui_print "     Loading saved configuration..."
    . /data/adb/HideNavBar_config.sh
else
    # First time installation: fall back to volume key prompts

    # Step A: Hide navigation bar
    cat "$LNG"10.txt
    if $VKSEL; then
         BH=0.0
         SS=true
         HIDE=true
         VAR3=a
    else
         FH=48.0
         BH=18.0
         SS=true
    fi

    # Step B: Hide keyboard space
    if [ "$HIDE" = true ] ; then
         cat "$LNG"11.txt
         if $VKSEL; then
              FH=0.0
              SS=true
              HKB=true
              VAR5=HL
              VAR4=PH
              VAR3=a
         else
              FH=48.0
              SS=true
         fi
    fi

    # Step C: Hide gesture pill
    if [ "$HIDE" = true ] ; then
         if [ "$FH" = 48.0 ] ; then
              cat "$LNG"2.txt
              if $VKSEL; then
              VAR3=HP
              VAR4=PH
              VAR5=HL
              HD=true
              else
              VAR3=a
              VAR4=a
              VAR5=a
              fi
         fi
    fi

    # Step D: Hide keyboard buttons
    if [ "$API" -ge 29 ]; then
     if [ "$FH" = 48.0 ] ; then
      cat "$LNG"8.txt
      if $VKSEL; then
      HKB=true
      else
      HKB=false
      fi
     fi
    fi

    # Step E: Reduce space under keyboard
    if [ "$FH" = 48.0 ] ; then
         cat "$LNG"3.txt
         if $VKSEL; then
         FH=16.0
         fi
    fi

    # Step F: Disable bottom gestures
    if [ "$HIDE" = true ] ; then
         cat "$LNG"12.txt
         if $VKSEL; then
         GS=0.0
         SS=false
         else
         GS=32.0
         fi
    fi

    # Step G: Gesture sensitivity
    if [ "$SS" = true ] ; then
         cat "$LNG"4.txt
         if $VKSEL; then
         GS=18.0
         else
         GS=32.0
         fi
    fi

    # Step H: Workaround theme pill (GCam Fix)
    if [ "$SS" = true ] ; then
         cat "$LNG"9.txt
         if $VKSEL; then
          if [ "$FH" = 0 ] ; then
          BH=1.0
          FH=1.0
          else
          BH=1.0
          fi
          GCAM=true
         else
          GCAM=false
         fi
    fi

    # Step I: Disable back gesture (Android 10 Q)
    if [ "$API" -eq 29 ] && [ "$FH" = 0.0 ] ; then
         cat "$LNG"5.txt
         if $VKSEL; then
         cp -rf "$MODPATH"/Mods/DBGQ/* "$MODPATH"
         fi
    fi

    # Step J: Disable back gesture (Android 11+ R+)
    if [ "$API" -ge 30 ] ; then
         cat "$LNG"5.txt
         if $VKSEL; then
         DBG=true
         else
         DBG=false
         settings delete secure back_gesture_inset_scale_left &>/dev/null
         settings delete secure back_gesture_inset_scale_right &>/dev/null
         fi
    fi

    # Step K: Disable back side selector
    if [ "$DBG" = true ] ; then
         cat "$LNG"6.txt
         if $VKSEL; then
         SD=l
         settings put secure back_gesture_inset_scale_left -1 &>/dev/null
         else
         SD=b
         settings put secure back_gesture_inset_scale_left -1 &>/dev/null
         settings put secure back_gesture_inset_scale_right -1 &>/dev/null
         fi
    fi

    if [ "$DBG" = true ] ; then
        cat "$LNG"7.txt
    fi
    
    # Save parameters
    echo "GS=$GS" > /data/adb/HideNavBar_config.sh
    echo "BH=$BH" >> /data/adb/HideNavBar_config.sh
    echo "FH=$FH" >> /data/adb/HideNavBar_config.sh
    echo "HKB=$HKB" >> /data/adb/HideNavBar_config.sh
    echo "DBG=$DBG" >> /data/adb/HideNavBar_config.sh
    echo "SD=$SD" >> /data/adb/HideNavBar_config.sh
    echo "HD=$HD" >> /data/adb/HideNavBar_config.sh
    echo "VAR3=$VAR3" >> /data/adb/HideNavBar_config.sh
    echo "VAR4=$VAR4" >> /data/adb/HideNavBar_config.sh
    echo "VAR5=$VAR5" >> /data/adb/HideNavBar_config.sh
    echo "GCAM=$GCAM" >> /data/adb/HideNavBar_config.sh
fi

# ----------------------------------------------------------------------------------------
# 2. COMPILE OVERLAYS AND RUN DEPLOYMENT
# ----------------------------------------------------------------------------------------
ui_print "     Compiling overlays..."
sh "$MODPATH"/compile_overlays.sh

# Deploy boot-service runner script to module root
cp -rf "$MODPATH"/tools/service.sh "$MODPATH"

# ----------------------------------------------------------------------------------------
# 3. KERNELSU SYSTEMUI PERMISSIONS WARNING
# ----------------------------------------------------------------------------------------
if [ -d "/data/adb/ksud" ]; then
    ui_print ""
    ui_print "     For KernelSU make sure to give disable unmount for SystemUI and the system launcher"
fi

ui_print "     Complete"
