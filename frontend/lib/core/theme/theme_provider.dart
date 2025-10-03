import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'app_theme.dart';

// State notifier for theme management
class ThemeNotifier extends StateNotifier<ThemeType> {
  ThemeNotifier() : super(ThemeType.light) {
    _loadTheme();
  }

  static const String _themeKey = 'theme_mode';

  // Load theme from shared preferences
  Future<void> _loadTheme() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final themeString = prefs.getString(_themeKey) ?? 'light';
      state = themeString == 'dark' ? ThemeType.dark : ThemeType.light;
    } catch (e) {
      // If there's an error loading, default to light theme
      state = ThemeType.light;
    }
  }

  // Save theme to shared preferences
  Future<void> _saveTheme(ThemeType theme) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(
        _themeKey,
        theme == ThemeType.dark ? 'dark' : 'light',
      );
    } catch (e) {
      // Handle error silently
    }
  }

  // Toggle between light and dark theme
  Future<void> toggleTheme() async {
    final newTheme = state == ThemeType.light
        ? ThemeType.dark
        : ThemeType.light;
    state = newTheme;
    await _saveTheme(newTheme);
  }

  // Set specific theme
  Future<void> setTheme(ThemeType theme) async {
    if (state != theme) {
      state = theme;
      await _saveTheme(theme);
    }
  }

  // Get current theme data
  ThemeData get currentThemeData {
    return state == ThemeType.light ? AppTheme.lightTheme : AppTheme.darkTheme;
  }

  // Check if current theme is dark
  bool get isDarkMode => state == ThemeType.dark;
}

// Provider for theme notifier
final themeProvider = StateNotifierProvider<ThemeNotifier, ThemeType>((ref) {
  return ThemeNotifier();
});

// Provider for getting current theme data
final currentThemeProvider = Provider<ThemeData>((ref) {
  final themeType = ref.watch(themeProvider);
  return themeType == ThemeType.light
      ? AppTheme.lightTheme
      : AppTheme.darkTheme;
});

// Provider for checking if dark mode is enabled
final isDarkModeProvider = Provider<bool>((ref) {
  final themeType = ref.watch(themeProvider);
  return themeType == ThemeType.dark;
});
