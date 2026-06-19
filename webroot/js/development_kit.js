const developmentResponse = {
  'cat /data/adb/HideNavBar_config.sh': {
    errno: 0,
    stdout: `GS=4000
BH=0
FH=0
HKB=true
DBG=false
SD=b
HD=true
VAR3=HP
VAR4=PH
VAR5=HL
GCAM=false`,
    stderr: ''
  },
  'grep "^version=" /data/adb/modules/HideNavBar/module.prop': {
    errno: 0,
    stdout: 'version=v30.0\n',
    stderr: ''
  },
  '/system/bin/getprop ro.build.version.sdk': {
    errno: 0,
    stdout: '34\n',
    stderr: ''
  },
  'getprop ro.build.version.sdk': {
    errno: 0,
    stdout: '34\n',
    stderr: ''
  },
  'getprop persist.sys.locale': {
    errno: 0,
    stdout: 'en-US\n',
    stderr: ''
  },
  'settings get system system_locales': {
    errno: 0,
    stdout: 'en-US\n',
    stderr: ''
  },
  'sh /data/adb/modules/HideNavBar/compile_overlays.sh': {
    errno: 0,
    stdout: 'Compilation completed successfully!\n',
    stderr: ''
  },
  'reboot': {
    errno: 0,
    stdout: 'Rebooting...\n',
    stderr: ''
  },
  'svc power reboot': {
    errno: 0,
    stdout: 'Rebooting...\n',
    stderr: ''
  }
}

export function getDevelopmentExecResponse(command) {
  if (developmentResponse[command]) {
    return developmentResponse[command]
  }

  // Handle writing config commands
  if (command.includes('HideNavBar_config.sh')) {
    return { errno: 0, stdout: 'Config updated\n', stderr: '' }
  }

  // Handle system settings adjustments
  if (command.includes('settings put secure') || command.includes('settings delete secure')) {
    return { errno: 0, stdout: '', stderr: '' }
  }

  return { errno: -1, stdout: '', stderr: `Command "${command}" not found in mock environment` }
}