   ##########################################################################################
# Custom Logic
#########################################################   ##########################################################################################
# Custom Logic
##########################################################################################

#Detect and use compatible AAPT
chmod +x "$MODPATH"/tools/*
if $($MODPATH/tools/aapt2 version >/dev/null 2>&1); then
    AAPT=aapt2
elif $($MODPATH/tools/aapt264 version >/dev/null 2>&1); then
    AAPT=aapt264
fi
cp -af "$MODPATH"/tools/$AAPT "$MODPATH"/aapt2
mkdir -p "$MODPATH"/Mods/Q/NavigationBarModeGestura/
mkdir -p "$MODPATH"/Mods/Qtmp/
mkdir -p "$MODPATH"/system/app/
cp -rf "$MODPATH"/Mods/QS/* "$MODPATH"/Mods/Qtmp/
cp -rf "$MODPATH"/tools/service.sh "$MODPATH"

#if [ -d /system/xbin/ ] && [ ! -f /system/xbin/empty ] ; then
#    mkdir -p "$MODPATH"/system/xbin/
#    cp -rf "$MODPATH"/tools/hn "$MODPATH"/system/xbin/
#    cp -rf "$MODPATH"/tools/hnr "$MODPATH"/system/xbin/
#else
#    mkdir -p "$MODPATH"/system/bin/
#    cp -rf "$MODPATH"/tools/hn "$MODPATH"/system/bin/
#    cp -rf "$MODPATH"/tools/hnr "$MODPATH"/system/bin/
#fi

#Find and delete conflicting overlays/package-cache/resource-cache
find /data/adb/modules -type d -not -path "*HideNavBar/system*" -iname "*navigationbarmodegestural*" -exec rm -rf {} \; 2>/dev/null
find /data/system/package_cache -type f -iname "*NavigationBarMode*" -exec rm -rf {} \; 2>/dev/null
find /data/resource-cache -type f -iname "*NavigationBarMode*" -exec rm -rf {} \; 2>/dev/null
find /data/resource-cache -type f -iname "*P" -exec rm -rf {} \; 2>/dev/null
find /data/resource-cache -type f -iname "*HL" -exec rm -rf {} \; 2>/dev/null
find /data/resource-cache -type f -iname "*L" -exec rm -rf {} \; 2>/dev/null
find /data/resource-cache -type f -iname "*PH" -exec rm -rf {} \; 2>/dev/null

#Detect system language for translation
LANG=$(settings get system system_locales)
LANGS=$(echo "${LANG:0:2}" )
if [ -f "$MODPATH"/Lang/"$LANGS"/"$LANGS"10.txt ]; then
    :
else
    LANGS=en
fi

LNG="$MODPATH"/Lang/"$LANGS"/"$LANGS"

#Standard volume selector stuff but with translations
#Hiding navbar or not
cat "$LNG"10.txt
if $VKSEL; then
   if [ "$API" -ge 35 ]; then
      BH=1.0
   else
      BH=0.0
   fi
     SS=true
     HIDE=true
     VAR3=a
else
     FH=48.0
     BH=18.0
     SS=true
fi

#Hiding keyboard bar
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

#Hide pill
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

#Hide Keyboard buttons
if [ "$API" -ge 29 ]; then
 if [ "$FH" = 48.0 ] ; then
  cat "$LNG"8.txt
  if $VKSEL; then
  HKB=true
  else
  HKB=false
  fi
 fi
else
 :
fi

#Small keyboard bar
if [ "$FH" = 48.0 ] ; then
     cat "$LNG"3.txt
     if $VKSEL; then
     FH=16.0
     else
     :
     fi
fi

#Disabling bottom gestures
if [ "$HIDE" = true ] ; then
     cat "$LNG"12.txt
     if $VKSEL; then
     GS=0.0
     SS=false
     else
     GS=32.0
     fi
fi

#Gesture sensitivity
if [ "$SS" = true ] ; then
     cat "$LNG"4.txt
     if $VKSEL; then
     GS=18.0
     else
     GS=32.0
     fi
fi

#Gcam fix on A14 and below
if [ "$SS" = true ] && [ "$API" -le 34 ] ; then
     cat "$LNG"9.txt
     if $VKSEL; then
      if [ "$FH" = 0.0 ] ; then
      BH=1.0
      FH=1.0
      else
      BH=1.0
      fi
     else
      :
     fi
fi

#Disable back gesture on Q
if [ "$API" -eq 29 ] && [ "$FH" = 0.0 ] ; then
     cat "$LNG"5.txt
     if $VKSEL; then
     cp -rf "$MODPATH"/Mods/DBGQ/* "$MODPATH"
     else
     :
     fi
fi

#Disable back gesture on R+
#Reenable back gesture if no is selected
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

#Left or both sides
if [ "$DBG" = true ] ; then
     cat "$LNG"6.txt
     if $VKSEL; then
     settings put secure back_gesture_inset_scale_left -1 &>/dev/null
     else
     settings put secure back_gesture_inset_scale_left -1 &>/dev/null
     settings put secure back_gesture_inset_scale_right -1 &>/dev/null
     fi
fi

#Back gesture warning
if [ "$DBG" = true ] ; then
    cat "$LNG"7.txt
fi

#Write to overlay resources
RES="$MODPATH"/Mods/Qtmp/res/values/dimens.xml
LRES="$MODPATH"/Mods/HPS1/res/values/dimens.xml
LRESS="$MODPATH"/Mods/HPS2/res/values/dimens.xml

#Folder creation and etc
if [ "$API" -ge 29 ]; then
sed -i s/0.3/"$BH"/g "$RES"
sed -i s/0.2/"$BH"/g "$LRES"
sed -i s/0.2/"$BH"/g "$LRESS"
sed -i s/0.1/"$FH"/g "$LRES"
sed -i s/0.1/"$FH"/g "$LRESS"
sed -i s/0.1/"$FH"/g "$RES"
sed -i s/0.2/"$GS"/g "$RES"
mkdir -p "$MODPATH"/Mods/Qtmp/res/values-sw900dp/
mkdir -p "$MODPATH"/Mods/Qtmp/res/values-sw600dp/
mkdir -p "$MODPATH"/Mods/HPS1/res/values-sw600dp-land/
mkdir -p "$MODPATH"/Mods/HPS2/res/values-sw600dp-land/
mkdir -p "$MODPATH"/Mods/Qtmp/res/values-440dpi/
mkdir -p "$MODPATH"/Mods/Qtmp/res/values-xhdpi/
mkdir -p "$MODPATH"/Mods/Qtmp/res/values-xxhdpi/
mkdir -p "$MODPATH"/Mods/Qtmp/res/values-xxxhdpi/
mkdir -p "$MODPATH"/Mods/P/
mkdir -p "$MODPATH"/Mods/L/
mkdir -p "$MODPATH"/Mods/HTK/
mkdir "$MODPATH"/compiled
mkdir "$MODPATH"/compiled2
mkdir "$MODPATH"/compiled3
mkdir "$MODPATH"/compiled6
cp -rf "$MODPATH"/Mods/Qtmp/res/values/dimens.xml "$MODPATH"/Mods/Qtmp/res/values-sw900dp/
cp -rf "$MODPATH"/Mods/HPS1/res/values/dimens.xml "$MODPATH"/Mods/HPS1/res/values-sw600dp-land/
cp -rf "$MODPATH"/Mods/HPS2/res/values/dimens.xml "$MODPATH"/Mods/HPS2/res/values-sw600dp-land/
cp -rf "$MODPATH"/Mods/Qtmp/res/values/dimens.xml "$MODPATH"/Mods/Qtmp/res/values-sw600dp/
cp -rf "$MODPATH"/Mods/Qtmp/res/values/dimens.xml "$MODPATH"/Mods/Qtmp/res/values-440dpi/
cp -rf "$MODPATH"/Mods/Qtmp/res/values/dimens.xml "$MODPATH"/Mods/Qtmp/res/values-xhdpi/
cp -rf "$MODPATH"/Mods/Qtmp/res/values/dimens.xml "$MODPATH"/Mods/Qtmp/res/values-xxhdpi/
cp -rf "$MODPATH"/Mods/Qtmp/res/values/dimens.xml "$MODPATH"/Mods/Qtmp/res/values-xxxhdpi/
fi

#Detect original overlay location
#OP=$(find /system/overlay /product/overlay /vendor/overlay /system_ext/overlay -type d -iname "navigationbarmodegestural" | cut -d 'N' -f1)

#Building overlays
if [ "$API" -ge 29 ]; then
    "$MODPATH"/aapt2 compile -v --dir "$MODPATH"/Mods/Qtmp/res -o "$MODPATH"/compiled && \
    "$MODPATH"/aapt2 link -v --no-resource-deduping -o "$MODPATH"/unsigned.apk -I /system/framework/framework-res.apk \
    --manifest "$MODPATH"/Mods/Qtmp/AndroidManifest.xml "$MODPATH"/compiled/*

    "$MODPATH"/aapt2 compile -v --dir "$MODPATH"/Mods/HPS1/res -o "$MODPATH"/compiled2 && \
    "$MODPATH"/aapt2 link -v --no-resource-deduping -o "$MODPATH"/unsigned2.apk -I /system/framework/framework-res.apk \
    --manifest "$MODPATH"/Mods/HPS1/AndroidManifest.xml "$MODPATH"/compiled2/*

    "$MODPATH"/aapt2 compile -v --dir "$MODPATH"/Mods/HPS2/res -o "$MODPATH"/compiled3 && \
    "$MODPATH"/aapt2 link -v --no-resource-deduping -o "$MODPATH"/unsigned3.apk -I /system/framework/framework-res.apk \
    --manifest "$MODPATH"/Mods/HPS2/AndroidManifest.xml "$MODPATH"/compiled3/*
fi

if [ "$HKB" = true ]; then
    "$MODPATH"/aapt2 compile -v --dir "$MODPATH"/Mods/HKBT/res -o "$MODPATH"/compiled6 && \
    "$MODPATH"/aapt2 link -v --no-resource-deduping -o "$MODPATH"/unsigned6.apk -I /system/framework/framework-res.apk \
    --manifest "$MODPATH"/Mods/HKBT/AndroidManifest.xml "$MODPATH"/compiled6/*

    "$MODPATH"/tools/zipsigner "$MODPATH"/unsigned6.apk "$MODPATH"/Mods/HTK/HTK.apk

     cp -rf "$MODPATH"/Mods/HTK/ "$MODPATH"/system/app/
fi

#Signing
if [ "$API" -ge 30 ]; then
"$MODPATH"/tools/zipsigner "$MODPATH"/unsigned.apk "$MODPATH"/Mods/Q/NavigationBarModeGestura/NavigationBarModeGesturalOverlay.apk
"$MODPATH"/tools/zipsigner "$MODPATH"/unsigned2.apk "$MODPATH"/Mods/P/Pixel.apk
"$MODPATH"/tools/zipsigner "$MODPATH"/unsigned3.apk "$MODPATH"/Mods/L/L3.apk
elif [ "$API" -eq 29 ] ; then
"$MODPATH"/tools/zipsignero "$MODPATH"/unsigned.apk "$MODPATH"/Mods/Q/NavigationBarModeGestura/NavigationBarModeGesturalOverlay.apk
fi

#Install overlays
if [ "$API" -ge 29 ]; then
mkdir -p "$MODPATH"/system"$OP"
cp -rf "$MODPATH"/Mods/Q/* "$MODPATH"/Mods/P/ "$MODPATH"/Mods/L/ "$MODPATH"/Mods/"$VAR3"/ "$MODPATH"/Mods/"$VAR4"/ "$MODPATH"/Mods/"$VAR5"/ "$MODPATH"/system/app/
 if [ "$HKB" = true ]; then
 cp -rf "$MODPATH"/Mods/HKB/ "$MODPATH"/system/app/
 fi
fi

#Cleanup
rm -rf "$MODPATH"/system/app/Mods/
rm -rf "$MODPATH"/system/app/dummy
rm -rf "$MODPATH"/compiled/
rm -rf "$MODPATH"/compiled2/
rm -rf "$MODPATH"/compiled3/
rm -rf "$MODPATH"/compiled6/
rm -rf "$MODPATH"/unsigned.apk
rm -rf "$MODPATH"/unsigned2.apk
rm -rf "$MODPATH"/unsigned3.apk
rm -rf "$MODPATH"/unsigned6.apk

if [ -d "/data/adb/ksud" ]; then
    ui_print ""
    ui_print "     For KernelSU make sure to give SystemUI superuser access"
    ui_print "     or make sure unmount modules is disabled to SystemUI in the superuser menu"
fi


ui_print "     Complete"

chmod 755 /data/adb/modules/HideNavBar/

