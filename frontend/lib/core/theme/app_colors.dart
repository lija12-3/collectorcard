import 'package:flutter/material.dart';

// class AppColors {
//   AppColors._();

//   // Primary Colors from Figma
//   static const Color primary = Color(0xFF162D3A); // #162D3A
//   static const Color primaryLight = Color(0xAA162D3A); // #162D3A
//   static const Color primaryBlue = Color(0xFF1E4AE9); // #1E4AE9
//   static const Color buttonDisabled = Color(0xFF6D8E9D); // #6D8E9D

//   // Text Colors
//   static const Color textPrimary = Color(0xFF0B435B); // #0C1421
//   static const Color textSecondary = Color(0xFF313957); // #313957
//   static const Color textPlaceholder = Color(0xFF8897AD); // #8897AD
//   static const Color textDisabled = Color(0xFF959CB6); // #959CB6
//   static const Color textDark = Color(0xFF122B31); // #122B31
//   static const Color textMedium = Color(0xFF294957); // #294957

//   // Background Colors
//   static const Color background = Color(0xFFFFFFFF); // #FFFFFF
//   static const Color backgroundLight = Color(0xFFFFFFFF); // #F7FBFF
//   static const Color backgroundGray = Color(0xFFE6ECEE); // #F3F9FA

//   // Border Colors
//   static const Color border = Color(0xFFD4D7E3); // #D4D7E3
//   static const Color borderLight = Color(0xFFCFDFE2); // #CFDFE2

//   // Social Media Colors
//   static const Color googleBlue = Color(0xFF4285F4); // #4285F4
//   static const Color googleGreen = Color(0xFF34A853); // #34A853
//   static const Color googleYellow = Color(0xFFFBBC04); // #FBBC04
//   static const Color googleRed = Color(0xFFEA4335); // #EA4335
//   static const Color facebook = Color(0xFF1877F2); // #1877F2

//   // Status Colors
//   static const Color success = Color(0xFF34A853);
//   static const Color error = Color(0xFFEA4335);
//   static const Color warning = Color(0xFFFBBC04);
//   static const Color info = Color(0xFF4285F4);

//   // Neutral Colors
//   static const Color white = Color(0xFFFFFFFF);
//   static const Color black = Color(0xFF000000);
//   static const Color transparent = Colors.transparent;

//   // Material Color Swatch for primary color
//   static const MaterialColor primarySwatch = MaterialColor(
//     0xFF162D3A,
//     <int, Color>{
//       50: Color(0xFFE3E7EA),
//       100: Color(0xFFBAC4CA),
//       200: Color(0xFF8C9DA6),
//       300: Color(0xFF5E7682),
//       400: Color(0xFF3C5868),
//       500: Color(0xFF162D3A),
//       600: Color(0xFF132834),
//       700: Color(0xFF10222C),
//       800: Color(0xFF0C1C24),
//       900: Color(0xFF061117),
//     },
//   );

//   // Button Colors
//   static const Color buttonPrimary = primary;
//   static const Color buttonSecondary = backgroundGray;
//   static const Color buttonText = white;
//   static const Color buttonTextSecondary = textSecondary;
//   static const Color buttonPrimaryDisabled = buttonDisabled;

//   // Input Field Colors
//   static const Color inputBackground = backgroundLight;
//   static const Color inputBorder = border;
//   static const Color inputFocusedBorder = primaryLight;
//   static const Color inputText = textPrimary;
//   static const Color inputPlaceholder = textPlaceholder;
//   static const Color inputLabel = textPrimary;

//   // Dark Theme Colors
//   static const Color darkBackground = Color(0xFF0C1421);
//   static const Color darkSurface = Color(0xFF162D3A);
//   static const Color darkTextPrimary = Color(0xFFFFFFFF);
//   static const Color darkTextSecondary = Color(0xFF8897AD);
//   static const Color darkInputBackground = Color(0xFF1A2835);
//   static const Color darkInputBorder = Color(0xFF313957);
//   static const Color darkInputPlaceholder = Color(0xFF8897AD);
//   static const Color darkInputLabel = Color(0xFFFFFFFF);
//   static const Color darkBorder = Color(0xFF313957);

