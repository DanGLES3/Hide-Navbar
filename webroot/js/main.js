import { exec, toast } from './kernelsu.js';

// Fully localized dictionaries for all 10 module languages
const translations = {
  en: {
    ui_title: "NavTweaks Settings",
    ui_subtitle: "Customize system navigation gestures & navbar size",
    section_navbar: "Navigation Bar",
    lbl_hide_navbar: "Hide Navigation Bar",
    desc_hide_navbar: "Remove the navigation bar completely",
    lbl_navbar_height: "Navbar Height",
    desc_navbar_height: "Set custom height for the gesture area",
    lbl_gesture_sensitivity: "Gesture Sensitivity",
    desc_gesture_sensitivity: "Change sensitivity of the home gesture",
    section_keyboard: "Keyboard Space",
    lbl_keyboard_space: "Space Under Keyboard",
    desc_keyboard_space: "Choose how much blank space remains under your keyboard",
    opt_kb_default: "Default Space",
    opt_kb_reduced: "Reduced Space",
    opt_kb_hidden: "Hide Space completely",
    lbl_hide_keyboard_buttons: "Hide Buttons Under Keyboard",
    desc_hide_keyboard_buttons: "Hide back and keyboard-switcher icons below the keys",
    lbl_hide_pill: "Hide Gesture Pill / Hint",
    desc_hide_pill: "Hide the horizontal navigation bar line/pill",
    section_back_gestures: "Back Gestures",
    lbl_disable_back: "Disable Going Back Gesture",
    desc_disable_back: "Turn off system edge back swipes (applied instantly!)",
    lbl_back_side: "Disable Side Mode",
    desc_back_side: "Choose which swipe edge is disabled",
    opt_side_left: "Left Side Only",
    opt_side_both: "Both Sides",
    section_advanced: "Advanced Tweaks",
    lbl_disable_home: "Disable Home/Recents Gestures",
    desc_disable_home: "Completely disables bottom gestures (ideal for custom gesture apps)",
    lbl_gcam_fix: "Theme Matching Workaround",
    desc_gcam_fix: "Fixes gesture pill coloring issues (may not work on all devices)",
    lbl_reboot_warn: "Some changes require a reboot to take effect.",
    btn_reboot: "Reboot",
    btn_apply: "Apply & Reboot",
    toast_saved: "Settings applied! Rebooting...",
    toast_rebooting: "Rebooting...",
    toast_error: "An error occurred: "
  },
  de: {
    ui_title: "NavTweaks Einstellungen",
    ui_subtitle: "Navigationsgesten & Höhe der Navigationsleiste anpassen",
    section_navbar: "Navigationsleiste",
    lbl_hide_navbar: "Navigationsleiste ausblenden",
    desc_hide_navbar: "Entfernt die Navigationsleiste vollständig",
    lbl_navbar_height: "Höhe der Leiste",
    desc_navbar_height: "Höhe des Gestenbereichs anpassen",
    lbl_gesture_sensitivity: "Gesten-Empfindlichkeit",
    desc_gesture_sensitivity: "Empfindlichkeit der Home-Geste ändern",
    section_keyboard: "Tastaturabstand",
    lbl_keyboard_space: "Abstand unter Tastatur",
    desc_keyboard_space: "Freien Platz unter der Tastatur festlegen",
    opt_kb_default: "Standardabstand",
    opt_kb_reduced: "Verringerter Abstand",
    opt_kb_hidden: "Abstand komplett ausblenden",
    lbl_hide_keyboard_buttons: "Tasten unter Tastatur ausblenden",
    desc_hide_keyboard_buttons: "Ausblenden der Zurück- und Tastaturwechsel-Symbole",
    lbl_hide_pill: "Gesten-Pille ausblenden",
    desc_hide_pill: "Blendet den horizontalen Gestenstrich aus",
    section_back_gestures: "Zurück-Gesten",
    lbl_disable_back: "Zurück-Geste deaktivieren",
    desc_disable_back: "Randwischgesten ausschalten (sofort wirksam!)",
    lbl_back_side: "Deaktivierungsseite",
    desc_back_side: "Bestimmen, welche Kante deaktiviert wird",
    opt_side_left: "Nur linke Seite",
    opt_side_both: "Beide Seiten",
    section_advanced: "Erweiterte Anpassungen",
    lbl_disable_home: "Start/Verlauf-Gesten deaktivieren",
    desc_disable_home: "Deaktiviert untere Gesten (ideal für Drittanbieter-Gesten-Apps)",
    lbl_gcam_fix: "Workaround für Pille-Farbe",
    desc_gcam_fix: "Behebt Probleme bei der Farbanpassung der Pille",
    lbl_reboot_warn: "Einige Änderungen erfordern einen Neustart.",
    btn_reboot: "Neustart",
    btn_apply: "Anwenden & Neustart",
    toast_saved: "Einstellungen übernommen! Neustart...",
    toast_rebooting: "Neustart...",
    toast_error: "Fehler aufgetreten: "
  },
  es: {
    ui_title: "Ajustes de NavTweaks",
    ui_subtitle: "Personaliza gestos del sistema y tamaño de barra de navegación",
    section_navbar: "Barra de Navegación",
    lbl_hide_navbar: "Ocultar Barra de Navegación",
    desc_hide_navbar: "Eliminar la barra de navegación por completo",
    lbl_navbar_height: "Altura de la Barra",
    desc_navbar_height: "Establece altura personalizada del área de gestos",
    lbl_gesture_sensitivity: "Sensibilidad de Gestos",
    desc_gesture_sensitivity: "Cambiar la sensibilidad del gesto de inicio",
    section_keyboard: "Espacio del Teclado",
    lbl_keyboard_space: "Espacio Bajo el Teclado",
    desc_keyboard_space: "Elige cuánto espacio en blanco queda bajo el teclado",
    opt_kb_default: "Espacio Predeterminado",
    opt_kb_reduced: "Espacio Reducido",
    opt_kb_hidden: "Ocultar Espacio Completamente",
    lbl_hide_keyboard_buttons: "Ocultar Botones Bajo el Teclado",
    desc_hide_keyboard_buttons: "Ocultar iconos de retroceso y cambio de teclado",
    lbl_hide_pill: "Ocultar Píldora de Gestos",
    desc_hide_pill: "Ocultar la línea o píldora horizontal de navegación",
    section_back_gestures: "Gestos de Retroceso",
    lbl_disable_back: "Desactivar Gesto de Retroceso",
    desc_disable_back: "Desactiva los deslizamientos laterales para volver (¡aplicado al instante!)",
    lbl_back_side: "Modo de Desactivación",
    desc_back_side: "Elige qué borde de deslizamiento desactivar",
    opt_side_left: "Solo Lado Izquierdo",
    opt_side_both: "Ambos Lados",
    section_advanced: "Ajustes Avanzados",
    lbl_disable_home: "Desactivar Gestos de Inicio/Recientes",
    desc_disable_home: "Desactiva gestos inferiores (ideal para apps de gestos personalizadas)",
    lbl_gcam_fix: "Solución de Tema de Píldora",
    desc_gcam_fix: "Corrige problemas de color de la píldora (GCam fix)",
    lbl_reboot_warn: "Algunos cambios requieren un reinicio para aplicarse.",
    btn_reboot: "Reiniciar",
    btn_apply: "Aplicar y Reiniciar",
    toast_saved: "¡Ajustes aplicados! Reiniciando...",
    toast_rebooting: "Reiniciando...",
    toast_error: "Ocurrió un error: "
  },
  fr: {
    ui_title: "Paramètres NavTweaks",
    ui_subtitle: "Personnaliser les gestes système & la taille de la barre",
    section_navbar: "Barre de Navigation",
    lbl_hide_navbar: "Masquer la Barre de Navigation",
    desc_hide_navbar: "Supprimer complètement la barre de navigation",
    lbl_navbar_height: "Hauteur de la Barre",
    desc_navbar_height: "Régler la hauteur de la zone de gestes",
    lbl_gesture_sensitivity: "Sensibilité des Gestes",
    desc_gesture_sensitivity: "Modifier la sensibilité du geste d'accueil",
    section_keyboard: "Espace sous le Clavier",
    lbl_keyboard_space: "Espace sous le Clavier",
    desc_keyboard_space: "Choisir la quantité d'espace vide sous le clavier",
    opt_kb_default: "Espace par Défaut",
    opt_kb_reduced: "Espace Réduit",
    opt_kb_hidden: "Masquer Complètement l'Espace",
    lbl_hide_keyboard_buttons: "Masquer les Boutons sous le Clavier",
    desc_hide_keyboard_buttons: "Masquer les icônes de retour et de changement de clavier",
    lbl_hide_pill: "Masquer la Pilule de Geste",
    desc_hide_pill: "Masquer la ligne horizontale de navigation (pilule)",
    section_back_gestures: "Gestes de Retour",
    lbl_disable_back: "Désactiver le Geste de Retour",
    desc_disable_back: "Désactiver les glissements latéraux pour revenir (appliqué instantanément !)",
    lbl_back_side: "Côté Désactivé",
    desc_back_side: "Choisir quel côté de l'écran est désactivé",
    opt_side_left: "Côté Gauche Uniquement",
    opt_side_both: "Des Deux Côtés",
    section_advanced: "Options Avancées",
    lbl_disable_home: "Désactiver Gestes Accueil/Récents",
    desc_disable_home: "Désactive les gestes du bas (idéal pour les applications de gestes tierces)",
    lbl_gcam_fix: "Correctif de Thème de Pilule",
    desc_gcam_fix: "Résout les problèmes de coloration de la pilule (GCam fix)",
    lbl_reboot_warn: "Certains changements nécessitent un redémarrage.",
    btn_reboot: "Redémarrer",
    btn_apply: "Appliquer & Redémarrer",
    toast_saved: "Paramètres appliqués ! Redémarrage...",
    toast_rebooting: "Redémarrage...",
    toast_error: "Une erreur est survenue : "
  },
  id: {
    ui_title: "Pengaturan NavTweaks",
    ui_subtitle: "Sesuaikan gerakan navigasi sistem & ukuran bilah navigasi",
    section_navbar: "Bilah Navigasi",
    lbl_hide_navbar: "Sembunyikan Bilah Navigasi",
    desc_hide_navbar: "Hapus bilah navigasi sepenuhnya",
    lbl_navbar_height: "Tinggi Bilah",
    desc_navbar_height: "Atur tinggi khusus untuk area gerakan",
    lbl_gesture_sensitivity: "Sensitivitas Gerakan",
    desc_gesture_sensitivity: "Ubah sensitivitas gerakan beranda",
    section_keyboard: "Ruang Keyboard",
    lbl_keyboard_space: "Ruang di Bawah Keyboard",
    desc_keyboard_space: "Pilih seberapa banyak ruang kosong di bawah keyboard Anda",
    opt_kb_default: "Ruang Default",
    opt_kb_reduced: "Ruang Dikurangi",
    opt_kb_hidden: "Sembunyikan Ruang Sepenuhnya",
    lbl_hide_keyboard_buttons: "Sembunyikan Tombol di Bawah Keyboard",
    desc_hide_keyboard_buttons: "Sembunyikan ikon kembali dan pengalih keyboard",
    lbl_hide_pill: "Sembunyikan Pil Gerakan",
    desc_hide_pill: "Sembunyikan garis/pil navigasi horizontal",
    section_back_gestures: "Gerakan Kembali",
    lbl_disable_back: "Nonaktifkan Gerakan Kembali",
    desc_disable_back: "Matikan usapan tepi sistem untuk kembali (langsung diterapkan!)",
    lbl_back_side: "Sisi yang Dinonaktifkan",
    desc_back_side: "Pilih tepi usapan mana yang dinonaktifkan",
    opt_side_left: "Hanya Sisi Kiri",
    opt_side_both: "Kedua Sisi",
    section_advanced: "Tweaks Lanjutan",
    lbl_disable_home: "Nonaktifkan Gerakan Beranda/Terbaru",
    desc_disable_home: "Nonaktifkan gerakan bawah sepenuhnya (cocok untuk aplikasi gerakan kustom)",
    lbl_gcam_fix: "Perbaikan Tema Pil",
    desc_gcam_fix: "Perbaiki masalah pewarnaan pil gerakan (GCam fix)",
    lbl_reboot_warn: "Beberapa perubahan memerlukan reboot untuk diterapkan.",
    btn_reboot: "Reboot",
    btn_apply: "Terapkan & Reboot",
    toast_saved: "Pengaturan diterapkan! Reboot...",
    toast_rebooting: "Reboot...",
    toast_error: "Terjadi kesalahan: "
  },
  it: {
    ui_title: "Impostazioni NavTweaks",
    ui_subtitle: "Personalizza gesti di sistema e dimensioni barra di navigazione",
    section_navbar: "Barra di Navigazione",
    lbl_hide_navbar: "Nascondi Barra di Navigazione",
    desc_hide_navbar: "Rimuovi completamente la barra di navigazione",
    lbl_navbar_height: "Altezza Barra",
    desc_navbar_height: "Imposta un'altezza personalizzata per l'area gesti",
    lbl_gesture_sensitivity: "Sensibilità Gesti",
    desc_gesture_sensitivity: "Modifica la sensibilità del gesto home",
    section_keyboard: "Spazio Tastiera",
    lbl_keyboard_space: "Spazio Sotto la Tastiera",
    desc_keyboard_space: "Scegli quanto spazio vuoto lasciare sotto la tastiera",
    opt_kb_default: "Spazio Predefinito",
    opt_kb_reduced: "Spazio Ridotto",
    opt_kb_hidden: "Nascondi Spazio Completamente",
    lbl_hide_keyboard_buttons: "Nascondi Pulsanti Sotto Tastiera",
    desc_hide_keyboard_buttons: "Nascondi i pulsanti indietro e cambio tastiera sotto i tasti",
    lbl_hide_pill: "Nascondi Pillola dei Gesti",
    desc_hide_pill: "Nascondi la linea/pillola di navigazione orizzontale",
    section_back_gestures: "Gesti Indietro",
    lbl_disable_back: "Disattiva Gesto Indietro",
    desc_disable_back: "Disattiva i gesti laterali per tornare indietro (applicato all'istante!)",
    lbl_back_side: "Lato Disattivato",
    desc_back_side: "Scegli quale bordo laterale disattivare",
    opt_side_left: "Solo Lato Sinistro",
    opt_side_both: "Entrambi i Lati",
    section_advanced: "Impostazioni Avanzate",
    lbl_disable_home: "Disattiva Gesti Home/Recenti",
    desc_disable_home: "Disattiva completamente i gesti inferiori (ideale per app di gesti terze)",
    lbl_gcam_fix: "Correzione Colore Pillola",
    desc_gcam_fix: "Risolve problemi di colore della pillola (GCam fix)",
    lbl_reboot_warn: "Alcune modifiche richiedono il riavvio per essere applicate.",
    btn_reboot: "Riavvia",
    btn_apply: "Applica & Riavvia",
    toast_saved: "Impostazioni applicate! Riavvio...",
    toast_rebooting: "Riavvio...",
    toast_error: "Si è verificato un errore: "
  },
  pt: {
    ui_title: "Configurações do NavTweaks",
    ui_subtitle: "Personalizar gestos de navegação e tamanho da barra",
    section_navbar: "Barra de Navegação",
    lbl_hide_navbar: "Ocultar Barra de Navegação",
    desc_hide_navbar: "Remover a barra de navegação completamente",
    lbl_navbar_height: "Altura da Barra",
    desc_navbar_height: "Definir altura personalizada da área de gestos",
    lbl_gesture_sensitivity: "Sensibilidade dos Gestos",
    desc_gesture_sensitivity: "Alterar sensibilidade do gesto inicial (Home)",
    section_keyboard: "Espaço do Teclado",
    lbl_keyboard_space: "Espaço Sob o Teclado",
    desc_keyboard_space: "Escolher o espaço em branco restante sob o teclado",
    opt_kb_default: "Espaço Padrão",
    opt_kb_reduced: "Espaço Reduzido",
    opt_kb_hidden: "Ocultar Espaço Completamente",
    lbl_hide_keyboard_buttons: "Ocultar Botões Sob o Teclado",
    desc_hide_keyboard_buttons: "Ocultar ícones de voltar e trocar teclado",
    lbl_hide_pill: "Ocultar Barra / Pílula de Gestos",
    desc_hide_pill: "Ocultar a linha horizontal de navegação (pílula)",
    section_back_gestures: "Gestos de Voltar",
    lbl_disable_back: "Desativar Gesto de Voltar",
    desc_disable_back: "Desativar deslizamentos laterais para voltar (aplicado instantaneamente!)",
    lbl_back_side: "Lado Desativado",
    desc_back_side: "Escolher qual borda de deslizamento é desativada",
    opt_side_left: "Apenas Lado Esquerdo",
    opt_side_both: "Ambos os Lados",
    section_advanced: "Ajustes Avançados",
    lbl_disable_home: "Desativar Gestos Início/Recentes",
    desc_disable_home: "Desativa gestos inferiores (ideal para apps de gestos de terceiros)",
    lbl_gcam_fix: "Correção de Tema da Pílula",
    desc_gcam_fix: "Corrige problemas de coloração da pílula (Correção GCam)",
    lbl_reboot_warn: "Algumas alterações requerem reinicialização para entrar em vigor.",
    btn_reboot: "Reiniciar",
    btn_apply: "Aplicar e Reiniciar",
    toast_saved: "Configurações aplicadas! Reiniciando...",
    toast_rebooting: "Reiniciando...",
    toast_error: "Ocorreu um erro: "
  },
  ru: {
    ui_title: "Настройки NavTweaks",
    ui_subtitle: "Настройка жестов системы и размера панели навигации",
    section_navbar: "Панель навигации",
    lbl_hide_navbar: "Скрыть панель навигации",
    desc_hide_navbar: "Полностью удалить панель навигации",
    lbl_navbar_height: "Высота панели",
    desc_navbar_height: "Установить высоту чувствительной области жестов",
    lbl_gesture_sensitivity: "Чувствительность жестов",
    desc_gesture_sensitivity: "Изменить чувствительность жеста Домой",
    section_keyboard: "Пространство клавиатуры",
    lbl_keyboard_space: "Пространство под клавиатурой",
    desc_keyboard_space: "Настроить высоту пустого пространства под клавиатурой",
    opt_kb_default: "Стандартное пространство",
    opt_kb_reduced: "Уменьшенное пространство",
    opt_kb_hidden: "Полностью скрыть пространство",
    lbl_hide_keyboard_buttons: "Скрыть кнопки под клавиатурой",
    desc_hide_keyboard_buttons: "Скрыть стрелку назад и переключатель клавиатуры",
    lbl_hide_pill: "Скрыть полосу/подсказку жестов",
    desc_hide_pill: "Скрыть горизонтальную полоску жестов (小白条)",
    section_back_gestures: "Жесты назад",
    lbl_disable_back: "Отключить жест назад",
    desc_disable_back: "Отключить боковые свайпы назад (применяется мгновенно!)",
    lbl_back_side: "Сторона отключения",
    desc_back_side: "Выберите, с какого края экрана отключить свайпы",
    opt_side_left: "Только левая сторона",
    opt_side_both: "Обе стороны",
    section_advanced: "Дополнительные твики",
    lbl_disable_home: "Отключить жесты домой/недавние",
    desc_disable_home: "Полностью отключает нижние жесты (для сторонних программ жестов)",
    lbl_gcam_fix: "Исправление темы полосы жестов",
    desc_gcam_fix: "Исправление несоответствия цветов полосы жестов (GCam)",
    lbl_reboot_warn: "Для применения некоторых изменений требуется перезагрузка.",
    btn_reboot: "Перезагрузить",
    btn_apply: "Применить и перезагрузить",
    toast_saved: "Настройки применены! Перезагрузка...",
    toast_rebooting: "Перезагрузка...",
    toast_error: "Произошла ошибка: "
  },
  tr: {
    ui_title: "NavTweaks Ayarları",
    ui_subtitle: "Sistem gezinti hareketlerini ve çubuk boyutunu özelleştir",
    section_navbar: "Gezinti Çubuğu",
    lbl_hide_navbar: "Gezinti Çubuğunu Gizle",
    desc_hide_navbar: "Gezinti çubuğunu tamamen kaldırır",
    lbl_navbar_height: "Çubuk Yüksekliği",
    desc_navbar_height: "Gezinti alanı için özel yükseklik ayarla",
    lbl_gesture_sensitivity: "Hareket Hassasiyeti",
    desc_gesture_sensitivity: "Ana ekran hareketinin hassasiyetini değiştir",
    section_keyboard: "Klavye Boşluğu",
    lbl_keyboard_space: "Klavye Altındaki Boşluk",
    desc_keyboard_space: "Klavyenin altında ne kadar boş alan kalacağını seçin",
    opt_kb_default: "Varsayılan Boşluk",
    opt_kb_reduced: "Azaltılmış Boşluk",
    opt_kb_hidden: "Boşluğu Tamamen Gizle",
    lbl_hide_keyboard_buttons: "Klavye Altındaki Tuşları Gizle",
    desc_hide_keyboard_buttons: "Klavyenin altındaki geri ve klavye değiştirme simgelerini gizler",
    lbl_hide_pill: "Hareket Çizgisini Gizle",
    desc_hide_pill: "Yatay gezinti çizgisini (hapı) gizle",
    section_back_gestures: "Geri Hareketleri",
    lbl_disable_back: "Geri Hareketini Devre Dışı Bırak",
    desc_disable_back: "Kenardan geri kaydırmayı kapatır (anında uygulanır!)",
    lbl_back_side: "Devre Dışı Bırakılacak Yön",
    desc_back_side: "Hangi kenar kaydırmasının devre dışı bırakılacağını seçin",
    opt_side_left: "Yalnızca Sol Taraf",
    opt_side_both: "Her İki Taraf Da",
    section_advanced: "Gelişmiş Ayarlar",
    lbl_disable_home: "Ana Ekran/Son Uygulamalar Hareketlerini Kapat",
    desc_disable_home: "Alt hareketleri tamamen devre dışı bırakır (üçüncü parti hareket uygulamaları için)",
    lbl_gcam_fix: "Çizgi Teması Düzeltmesi",
    desc_gcam_fix: "Hareket çizgisi renk sorunlarını giderir (GCam düzeltmesi)",
    lbl_reboot_warn: "Bazı değişikliklerin geçerli olması için yeniden başlatma gerekir.",
    btn_reboot: "Yeniden Başlat",
    btn_apply: "Uygula & Yeniden Başlat",
    toast_saved: "Ayarlar uygulandı! Yeniden başlatılıyor...",
    toast_rebooting: "Yeniden başlatılıyor...",
    toast_error: "Bir hata oluştu: "
  },
  zh: {
    ui_title: "NavTweaks 设置",
    ui_subtitle: "自定义系统导航手势和导航栏高度",
    section_navbar: "导航栏",
    lbl_hide_navbar: "隐藏导航栏",
    desc_hide_navbar: "完全移除底部导航栏区域",
    lbl_navbar_height: "导航栏高度",
    desc_navbar_height: "自定义手势触发区域的高度",
    lbl_gesture_sensitivity: "手势灵敏度",
    desc_gesture_sensitivity: "修改底部上滑返回主屏手势的触发范围",
    section_keyboard: "键盘空间",
    lbl_keyboard_space: "键盘下方空白空间",
    desc_keyboard_space: "选择输入法键盘底部的预留空白高度",
    opt_kb_default: "默认空白空间",
    opt_kb_reduced: "缩减空白空间",
    opt_kb_hidden: "完全隐藏空白空间",
    lbl_hide_keyboard_buttons: "隐藏键盘下方功能按钮",
    desc_hide_keyboard_buttons: "隐藏输入法展开时下方的收起及切换键盘图标",
    lbl_hide_pill: "隐藏手势提示线（小白条）",
    desc_hide_pill: "隐藏底部的横线手势指示条",
    section_back_gestures: "返回手势",
    lbl_disable_back: "禁用边缘返回手势",
    desc_disable_back: "关闭屏幕两侧上滑返回上一级的功能 (立即生效！)",
    lbl_back_side: "禁用边缘模式",
    desc_back_side: "选择关闭哪一侧的返回滑动手势",
    opt_side_left: "仅禁用左侧",
    opt_side_both: "双侧均禁用",
    section_advanced: "高级选项",
    lbl_disable_home: "禁用主页/近期任务手势",
    desc_disable_home: "完全关闭底部上滑手势 (适合使用第三方导航手势应用的用户)",
    lbl_gcam_fix: "启用手势线主题着色修复",
    desc_gcam_fix: "修复指示条在深浅色主题切换时的颜色异常 (GCam 修复)",
    lbl_reboot_warn: "部分修改需要重新启动系统后方可生效。",
    btn_reboot: "重启设备",
    btn_apply: "应用并重启",
    toast_saved: "设置应用成功！正在重新启动...",
    toast_rebooting: "正在重启...",
    toast_error: "发生错误: "
  }
};

