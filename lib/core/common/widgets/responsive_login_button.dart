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
    // ignore: unused_local_variable
    final isDesktopScreen = isDesktop(context);
    final isTabletScreen = isTablet(context);

    if (isMobileScreen || isTabletScreen) {
      // Mobile: Fixed width centered button (handled in CTA section)
      return SizedBox(
        width: 325,
        height: 50,
        child: _buildButton(context, isMobile: true),
      );
    } else {
      // Desktop/Tablet: Right-aligned button with fixed width
      return SizedBox(
        width: double.infinity,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            SizedBox(
              width: 264, // Slightly wider for tablet
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
      onPressed: isEnabled ? onPressed : null,
      style: ElevatedButton.styleFrom(
        disabledBackgroundColor: AppColors.buttonPrimaryDisabled,
        backgroundColor: AppColors.buttonPrimary,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(isMobile ? 6 : 8),
        ),
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 32),
      ),
      child: isLoading
          ? const SizedBox(
              height: 20,
              width: 20,
              child: CircularProgressIndicator(
                color: Colors.white,
                strokeWidth: 2,
              ),
            )
          : Text(
              text?.toUpperCase() ?? "LOGIN",
              style: isMobile
                  ? AppTextStyles.mobileButtonText
                  : AppTextStyles.buttonText,
            ),
    );
  }
}
