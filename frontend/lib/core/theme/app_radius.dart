import 'package:flutter/widgets.dart';

/// AppRadius - Design System radius tokens
/// Based on CCDS theme (1–6, max, full).
///
/// Usage:
///   borderRadius: BorderRadius.circular(AppRadius.r4),
///   shape: RoundedRectangleBorder(borderRadius: AppRadius.fullCircle),
///
class AppRadius {
  AppRadius._(); // private constructor

  // Base radius tokens
  static const double r1 = 6.0; // Full/1
  static const double r2 = 8.0; // Full/2
  static const double r3 = 12.0; // Full/3
  static const double r4 = 16.0; // Full/4
  static const double r5 = 24.0; // Full/5
  static const double r6 = 32.0; // Full/6

  // Max radius (used for pill-like buttons, chips)
  static const double r1Max = 9999.0;
  static const double r2Max = 999.0;
  static const double r3Max = 999.0;
  static const double r4Max = 999.0;
  static const double r5Max = 999.0;
  static const double r6Max = 999.0;

  // Full (9999 → circular / capsule shapes)
  static const double full = 9999.0;

  // Commonly used border radius shortcuts
  static BorderRadius br1 = BorderRadius.circular(r1);
  static BorderRadius br2 = BorderRadius.circular(r2);
  static BorderRadius br3 = BorderRadius.circular(r3);
  static BorderRadius br4 = BorderRadius.circular(r4);
  static BorderRadius br5 = BorderRadius.circular(r5);
  static BorderRadius br6 = BorderRadius.circular(r6);

  static BorderRadius fullCircle = BorderRadius.circular(full);
}