// Global states
let systemLanguage = 'en';
let sdkVersion = 34; // Default to Android 14

// Local Storage cached state to check for changes
let originalConfig = {};
let currentConfig = {};

// DOM Elements
const elements = {
  opt_hide_navbar: document.getElementById('opt_hide_navbar'),
  opt_navbar_height: document.getElementById('opt_navbar_height'),
  val_navbar_height: document.getElementById('val_navbar_height'),
  container_navbar_height: document.getElementById('container_navbar_height'),
  
  opt_gesture_sensitivity: document.getElementById('opt_gesture_sensitivity'),
  val_gesture_sensitivity: document.getElementById('val_gesture_sensitivity'),
  
  opt_keyboard_space: document.getElementById('opt_keyboard_space'),
  val_keyboard_space: document.getElementById('val_keyboard_space'),
  opt_hide_keyboard_buttons: document.getElementById('opt_hide_keyboard_buttons'),
  container_keyboard_buttons: document.getElementById('container_keyboard_buttons'),
  
  opt_hide_pill: document.getElementById('opt_hide_pill'),
  container_hide_pill: document.getElementById('container_hide_pill'),
  
  opt_disable_back: document.getElementById('opt_disable_back'),
  opt_back_side: document.getElementById('opt_back_side'),
  container_back_side: document.getElementById('container_back_side'),
  
  opt_disable_home: document.getElementById('opt_disable_home'),
  opt_gcam_fix: document.getElementById('opt_gcam_fix'),
  
  module_version: document.getElementById('module_version'),

  reboot_banner: document.getElementById('reboot_banner'),
  btn_apply: document.getElementById('btn_apply')
};

