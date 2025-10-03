import 'package:flutter/material.dart';

import '../../base/responsive_builder_mixin.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_text_styles.dart';

class ResponsiveLoginButton extends StatelessWidget with ResponsiveBuilder {
  final bool isEnabled;
  final bool isLoading;
  final VoidCallback? onPressed;
  final String? text;

  const ResponsiveLoginButton({
    super.key,
    required this.isEnabled,
    required this.isLoading,
    this.onPressed,
    this.text,
  });

  @override
  Widget build(BuildContext context) {
    final isMobileScreen = isMobile(context);
    final isTabletScreen = isTablet(context);

    if (isMobileScreen || isTabletScreen) {
      return SizedBox(
        width: double.infinity,
        height: 50,
        child: _buildButton(context, isMobile: true),
      );
    } else {
      return SizedBox(
        width: double.infinity,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            SizedBox(
              width: 264,
              height: 50,
              child: _buildButton(context, isMobile: false),
            ),
          ],
        ),
      );
    }
  }

  Widget _buildButton(BuildContext context, {required bool isMobile}) {
    return ElevatedButton(
      onPressed: isEnabled && !isLoading ? onPressed : null,
      style: ElevatedButton.styleFrom(
        backgroundColor: isEnabled
            ? AppColors
                  .lavender // Accent purple (active)
            : AppColors.pewter, // Disabled state
        disabledBackgroundColor: AppColors.pewter,
        foregroundColor: AppColors.eggshell,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12), // consistent with inputs
        ),
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 32),
        elevation: 0,
      ),
      child: isLoading
          ? const SizedBox(
              height: 22,
              width: 22,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.eggshell),
              ),
            )
          : Text(
              text?.toUpperCase() ?? "LOGIN",
              style: isMobile
                  ? AppTextStyles.mobileButtonText.copyWith(
                      color: AppColors.eggshell,
                    )
                  : AppTextStyles.buttonText.copyWith(
                      color: AppColors.eggshell,
                    ),
            ),
    );
  }
}