//   // Secondary color for theme
//   static const Color secondary = primaryBlue;
// }

class AppColors {
  AppColors._();

  // ────────────────────────────────
  // Accent Alpha
  // ────────────────────────────────
  static const Color primaryAccentAlphaBackground = Color(
    0x08F112F1,
  ); // Colors/Lavender Alpha/1

  static const Color secondaryAccentBackground = Color(
    0x11F22FF2,
  ); // Colors/Lavender Alpha/2
  static const Color elevatedAccentAlphaBackground = Color(
    0x27FD4CFD,
  ); // Colors/Lavender Alpha/3

  static const Color elevatedHoverAccentAlphtBackground = Color(
    0x3AF646FF,
  ); // Colors/Lavender Alpha/4

  static const Color elevatedSelectedAccentAlphaBackground = Color(
    0x48F455FF,
  ); // Colors/Lavender Alpha/5

  // Border Colors
  static const Color subtleStaticAccentAlphaBorder = Color(
    0x56F66DFF,
  ); // Colors/Lavender Alpha/6

  static const Color subtleInteractiveAccentAlphaBorder = Color(
    0x70F07CFD,
  ); // Colors/Lavender Alpha/7

  static const Color vibrantAccentAlphaBorder = Color(
    0x95EE84FF,
  ); // Colors/Lavender Alpha/8

  // Fill Colors
  static const Color vibrantAccentAlphaFill = Color(
    0xB6E961FE,
  ); // Colors/Lavender Alpha/9

  static const Color vibrantHoverAccentAlphaFill = Color(
    0xC0ED70FF,
  ); // Colors/Lavender Alpha/10

  // Text Colors
  static const Color subtleAccentAlphaText = Color(
    0xF3F19CFE,
  ); // Colors/Lavender Alpha/11
  static const Color vibrantAccentAlphaText = Color(
    0xF4FEDDFE,
  ); // Colors/Lavender Alpha/12

  // ────────────────────────────────
  //Accent
  // ────────────────────────────────
  static const Color primaryAccentBackground = Color(
    0xFF181118,
  ); //Colors/Lavender/1
  static const Color secondaryAccentAlphaBackground = Color(
    0xFF201320,
  ); // Colors/Lavender/2
  static const Color elevatedAccentBackground = Color(
    0xFF351A35,
  ); // Colors/Lavender/3
  static const Color elevatedHoverAccentBackground = Color(
    0xFF451D47,
  ); // Colors/Lavender/4
  static const Color elevatedSelectedAccentBackground = Color(
    0xFF512454,
  ); // Colors/Lavender/5
  static const Color subtleStaticAccentBorder = Color(
    0xFF5E3061,
  ); //Colors/Lavender/6
  static const Color subtleInteractiveAccentBorder = Color(
    0xFF734079,
  ); // Colors/Lavender/7
  static const Color vibrantAccentBorder = Color(
    0xFF92549C,
  ); // Colors/Lavender/8

  static const Color vibrantAccentFill = Color(0xFFAB4ABA); // Colors/Lavender/9
  static const Color vibrantHoverAccentFill = Color(
    0xFFB658C4,
  ); // Colors/Lavender/10

  static const Color subtleAccentText = Color(0xFFE796F3); // Colors/Lavender/11
  static const Color vibrantAccentText = Color(
    0xFFF4D4F4,
  ); // Colors/Lavender/12

  // ────────────────────────────────
  // Semantic
  // ────────────────────────────────
  static const Color primarySemanticSuccessBackground = Color(
    0xFF10150E,
  ); // Colors/Viridian/1
  static const Color secondarySemanticSuccessBackground = Color(
    0xFF171A14,
  ); // Colors/Viridian/2
  static const Color elevatedSemanticSuccessBackground = Color(
    0xFF222A1B,
  ); // Colors/Viridian/3
  static const Color elevatedHoverSemanticSuccessBackground = Color(
    0xFF293A1D,
  ); // Colors/Viridian/4
  static const Color elevatedSelectedSemanticSuccessBackground = Color(
    0xFF344825,
  ); // Colors/Viridian/5