// Start application
window.addEventListener('DOMContentLoaded', async () => {
  await detectSystemEnv();
  applyTranslations();
  await loadCurrentConfig();
  setupEventListeners();
  checkChanges();
});

// 1. Detect System environment (Language, Android SDK API Version)
async function detectSystemEnv() {
  try {
    // Detect API version
    const apiCmd = await exec('getprop ro.build.version.sdk');
    if (apiCmd.errno === 0) {
      sdkVersion = parseInt(apiCmd.stdout.trim(), 10);
    }
  } catch (e) {
    console.error('Failed to detect Android SDK version, using default 34', e);
  }

  try {
    // Read module version from module.prop
    const verCmd = await exec('grep "^version=" /data/adb/modules/HideNavBar/module.prop');
    if (verCmd.errno === 0 && verCmd.stdout.trim()) {
      elements.module_version.textContent = verCmd.stdout.trim().replace('version=', '');
    }
  } catch (e) {
    console.error('Failed to read module version', e);
  }

  try {
    // Detect system language
    let systemLocale = 'en';
    const localeCmd = await exec('getprop persist.sys.locale');
    if (localeCmd.errno === 0 && localeCmd.stdout.trim()) {
      systemLocale = localeCmd.stdout.trim();
    } else {
      const localesCmd = await exec('settings get system system_locales');
      if (localesCmd.errno === 0 && localesCmd.stdout.trim()) {
        systemLocale = localesCmd.stdout.trim().split(',')[0];
      }
    }
    
    // Map to supported lang (first 2 chars)
    const langCode = systemLocale.substring(0, 2).toLowerCase();
    if (translations[langCode]) {
      systemLanguage = langCode;
    } else {
      systemLanguage = 'en';
    }
  } catch (e) {
    console.error('Failed to detect language, falling back to English', e);
    systemLanguage = 'en';
  }

  // Set standard ranges across all versions (0-18 height, 10-32 sensitivity, 0-75 keyboard space)
  elements.opt_navbar_height.min = 0;
  elements.opt_navbar_height.max = 18;
  elements.opt_navbar_height.step = 0.5;
  
  elements.opt_gesture_sensitivity.min = 10;
  elements.opt_gesture_sensitivity.max = 32;
  elements.opt_gesture_sensitivity.step = 1;

  elements.opt_keyboard_space.min = 0;
  elements.opt_keyboard_space.max = 75;
  elements.opt_keyboard_space.step = 1;
}

