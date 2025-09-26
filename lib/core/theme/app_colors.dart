import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Primary Colors from Figma
  static const Color primary = Color(0xFF162D3A); // #162D3A
  static const Color primaryLight = Color(0xAA162D3A); // #162D3A
  static const Color primaryBlue = Color(0xFF1E4AE9); // #1E4AE9
  static const Color buttonDisabled = Color(0xFF6D8E9D); // #6D8E9D

  // Text Colors
  static const Color textPrimary = Color(0xFF0B435B); // #0C1421
  static const Color textSecondary = Color(0xFF313957); // #313957
  static const Color textPlaceholder = Color(0xFF8897AD); // #8897AD
  static const Color textDisabled = Color(0xFF959CB6); // #959CB6
  static const Color textDark = Color(0xFF122B31); // #122B31
  static const Color textMedium = Color(0xFF294957); // #294957

  // Background Colors
  static const Color background = Color(0xFFFFFFFF); // #FFFFFF
  static const Color backgroundLight = Color(0xFFFFFFFF); // #F7FBFF
  static const Color backgroundGray = Color(0xFFE6ECEE); // #F3F9FA

  // Border Colors
  static const Color border = Color(0xFFD4D7E3); // #D4D7E3
  static const Color borderLight = Color(0xFFCFDFE2); // #CFDFE2

  // Social Media Colors
  static const Color googleBlue = Color(0xFF4285F4); // #4285F4
  static const Color googleGreen = Color(0xFF34A853); // #34A853
  static const Color googleYellow = Color(0xFFFBBC04); // #FBBC04
  static const Color googleRed = Color(0xFFEA4335); // #EA4335
  static const Color facebook = Color(0xFF1877F2); // #1877F2

  // Status Colors
  static const Color success = Color(0xFF34A853);
  static const Color error = Color(0xFFEA4335);
  static const Color warning = Color(0xFFFBBC04);
  static const Color info = Color(0xFF4285F4);

  // Neutral Colors
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF000000);
  static const Color transparent = Colors.transparent;

  // Material Color Swatch for primary color
  static const MaterialColor primarySwatch = MaterialColor(
    0xFF162D3A,
    <int, Color>{
      50: Color(0xFFE3E7EA),
      100: Color(0xFFBAC4CA),
      200: Color(0xFF8C9DA6),
      300: Color(0xFF5E7682),
      400: Color(0xFF3C5868),
      500: Color(0xFF162D3A),
      600: Color(0xFF132834),
      700: Color(0xFF10222C),
      800: Color(0xFF0C1C24),
      900: Color(0xFF061117),
    },
  );

  // Button Colors
  static const Color buttonPrimary = primary;
  static const Color buttonSecondary = backgroundGray;
  static const Color buttonText = white;
  static const Color buttonTextSecondary = textSecondary;
  static const Color buttonPrimaryDisabled = buttonDisabled;

  // Input Field Colors
  static const Color inputBackground = backgroundLight;
  static const Color inputBorder = border;
  static const Color inputFocusedBorder = primaryLight;
  static const Color inputText = textPrimary;
  static const Color inputPlaceholder = textPlaceholder;
  static const Color inputLabel = textPrimary;

  // Dark Theme Colors
  static const Color darkBackground = Color(0xFF0C1421);
  static const Color darkSurface = Color(0xFF162D3A);
  static const Color darkTextPrimary = Color(0xFFFFFFFF);
  static const Color darkTextSecondary = Color(0xFF8897AD);
  static const Color darkInputBackground = Color(0xFF1A2835);
  static const Color darkInputBorder = Color(0xFF313957);
  static const Color darkInputPlaceholder = Color(0xFF8897AD);
  static const Color darkInputLabel = Color(0xFFFFFFFF);
  static const Color darkBorder = Color(0xFF313957);

  // Secondary color for theme
  static const Color secondary = primaryBlue;
}