  static const Color subtleStaticSemanticSuccessBorder = Color(
    0xFF3F572D,
  ); // Colors/Viridian/6
  static const Color subtleInteractiveSemanticSuccessBorder = Color(
    0xFF4C6736,
  ); // Colors/Viridian/7
  static const Color vibrantSemanticSuccessBorder = Color(
    0xFF5A793E,
  ); // Colors/Viridian/8

  static const Color vibrantSemanticSuccessFill = Color(
    0xFF73A746,
  ); // Colors/Viridian/9
  static const Color vibrantHoverSemanticSuccessFill = Color(
    0xFF80B353,
  ); // Colors/Viridian/10

  static const Color subtleSemanticSuccessText = Color(
    0xFF9DD071,
  ); // Colors/Viridian/11
  static const Color vibrantSemanticSuccessText = Color(
    0xFFE0F0C2,
  ); // Colors/Viridian/12

  // ────────────────────────────────
  // Semantic Success Alpha Colors
  // ────────────────────────────────
  static const Color primarySemanticSuccessAlphaBackground = Color(
    0x057EDE00,
  ); // Colors/Viridian Alpha/1

  static const Color secondarySemanticSuccessAlphaBackground = Color(
    0x0AA8F75E,
  ); // Colors/Viridian Alpha/2

  static const Color elevatedSemanticSuccessAlphaBackground = Color(
    0x1BB0FE70,
  ); // Colors/Viridian Alpha/3

  static const Color elevatedHoverSemanticSuccessAlphaBackground = Color(
    0x2C9AFF57,
  ); // Colors/Viridian Alpha/4

  static const Color elevatedSelectedSemanticSuccessAlphaBackground = Color(
    0x3BA7FF68,
  ); // Colors/Viridian Alpha/5

  static const Color subtleStaticSemanticSuccessAlphaBorder = Color(
    0x4BAFFF71,
  ); // Colors/Viridian Alpha/6

  static const Color subtleInteractiveSemanticSuccessAlphaBorder = Color(
    0x5DB3FD77,
  ); // Colors/Viridian Alpha/7

  static const Color vibrantSemanticSuccessAlphaBorder = Color(
    0x70B6FD77,
  ); // Colors/Viridian Alpha/8

  static const Color vibrantSemanticSuccessAlphaFill = Color(
    0xA1ADFF65,
  ); // Colors/Viridian Alpha/9

  static const Color vibrantHoverSemanticSuccessAlphaFill = Color(
    0xAEB4FF72,
  ); // Colors/Viridian Alpha/10

  static const Color subtleSemanticSuccessAlphaText = Color(
    0xCDC0FF89,
  ); // Colors/Viridian Alpha/11

  static const Color vibrantSemanticSuccessAlphaText = Color(
    0xEFEEFFCE,
  ); // Colors/Viridian Alpha/12

  // ────────────────────────────────
  // Semantic Warning Colors
  // ────────────────────────────────
  static const Color primarySemanticWarningBackground = Color(
    0xFF16120C,
  ); // Colors/Saffron/1

  static const Color secondarySemanticWarningBackground = Color(
    0xFF1D180F,
  ); // Colors/Saffron/2

  static const Color elevatedSemanticWarningBackground = Color(
    0xFF302008,
  ); // Colors/Saffron/3

  static const Color elevatedHoverSemanticWarningBackground = Color(
    0xFF3F2700,
  ); // Colors/Saffron/4

  static const Color elevatedSelectedSemanticWarningBackground = Color(
    0xFF4D3000,
  ); // Colors/Saffron/5

  static const Color subtleStaticSemanticWarningBorder = Color(
    0xFF5C3D05,
  ); // Colors/Saffron/6