// 2. Apply translated strings to DOM
function applyTranslations() {
  const dictionary = translations[systemLanguage] || translations.en;
  
  // Set html lang property
  document.documentElement.lang = systemLanguage;
  
  // Map labels
  Object.keys(dictionary).forEach(key => {
    const el = document.getElementById(key);
    if (el) {
      el.textContent = dictionary[key];
    }
  });
}

// 3. Load configurations from files
async function loadCurrentConfig() {
  let configStr = '';
  try {
    const readCmd = await exec('cat /data/adb/HideNavBar_config.sh');
    if (readCmd.errno === 0) {
      configStr = readCmd.stdout;
    }
  } catch (e) {
    console.error('Config file not found or couldn\'t be read, applying defaults', e);
  }

  const config = parseShellConfig(configStr);
  originalConfig = { ...config };
  currentConfig = { ...config };
  
  // Bind parsed configs to UI fields
  
  // 1. Hide Navbar
  const isNavbarHidden = currentConfig.BH === 0 || currentConfig.BH === 0.0 || currentConfig.BH === '0' || currentConfig.BH === '0.0';
  elements.opt_hide_navbar.checked = isNavbarHidden;
  
  // 2. Navbar Height
  const heightVal = parseFloat(currentConfig.BH);
  if (!isNaN(heightVal) && heightVal > 0) {
    elements.opt_navbar_height.value = heightVal;
    elements.val_navbar_height.textContent = heightVal;
  } else {
    // Default value if hidden or unset
    const def = 18.0;
    elements.opt_navbar_height.value = def;
    elements.val_navbar_height.textContent = def;
  }
  
  // Show/Hide Height slider depending on Navbar visibility
  toggleNavbarHeightVisibility(!isNavbarHidden);

  // 3. Gesture Sensitivity
  const sensVal = parseFloat(currentConfig.GS);
  if (!isNaN(sensVal) && sensVal > 0) {
    elements.opt_gesture_sensitivity.value = sensVal;
    elements.val_gesture_sensitivity.textContent = sensVal;
    elements.opt_disable_home.checked = false;
  } else if (sensVal === 0) {
    // Home Gestures Disabled
    elements.opt_disable_home.checked = true;
    const def = 18.0;
    elements.opt_gesture_sensitivity.value = def;
    elements.val_gesture_sensitivity.textContent = '0 (Disabled)';
  } else {
    // Defaults
    const def = 18.0;
    elements.opt_gesture_sensitivity.value = def;
    elements.val_gesture_sensitivity.textContent = def;
    elements.opt_disable_home.checked = false;
  }
  
  // 4. Space Under Keyboard
  const frameHeightVal = parseFloat(currentConfig.FH);
  if (!isNaN(frameHeightVal)) {
    elements.opt_keyboard_space.value = frameHeightVal;
    elements.val_keyboard_space.textContent = frameHeightVal;
  } else {
    const def = 48.0;
    elements.opt_keyboard_space.value = def;
    elements.val_keyboard_space.textContent = def;
  }
  
  // Show/Hide Keyboard Buttons container depending on Space (hide if 0)
  toggleKeyboardButtonsVisibility(frameHeightVal > 0);

  // 5. Hide Keyboard Buttons
  elements.opt_hide_keyboard_buttons.checked = (currentConfig.HKB === 'true' || currentConfig.HKB === true);

  // 6. Hide Pill
  elements.opt_hide_pill.checked = (currentConfig.HD === 'true' || currentConfig.HD === true || currentConfig.VAR3 === 'HP');

  // 7. Disable Back Gestures
  const isBackDisabled = (currentConfig.DBG === 'true' || currentConfig.DBG === true);
  elements.opt_disable_back.checked = isBackDisabled;
  toggleBackSideVisibility(isBackDisabled);

  // 8. Back Gesture Side
  elements.opt_back_side.value = currentConfig.SD === 'l' ? 'l' : 'b';

  // 9. GCam theme fix
  elements.opt_gcam_fix.checked = (currentConfig.GCAM === 'true' || currentConfig.GCAM === true);
}

