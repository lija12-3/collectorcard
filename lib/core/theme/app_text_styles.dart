import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'app_colors.dart';

class AppTextStyles {
  AppTextStyles._();

  // Main Heading from Figma - Bree Serif 40px (Desktop)
  static TextStyle get mainHeading => GoogleFonts.breeSerif(
        fontSize: 40,
        fontWeight: FontWeight.w400,
        height: 1.2,
        letterSpacing: -1.0, // -2.5% of font size
        color: AppColors.textPrimary,
      );

  // Mobile Main Heading from Figma - Bree Serif 32px (Mobile)
  static TextStyle get mobileMainHeading => GoogleFonts.breeSerif(
        fontSize: 32,
        fontWeight: FontWeight.w400,
        height: 1.2,
        letterSpacing: -1.0, // -3.125% of font size
        color: AppColors.textPrimary,
      );

  // Label Text from Figma - Open Sans 16px (Desktop)
  static TextStyle get labelText => GoogleFonts.openSans(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        height: 1.4,
        color: AppColors.textSecondary,
      );

  // Mobile Label Text from Figma - Open Sans 14px (Mobile)
  static TextStyle get mobileLabelText => GoogleFonts.openSans(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        height: 1.4,
        color: AppColors.textSecondary,
      );

  // Body Text - Open Sans 18px (Desktop inputs)
  static TextStyle get bodyLarge => GoogleFonts.openSans(
        fontSize: 18,
        fontWeight: FontWeight.w400,
        height: 1.4,
        color: AppColors.textDark,
      );

  // Body Medium - Open Sans 16px (Mobile inputs)
  static TextStyle get bodyMedium => GoogleFonts.openSans(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        height: 1.4,
        color: AppColors.textDark,
      );

  // Body Small - Open Sans 12px
  static TextStyle get bodySmall => GoogleFonts.openSans(
        fontSize: 12,
        fontWeight: FontWeight.w400,
        height: 1.4,
        color: AppColors.textSecondary,
      );

  // Button Text - Open Sans 18px Bold (Desktop)
  static TextStyle get buttonText => GoogleFonts.openSans(
        fontSize: 18,
        fontWeight: FontWeight.w700,
        height: 1.36,
        color: AppColors.white,
      );

  // Mobile Button Text - Open Sans 16px Bold (Mobile)
  static TextStyle get mobileButtonText => GoogleFonts.openSans(
        fontSize: 16,
        fontWeight: FontWeight.w700,
        height: 1.36,
        color: AppColors.white,
      );

  // Radio Button Text - Open Sans 16px Bold
  static TextStyle get radioButtonText => GoogleFonts.openSans(
        fontSize: 16,
        fontWeight: FontWeight.w700,
        height: 1.4,
        letterSpacing: -0.5, // -3.125% of font size
        color: AppColors.textPrimary,
      );

  // Placeholder Text - Open Sans (Desktop 18px, Mobile 16px)
  static TextStyle get placeholderText => GoogleFonts.openSans(
        fontSize: 18,
        fontWeight: FontWeight.w400,
        height: 1.4,
        color: AppColors.textPlaceholder,
      );

  // Mobile Placeholder Text
  static TextStyle get mobilePlaceholderText => GoogleFonts.openSans(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        height: 1.4,
        color: AppColors.textPlaceholder,
      );

  // Footer Text - Open Sans 16px
  static TextStyle get footerText => GoogleFonts.openSans(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        height: 1.4,
        color: AppColors.textSecondary,
      );

  // Footer Link Text - Open Sans 14px Bold
  static TextStyle get footerLinkText => GoogleFonts.openSans(
        fontSize: 14,
        fontWeight: FontWeight.w700,
        height: 1.36,
        color: AppColors.textSecondary,
      );

  // Error Text - Open Sans 14px
  static TextStyle get errorText => GoogleFonts.openSans(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        height: 1.4,
        color: AppColors.error,
      );

  // Caption Text - Open Sans 12px
  static TextStyle get caption => GoogleFonts.openSans(
        fontSize: 12,
        fontWeight: FontWeight.w400,
        height: 1.4,
        color: AppColors.textSecondary,
      );

  // Status Bar Text - Open Sans 15px SemiBold
  static TextStyle get statusBarText => GoogleFonts.openSans(
        fontSize: 15,
        fontWeight: FontWeight.w600,
        height: 1.33,
        letterSpacing: -0.5,
        color: Colors.black,
      );

  // Additional text styles for theme compatibility
  static TextStyle get headingLarge => GoogleFonts.breeSerif(
        fontSize: 48,
        fontWeight: FontWeight.w400,
        height: 1.2,
        letterSpacing: -1.2,
        color: AppColors.textPrimary,
      );

  static TextStyle get headingMedium => GoogleFonts.breeSerif(
        fontSize: 36,
        fontWeight: FontWeight.w400,
        height: 1.2,
        letterSpacing: -0.9,
        color: AppColors.textPrimary,
      );

  static TextStyle get headingSmall => GoogleFonts.breeSerif(
        fontSize: 28,
        fontWeight: FontWeight.w400,
        height: 1.2,
        letterSpacing: -0.7,
        color: AppColors.textPrimary,
      );

  static TextStyle get subtitle => GoogleFonts.openSans(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        height: 1.4,
        color: AppColors.textSecondary,
      );

  static TextStyle get socialButtonText => GoogleFonts.openSans(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        height: 1.4,
        color: AppColors.textPrimary,
      );
}
