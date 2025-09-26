import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'app_text_styles.dart';

enum ThemeType { light, dark }

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      brightness: Brightness.light,
      colorScheme:
          ColorScheme.fromSwatch(
            primarySwatch: AppColors.primarySwatch,
            brightness: Brightness.light,
          ).copyWith(
            surface: AppColors.background,
            primary: AppColors.primary,
            onPrimary: AppColors.buttonText,
            secondary: AppColors.secondary,
            onSecondary: Colors.white,
            error: AppColors.error,
            onError: Colors.white,
            onSurface: AppColors.textPrimary,
            surfaceContainerHighest: AppColors.inputBackground,
            onSurfaceVariant: AppColors.textSecondary,
          ),
      scaffoldBackgroundColor: AppColors.background,
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.background,
        elevation: 0,
        iconTheme: IconThemeData(color: AppColors.textPrimary),
        titleTextStyle: TextStyle(
          color: AppColors.textPrimary,
          fontSize: 20,
          fontWeight: FontWeight.w600,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.buttonPrimary,
          foregroundColor: AppColors.buttonText,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 16),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primary,
          textStyle: AppTextStyles.buttonText,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primary,
          side: const BorderSide(color: AppColors.primary),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 16),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.inputBackground,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.inputBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.inputBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(
            color: AppColors.inputFocusedBorder,
            width: 2,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.error),
        ),
        contentPadding: const EdgeInsets.all(16),
        hintStyle: const TextStyle(color: AppColors.inputPlaceholder),
        labelStyle: const TextStyle(color: AppColors.inputLabel),
      ),
      dividerColor: AppColors.border,
      dividerTheme: const DividerThemeData(
        color: AppColors.border,
        thickness: 1,
      ),
      cardTheme: CardThemeData(
        color: AppColors.background,
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.background,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: AppColors.textSecondary,
        elevation: 8,
      ),
      textTheme: TextTheme(
        displayLarge: AppTextStyles.mainHeading.copyWith(
          color: AppColors.textPrimary,
        ),
        displayMedium: AppTextStyles.headingLarge.copyWith(
          color: AppColors.textPrimary,
        ),
        displaySmall: AppTextStyles.headingMedium.copyWith(
          color: AppColors.textPrimary,
        ),
        headlineLarge: AppTextStyles.headingSmall.copyWith(
          color: AppColors.textPrimary,
        ),
        headlineMedium: AppTextStyles.subtitle.copyWith(
          color: AppColors.textPrimary,
        ),
        headlineSmall: AppTextStyles.labelText.copyWith(
          color: AppColors.textPrimary,
        ),
        titleLarge: AppTextStyles.subtitle.copyWith(
          color: AppColors.textPrimary,
        ),
        titleMedium: AppTextStyles.labelText.copyWith(
          color: AppColors.textPrimary,
        ),
        bodyLarge: AppTextStyles.bodyLarge.copyWith(
          color: AppColors.textPrimary,
        ),
        bodyMedium: AppTextStyles.bodyMedium.copyWith(
          color: AppColors.textPrimary,
        ),
        labelLarge: AppTextStyles.buttonText.copyWith(
          color: AppColors.buttonText,
        ),
        bodySmall: AppTextStyles.caption.copyWith(
          color: AppColors.textSecondary,
        ),
        labelSmall: AppTextStyles.caption.copyWith(
          color: AppColors.textSecondary,
        ),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      colorScheme:
          ColorScheme.fromSwatch(
            primarySwatch: AppColors.primarySwatch,
            brightness: Brightness.dark,
          ).copyWith(
            surface: AppColors.darkSurface,
            primary: AppColors.primary,
            onPrimary: AppColors.buttonText,
            secondary: AppColors.secondary,
            onSecondary: Colors.white,
            error: AppColors.error,
            onError: Colors.white,
            onSurface: AppColors.darkTextPrimary,
            surfaceContainerHighest: AppColors.darkInputBackground,
            onSurfaceVariant: AppColors.darkTextSecondary,
          ),
      scaffoldBackgroundColor: AppColors.darkBackground,
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.darkBackground,
        elevation: 0,
        iconTheme: IconThemeData(color: AppColors.darkTextPrimary),
        titleTextStyle: TextStyle(
          color: AppColors.darkTextPrimary,
          fontSize: 20,
          fontWeight: FontWeight.w600,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.buttonPrimary,
          foregroundColor: AppColors.buttonText,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 16),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primary,
          textStyle: AppTextStyles.buttonText,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primary,
          side: const BorderSide(color: AppColors.primary),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 16),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.darkInputBackground,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.darkInputBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.darkInputBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.inputFocusedBorder, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.error),
        ),
        contentPadding: const EdgeInsets.all(16),
        hintStyle: TextStyle(color: AppColors.darkInputPlaceholder),
        labelStyle: TextStyle(color: AppColors.darkInputLabel),
      ),
      dividerColor: AppColors.darkBorder,
      dividerTheme: DividerThemeData(color: AppColors.darkBorder, thickness: 1),
      cardTheme: CardThemeData(
        color: AppColors.darkSurface,
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: AppColors.darkSurface,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: AppColors.darkTextSecondary,
        elevation: 8,
      ),
      textTheme: TextTheme(
        displayLarge: AppTextStyles.mainHeading.copyWith(
          color: AppColors.darkTextPrimary,
        ),
        displayMedium: AppTextStyles.headingLarge.copyWith(
          color: AppColors.darkTextPrimary,
        ),
        displaySmall: AppTextStyles.headingMedium.copyWith(
          color: AppColors.darkTextPrimary,
        ),
        headlineLarge: AppTextStyles.headingSmall.copyWith(
          color: AppColors.darkTextPrimary,
        ),
        headlineMedium: AppTextStyles.subtitle.copyWith(
          color: AppColors.darkTextPrimary,
        ),
        headlineSmall: AppTextStyles.labelText.copyWith(
          color: AppColors.darkTextPrimary,
        ),
        titleLarge: AppTextStyles.subtitle.copyWith(
          color: AppColors.darkTextPrimary,
        ),
        titleMedium: AppTextStyles.labelText.copyWith(
          color: AppColors.darkTextPrimary,
        ),
        bodyLarge: AppTextStyles.bodyLarge.copyWith(
          color: AppColors.darkTextPrimary,
        ),
        bodyMedium: AppTextStyles.bodyMedium.copyWith(
          color: AppColors.darkTextPrimary,
        ),
        labelLarge: AppTextStyles.buttonText.copyWith(
          color: AppColors.buttonText,
        ),
        bodySmall: AppTextStyles.caption.copyWith(
          color: AppColors.darkTextSecondary,
        ),
        labelSmall: AppTextStyles.caption.copyWith(
          color: AppColors.darkTextSecondary,
        ),
      ),
    );
  }
}