// Helper to parse Shell KEY=VALUE format
function parseShellConfig(shellStr) {
  const defaults = {
    GS: 18.0,
    BH: 0,
    FH: 0,
    HKB: true,
    DBG: false,
    SD: 'b',
    HD: true,
    VAR3: 'HP',
    VAR4: 'PH',
    VAR5: 'HL',
    GCAM: false
  };

  if (!shellStr) return defaults;

  const lines = shellStr.split('\n');
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let val = parts.slice(1).join('=').trim();
      // Remove enclosing quotes if any
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      defaults[key] = val === 'true' ? true : (val === 'false' ? false : val);
    }
  });

  return defaults;
}

// 4. Bind UI event listeners
function setupEventListeners() {
  // Hide Navbar toggle
  elements.opt_hide_navbar.addEventListener('change', e => {
    toggleNavbarHeightVisibility(!e.target.checked);
    currentConfig.BH = e.target.checked ? 0 : parseFloat(elements.opt_navbar_height.value);
    checkChanges();
  });

  // Navbar height slider
  elements.opt_navbar_height.addEventListener('input', e => {
    elements.val_navbar_height.textContent = e.target.value;
    currentConfig.BH = parseFloat(e.target.value);
    checkChanges();
  });

  // Disable home gestures toggle
  elements.opt_disable_home.addEventListener('change', e => {
    if (e.target.checked) {
      elements.val_gesture_sensitivity.textContent = '0 (Disabled)';
      currentConfig.GS = 0;
    } else {
      elements.val_gesture_sensitivity.textContent = elements.opt_gesture_sensitivity.value;
      currentConfig.GS = parseFloat(elements.opt_gesture_sensitivity.value);
    }
    checkChanges();
  });

  // Gesture sensitivity slider
  elements.opt_gesture_sensitivity.addEventListener('input', e => {
    if (!elements.opt_disable_home.checked) {
      elements.val_gesture_sensitivity.textContent = e.target.value;
      currentConfig.GS = parseFloat(e.target.value);
      checkChanges();
    }
  });

  // Space under keyboard slider
  elements.opt_keyboard_space.addEventListener('input', e => {
    const val = parseFloat(e.target.value);
    elements.val_keyboard_space.textContent = val;
    currentConfig.FH = val;
    
    toggleKeyboardButtonsVisibility(val > 0);
    
    if (val === 0) {
      currentConfig.HKB = true;
      currentConfig.VAR5 = 'HL';
      currentConfig.VAR4 = 'PH';
      currentConfig.VAR3 = 'a';
      currentConfig.HD = true;
    } else {
      updatePillAndButtonsConfig();
    }
    checkChanges();
  });

  // Hide Keyboard buttons checkbox
  elements.opt_hide_keyboard_buttons.addEventListener('change', e => {
    currentConfig.HKB = e.target.checked;
    checkChanges();
  });

  // Hide Pill checkbox
  elements.opt_hide_pill.addEventListener('change', e => {
    currentConfig.HD = e.target.checked;
    if (e.target.checked) {
      currentConfig.VAR3 = 'HP';
      currentConfig.VAR4 = 'PH';
      currentConfig.VAR5 = 'HL';
    } else {
      currentConfig.VAR3 = 'a';
      currentConfig.VAR4 = 'a';
      currentConfig.VAR5 = 'a';
    }
    checkChanges();
  });

  // Disable back gesture checkbox (instantly applied)
  elements.opt_disable_back.addEventListener('change', async e => {
    const isChecked = e.target.checked;
    toggleBackSideVisibility(isChecked);
    currentConfig.DBG = isChecked;
    
    // Instantly apply settings to the device
    await applyBackGesturesInstantly(isChecked, elements.opt_back_side.value);
    checkChanges();
  });

  // Back side selector (instantly applied if back gesture is disabled)
  elements.opt_back_side.addEventListener('change', async e => {
    currentConfig.SD = e.target.value;
    if (elements.opt_disable_back.checked) {
      await applyBackGesturesInstantly(true, e.target.value);
    }
    checkChanges();
  });

  // GCam theme fix checkbox
  elements.opt_gcam_fix.addEventListener('change', e => {
    currentConfig.GCAM = e.target.checked;
    checkChanges();
  });

  // Action Button
  elements.btn_apply.addEventListener('click', async () => {
    await saveAndRecompile();
  });
}

