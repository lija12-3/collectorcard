import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'app_text_styles.dart';

enum ThemeType { light, dark }

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      brightness: Brightness.light,
      colorScheme: ColorScheme(
        brightness: Brightness.light,
        primary: AppColors.primaryAccentBackground,
        onPrimary: AppColors.vibrantAccentText,
        secondary: AppColors.secondaryAccentAlphaBackground,
        onSecondary: AppColors.subtleAccentText,
        error: AppColors.vibrantSemanticErrorFill,
        onError: AppColors.vibrantSemanticErrorText,
        surface: AppColors.eggshell,
        onSurface: AppColors.rocket,
      ),
      scaffoldBackgroundColor: AppColors.eggshell,

      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.eggshell,
        elevation: 0,
        iconTheme: IconThemeData(color: AppColors.rocket),
        titleTextStyle: AppTextStyles.headingLarge.copyWith(
          color: AppColors.rocket,
        ),
      ),

      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.vibrantAccentFill,
          foregroundColor: AppColors.vibrantAccentText,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 16),
        ),
      ),

      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primaryAccentBackground,
          textStyle: AppTextStyles.buttonText,
        ),
      ),

      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primaryAccentBackground,
          side: BorderSide(color: AppColors.subtleStaticAccentBorder),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 16),
        ),
      ),

      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.eggshell,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.subtleStaticAccentBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.subtleStaticAccentBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: AppColors.vibrantAccentBorder,
            width: 2,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.vibrantSemanticErrorFill),
        ),
        contentPadding: const EdgeInsets.all(16),
        hintStyle: TextStyle(color: AppColors.misty),
        labelStyle: TextStyle(color: AppColors.ash),
      ),

      cardTheme: CardThemeData(
        color: AppColors.eggshell,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),

      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: AppColors.eggshell,
        selectedItemColor: AppColors.vibrantAccentFill,
        unselectedItemColor: AppColors.misty,
      ),

      textTheme: TextTheme(
        displayLarge: AppTextStyles.mainHeading.copyWith(
          color: AppColors.rocket,
        ),
        displayMedium: AppTextStyles.headingLarge.copyWith(
          color: AppColors.rocket,
        ),
        displaySmall: AppTextStyles.headingMedium.copyWith(
          color: AppColors.rocket,
        ),
        bodyLarge: AppTextStyles.bodyLarge.copyWith(color: AppColors.rocket),
        bodyMedium: AppTextStyles.bodyMedium.copyWith(color: AppColors.ash),
        labelLarge: AppTextStyles.buttonText.copyWith(
          color: AppColors.vibrantAccentText,
        ),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      colorScheme: ColorScheme(
        brightness: Brightness.dark,
        primary: AppColors.primaryAccentBackground,
        onPrimary: AppColors.vibrantAccentText,
        secondary: AppColors.secondaryAccentAlphaBackground,
        onSecondary: AppColors.subtleAccentText,
        error: AppColors.vibrantSemanticErrorFill,
        onError: AppColors.vibrantSemanticErrorText,
        surface: AppColors.rocket,
        onSurface: AppColors.eggshell,
      ),
      scaffoldBackgroundColor: AppColors.rocket,
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.rocket,
        elevation: 0,
        iconTheme: IconThemeData(color: AppColors.eggshell),
        titleTextStyle: AppTextStyles.headingLarge.copyWith(
          color: AppColors.eggshell,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.vibrantAccentFill,
          foregroundColor: AppColors.vibrantAccentText,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 16),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primaryAccentBackground,
          textStyle: AppTextStyles.buttonText,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primaryAccentBackground,
          side: BorderSide(color: AppColors.subtleStaticAccentBorder),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 16),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.rocket,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.subtleStaticAccentBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.subtleStaticAccentBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: AppColors.vibrantAccentBorder,
            width: 2,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.vibrantSemanticErrorFill),
        ),
        contentPadding: const EdgeInsets.all(16),
        hintStyle: TextStyle(color: AppColors.misty),
        labelStyle: TextStyle(color: AppColors.ash),
      ),
      cardTheme: CardThemeData(
        color: AppColors.rocket,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: AppColors.rocket,
        selectedItemColor: AppColors.vibrantAccentFill,
        unselectedItemColor: AppColors.misty,
      ),
      textTheme: TextTheme(
        displayLarge: AppTextStyles.mainHeading.copyWith(
          color: AppColors.eggshell,
        ),
        displayMedium: AppTextStyles.headingLarge.copyWith(
          color: AppColors.eggshell,
        ),
        displaySmall: AppTextStyles.headingMedium.copyWith(
          color: AppColors.eggshell,
        ),
        bodyLarge: AppTextStyles.bodyLarge.copyWith(color: AppColors.eggshell),
        bodyMedium: AppTextStyles.bodyMedium.copyWith(color: AppColors.ash),
        labelLarge: AppTextStyles.buttonText.copyWith(
          color: AppColors.vibrantAccentText,
        ),
      ),
    );
  }
}
