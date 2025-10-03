import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_text_styles.dart';

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool isSecondary;
  final EdgeInsetsGeometry? padding;
  final double? width;

  const CustomButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.isSecondary = false,
    this.padding,
    this.width,
  });

  @override
  Widget build(BuildContext context) {
    final backgroundColor = isSecondary
        ? AppColors.eggshell
        : AppColors.vibrantAccentFill;

    final textColor = isSecondary
        ? AppColors.rocket
        : AppColors.vibrantAccentText;

    return SizedBox(
      width: width ?? double.infinity,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: backgroundColor,
          foregroundColor: textColor,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: padding ?? const EdgeInsets.symmetric(vertical: 16),
        ),
        child: isLoading
            ? const SizedBox(
                height: 20,
                width: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    AppColors.vibrantAccentText,
                  ),
                ),
              )
            : Text(
                text,
                style: AppTextStyles.buttonText.copyWith(color: textColor),
              ),
      ),
    );
  }
}