function updatePillAndButtonsConfig() {
  currentConfig.HKB = elements.opt_hide_keyboard_buttons.checked;
  currentConfig.HD = elements.opt_hide_pill.checked;
  if (elements.opt_hide_pill.checked) {
    currentConfig.VAR3 = 'HP';
    currentConfig.VAR4 = 'PH';
    currentConfig.VAR5 = 'HL';
  } else {
    currentConfig.VAR3 = 'a';
    currentConfig.VAR4 = 'a';
    currentConfig.VAR5 = 'a';
  }
}

// 5. Hide/Show elements based on selections
function toggleNavbarHeightVisibility(show) {
  if (show) {
    elements.container_navbar_height.style.display = 'flex';
  } else {
    elements.container_navbar_height.style.display = 'none';
  }
}

function toggleKeyboardButtonsVisibility(show) {
  if (show) {
    elements.container_keyboard_buttons.style.display = 'flex';
    elements.container_hide_pill.style.display = 'flex';
  } else {
    elements.container_keyboard_buttons.style.display = 'none';
    elements.container_hide_pill.style.display = 'none';
  }
}

function toggleBackSideVisibility(show) {
  if (show) {
    elements.container_back_side.style.display = 'flex';
  } else {
    elements.container_back_side.style.display = 'none';
  }
}