  static const Color subtleInteractiveSemanticWarningBorder = Color(
    0xFF714F19,
  ); // Colors/Saffron/7

  static const Color vibrantSemanticWarningBorder = Color(
    0xFF8F6424,
  ); // Colors/Saffron/8

  static const Color vibrantSemanticWarningFill = Color(
    0xFFFFC53D,
  ); // Colors/Saffron/9

  static const Color vibrantHoverSemanticWarningFill = Color(
    0xFFFFD60A,
  ); // Colors/Saffron/10

  static const Color subtleSemanticWarningText = Color(
    0xFFFFCA16,
  ); // Colors/Saffron/11

  static const Color vibrantSemanticWarningText = Color(
    0xFFFFE7B3,
  ); // Colors/Saffron/12

  // ────────────────────────────────
  // Semantic Warning Alpha Colors
  // ────────────────────────────────
  static const Color primarySemanticWarningAlphaBackground = Color(
    0x05E63C00,
  ); // Colors/Saffron Alpha/1

  static const Color secondarySemanticWarningAlphaBackground = Color(
    0x0AFD9B00,
  ); // Colors/Saffron Alpha/2

  static const Color elevatedSemanticWarningAlphaBackground = Color(
    0x1BFA8200,
  ); // Colors/Saffron Alpha/3

  static const Color elevatedHoverSemanticWarningAlphaBackground = Color(
    0x2CFC8200,
  ); // Colors/Saffron Alpha/4

  static const Color elevatedSelectedSemanticWarningAlphaBackground = Color(
    0x3BFD8B00,
  ); // Colors/Saffron Alpha/5

  static const Color subtleStaticSemanticWarningAlphaBorder = Color(
    0x4BFD9B00,
  ); // Colors/Saffron Alpha/6

  static const Color subtleInteractiveSemanticWarningAlphaBorder = Color(
    0x5DFFAB25,
  ); // Colors/Saffron Alpha/7

  static const Color vibrantSemanticWarningAlphaBorder = Color(
    0x70FFAE35,
  ); // Colors/Saffron Alpha/8

  static const Color vibrantSemanticWarningAlphaFill = Color(
    0xFFFFC53D,
  ); // Colors/Saffron Alpha/9

  static const Color vibrantHoverSemanticWarningAlphaFill = Color(
    0xFFFFD60A,
  ); // Colors/Saffron Alpha/10

  static const Color subtleSemanticWarningAlphaText = Color(
    0xFFFFCA16,
  ); // Colors/Saffron Alpha/11

  static const Color vibrantSemanticWarningAlphaText = Color(
    0xFFFFE7B3,
  ); // Colors/Saffron Alpha/12

  // ────────────────────────────────
  // Semantic Error Colors
  // ────────────────────────────────
  static const Color primarySemanticErrorBackground = Color(
    0xFF181111,
  ); // Colors/Vermillion/1

  static const Color secondarySemanticErrorBackground = Color(
    0xFF1F1513,
  ); // Colors/Vermillion/2

  static const Color elevatedSemanticErrorBackground = Color(
    0xFF391714,
  ); // Colors/Vermillion/3

  static const Color elevatedHoverSemanticErrorBackground = Color(
    0xFF4E1511,
  ); // Colors/Vermillion/4

  static const Color elevatedSelectedSemanticErrorBackground = Color(
    0xFF5E1C16,
  ); // Colors/Vermillion/5

  static const Color subtleStaticSemanticErrorBorder = Color(
    0xFF6E2920,
  ); // Colors/Vermillion/6

  static const Color subtleInteractiveSemanticErrorBorder = Color(
    0xFF853A2D,
  ); // Colors/Vermillion/7

  static const Color vibrantSemanticErrorBorder = Color(
    0xFFAC4D39,
  ); // Colors/Vermillion/8

  static const Color vibrantSemanticErrorFill = Color(
    0xFFE54D2E,
  ); // Colors/Vermillion/9

  static const Color vibrantHoverSemanticErrorFill = Color(
    0xFFEC6142,
  ); // Colors/Vermillion/10

