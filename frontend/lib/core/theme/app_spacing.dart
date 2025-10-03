import 'package:flutter/widgets.dart';

/// AppSpacing - Design System spacing tokens
/// Based on CCDS theme spacing (1–9).
///
/// Usage:
///   SizedBox(height: AppSpacing.xs),   // small vertical gap
///   Padding(padding: EdgeInsets.all(AppSpacing.md)), // medium padding
///
class AppSpacing {
  AppSpacing._(); // private constructor to prevent instantiation

  // Core spacing tokens
  static const double s1 = 4.0; // 100%/1
  static const double s2 = 8.0; // 100%/2
  static const double s3 = 12.0; // 100%/3
  static const double s4 = 16.0; // 100%/4
  static const double s5 = 24.0; // 100%/5
  static const double s6 = 32.0; // 100%/6
  static const double s7 = 40.0; // 100%/7
  static const double s8 = 48.0; // 100%/8
  static const double s9 = 64.0; // 100%/9

  // Utility helpers
  static const gap1 = SizedBox(height: s1, width: s1);
  static const gap2 = SizedBox(height: s2, width: s2);
  static const gap4 = SizedBox(height: s4, width: s4);
  static const gap8 = SizedBox(height: s8, width: s8);
}