// 6. Instant back gesture actions
async function applyBackGesturesInstantly(disabled, side) {
  try {
    const dict = translations[systemLanguage] || translations.en;
    if (disabled) {
      if (side === 'l') {
        await exec('settings put secure back_gesture_inset_scale_left -1');
        await exec('settings delete secure back_gesture_inset_scale_right');
      } else {
        await exec('settings put secure back_gesture_inset_scale_left -1');
        await exec('settings put secure back_gesture_inset_scale_right -1');
      }
    } else {
      await exec('settings delete secure back_gesture_inset_scale_left');
      await exec('settings delete secure back_gesture_inset_scale_right');
    }
    toast(dict.applied_instantly);
  } catch (err) {
    console.error('Failed to apply back gesture scale secure settings', err);
  }
}

// 7. Check if configuration changed and show/hide Reboot banner
function checkChanges() {
  let changed = false;
  
  // We compare settings that require a reboot to take effect
  // DBG and SD are excluded because they apply instantly
  const rebootRequiredKeys = ['BH', 'GS', 'FH', 'HKB', 'HD', 'VAR3', 'VAR4', 'VAR5', 'GCAM'];
  
  for (const key of rebootRequiredKeys) {
    if (String(originalConfig[key]) !== String(currentConfig[key])) {
      changed = true;
      break;
    }
  }

  if (changed) {
    elements.reboot_banner.classList.remove('hidden');
  } else {
    elements.reboot_banner.classList.add('hidden');
  }
}