  static const Color subtleSemanticErrorText = Color(
    0xFFFF977D,
  ); // Colors/Vermillion/11

  static const Color vibrantSemanticErrorText = Color(
    0xFFFBD3CB,
  ); // Colors/Vermillion/12

  // ────────────────────────────────
  // Semantic Error Alpha Colors
  // ────────────────────────────────
  static const Color primarySemanticErrorAlphaBackground = Color(
    0x05F11212,
  ); // Colors/Vermillion Alpha/1 (#F11212 · 3.14%)

  static const Color secondarySemanticErrorAlphaBackground = Color(
    0x0FFF5533,
  ); // Colors/Vermillion Alpha/2 (#FF5533 · 5.88%)

  static const Color elevatedSemanticErrorAlphaBackground = Color(
    0x2BFF3523,
  ); // Colors/Vermillion Alpha/3 (#FF3523 · 16.86%)

  static const Color elevatedHoverSemanticErrorAlphaBackground = Color(
    0x42FD2011,
  ); // Colors/Vermillion Alpha/4 (#FD2011 · 25.88%)

  static const Color elevatedSelectedSemanticErrorAlphaBackground = Color(
    0x52FE3321,
  ); // Colors/Vermillion Alpha/5 (#FE3321 · 32.55%)

  static const Color subtleStaticSemanticErrorAlphaBorder = Color(
    0x63FF4F38,
  ); // Colors/Vermillion Alpha/6 (#FF4F38 · 39.22%)

  static const Color subtleInteractiveSemanticErrorAlphaBorder = Color(
    0x7DFD644A,
  ); // Colors/Vermillion Alpha/7 (#FD644A · 49.02%)

  static const Color vibrantSemanticErrorAlphaBorder = Color(
    0xA7FE6D4E,
  ); // Colors/Vermillion Alpha/8 (#FE6D4E · 65.49%)

  static const Color vibrantSemanticErrorAlphaFill = Color(
    0xE4FE5431,
  ); // Colors/Vermillion Alpha/9 (#FE5431 · 89.41%)

  static const Color vibrantHoverSemanticErrorAlphaFill = Color(
    0xEBFF6847,
  ); // Colors/Vermillion Alpha/10 (#FF6847 · 92.16%)

  static const Color subtleSemanticErrorAlphaText = Color(
    0xFFFF977D,
  ); // Colors/Vermillion Alpha/11 (#FF977D · 100%)

  static const Color vibrantSemanticErrorAlphaText = Color(
    0xFBFFD6CE,
  ); // Colors/Vermillion Alpha/12 (#FFD6CE · 98.43%)

  // ────────────────────────────────
  // Semantic Info Colors
  // ────────────────────────────────
  static const Color primarySemanticInfoBackground = Color(
    0xFF0B161A,
  ); // Colors/Cerulean/1
  static const Color secondarySemanticInfoBackground = Color(
    0xFF101B20,
  ); // Colors/Cerulean/2
  static const Color elevatedSemanticInfoBackground = Color(
    0xFF082C36,
  ); // Colors/Cerulean/3
  static const Color elevatedHoverSemanticInfoBackground = Color(
    0xFF003848,
  ); // Colors/Cerulean/4
  static const Color elevatedSelectedSemanticInfoBackground = Color(
    0xFF004558,
  ); //Colors/ Cerulean/5

  static const Color subtleStaticSemanticInfoBorder = Color(
    0xFF045468,
  ); // Colors/Cerulean/6
  static const Color subtleInteractiveSemanticInfoBorder = Color(
    0xFF12677E,
  ); // Colors/Cerulean/7
  static const Color vibrantSemanticInfoBorder = Color(
    0xFF11809C,
  ); // Colors/Cerulean/8

  static const Color vibrantSemanticInfoFill = Color(
    0xFF00A2C7,
  ); // Colors/Cerulean/9
  static const Color vibrantHoverSemanticInfoFill = Color(
    0xFF23AFD0,
  ); // Colors/Cerulean/10

  static const Color subtleSemanticInfoText = Color(
    0xFF4CCCE6,
  ); // Colors/Cerulean/11
  static const Color vibrantSemanticInfoText = Color(
    0xFFB6ECF7,
  ); // Colors/Cerulean/12

  // ────────────────────────────────
  // Semantic Info Alpha Colors
  // ────────────────────────────────
  static const Color primarySemanticInfoAlphaBackground = Color(
    0x090091F7,
  ); // Colors/Cerulean Alpha/1 (#0091F7 · 3.92%)
  static const Color secondarySemanticInfoAlphaBackground = Color(
    0x1102A7F2,
  ); // Colors/Cerulean Alpha/2 (#02A7F2 · 6.67%)
  static const Color elevatedSemanticInfoAlphaBackground = Color(
    0x2800BEFD,
  ); // Colors/Cerulean Alpha/3 (#00BEFD · 15.69%)
  static const Color elevatedHoverSemanticInfoAlphaBackground = Color(
    0x3B00BAFF,
  ); // Colors/Cerulean Alpha/4 (#00BAFF · 23.14%)
  static const Color elevatedSelectedSemanticInfoAlphaBackground = Color(
    0x4D00BEFD,
  ); // Colors/Cerulean Alpha/5 (#00BEFD · 30.2%)

  static const Color subtleStaticSemanticInfoAlphaBorder = Color(
    0x5D00C7FD,
  ); // Colors/Cerulean Alpha/6 (#00C7FD · 36.86%)
  static const Color subtleInteractiveSemanticInfoAlphaBorder = Color(
    0x7314CDFF,
  ); // Colors/Cerulean Alpha/7 (#14CDFF · 45.88%)
  static const Color vibrantSemanticInfoAlphaBorder = Color(
    0x9511CFFF,
  ); // Colors/Cerulean Alpha/8 (#11CFFF · 58.43%)

  static const Color vibrantSemanticInfoAlphaFill = Color(
    0xC200CFFF,
  ); // Colors/Cerulean Alpha/9 (#00CFFF · 76.47%)
  static const Color vibrantHoverSemanticInfoAlphaFill = Color(
    0xCC28D6FF,
  ); // Colors/Cerulean Alpha/10 (#28D6FF · 80.39%)

  static const Color subtleSemanticInfoAlphaText = Color(
    0xE652E1FE,
  ); // Colors/Cerulean Alpha/11 (#52E1FE · 89.8%)
  static const Color vibrantSemanticInfoAlphaText = Color(
    0xF7BBF3FE,
  ); // Colors/Cerulean Alpha/12 (#BBF3FE · 96.86%)

  // ────────────────────────────────
  // Default Brand & Neutral Colors
  // ────────────────────────────────
  static const Color celadon = Color(0xFFD4FF70); // Colors/Celadon/10
  static const Color cerulean = Color(0xFF00A2C7); // Colors/Cerulean/9
  static const Color indigo = Color(0xFF3E63DD); // Colors/Indigo/9
  static const Color lavender = Color(0xFFE796F3); // Colors/Lavender/11
  static const Color moon = Color(0xFF6958AD); // Colors/Moon/8
  static const Color saffron = Color(0xFFFFC53D); // Colors/Saffron/9
  static const Color seafoam = Color(0xFFADF0D4); // Colors/Seafoam/12
  static const Color vermillion = Color(0xFFE54D2E); // Colors/Vermillion/9
  static const Color viridian = Color(0xFF73A746); // Colors/Viridian/9

  // Neutral shades
  static const Color eggshell = Color(0xFFEEEEEE); // Colors/Neutral/12
  static const Color misty = Color(0xFFB4B4B4); // Colors/Neutral/11
  static const Color ash = Color(0xFF7B7B7B); // Colors/Neutral/10
  static const Color pewter = Color(0xFF606060); // Colors/Neutral/8
  static const Color boulder = Color(0xFF313131); // Colors/Neutral/5
  static const Color rocket = Color(0xFF222222); // Colors/Neutral/3
}