// 8. Write config to disk & run apply_settings compiler
async function saveAndRecompile() {
  const dict = translations[systemLanguage] || translations.en;
  
  try {
    // Resolve dynamic combinations for theme matching / GCam fix
    let bhVal = currentConfig.BH;
    let fhVal = currentConfig.FH;
    
    if (currentConfig.GCAM) {
      if (fhVal === 0 || fhVal === 0.0 || fhVal === '0' || fhVal === '0.0') {
        bhVal = 1.0;
        fhVal = 1.0;
      } else {
        bhVal = 1.0;
      }
    }
    
    const configContent = `GS=${currentConfig.GS}
BH=${bhVal}
FH=${fhVal}
HKB=${currentConfig.HKB}
DBG=${currentConfig.DBG}
SD=${currentConfig.SD}
HD=${currentConfig.HD}
VAR3=${currentConfig.VAR3}
VAR4=${currentConfig.VAR4}
VAR5=${currentConfig.VAR5}
GCAM=${currentConfig.GCAM}`;

    // Write config file to data path
    const writeCmd = await exec(`echo "${configContent}" > /data/adb/HideNavBar_config.sh`);
    if (writeCmd.errno !== 0) {
      throw new Error(`Failed to write config file: ${writeCmd.stderr}`);
    }

    toast(dict.toast_saved);

    // Run overlay compilation script
    const compileCmd = await exec('sh /data/adb/modules/HideNavBar/compile_overlays.sh');
    if (compileCmd.errno !== 0) {
      throw new Error(`Compilation failed: ${compileCmd.stderr}`);
    }

    // Reboot device
    await exec('reboot || svc power reboot');

  } catch (err) {
    alert(dict.toast_error + err.message);
  }
}
