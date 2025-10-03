import 'package:collectors_card/features/login/presentation/state/login_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/base/responsive_builder_mixin.dart';
import '../../../../core/common/widgets/custom_input_field.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../view_model/login_view_model.dart';

class VerifyOtpForm extends ConsumerWidget with ResponsiveBuilder {
  const VerifyOtpForm({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final loginState = ref.watch(loginViewModelProvider);
    final loginNotifier = ref.read(loginViewModelProvider.notifier);
    final isMobileScreen = isMobile(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (!isMobileScreen) ...[
          _buildBackButtonRow(context, loginNotifier),
          const SizedBox(height: 16),
        ],
        Text(
          "Verification Code",
          style: isMobileScreen
              ? AppTextStyles.mobileMainHeading
              : AppTextStyles.mainHeading,
        ),

        SizedBox(height: isMobileScreen ? 16 : 16),
        Text(
          "We have sent a 6-digit code to ${_formatContact(loginState.contact)}. ${isMobileScreen ? '' : 'By confirming the email address, you can get access to all features.'}",
          style: isMobileScreen
              ? AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.subtleAccentText,
                )
              : AppTextStyles.bodyLarge.copyWith(
                  color: AppColors.subtleAccentText,
                ),
        ),
        SizedBox(height: isMobileScreen ? 32 : 48),
        Text("Enter Code", style: AppTextStyles.labelText),
        const SizedBox(height: 8),
        _buildOtpInputFields(
          context,
          loginState,
          loginNotifier,
          isMobileScreen,
        ),
        SizedBox(height: isMobileScreen ? 16 : 32),
        _buildResendButton(loginState, loginNotifier, isMobileScreen),
      ],
    );
  }

  Widget _buildBackButtonRow(BuildContext context, loginNotifier) {
    return Row(
      children: [
        InkWell(
          onTap: () => loginNotifier.goBackToLogin(),
          child: SizedBox(
            width: 24,
            height: 24,
            child: Icon(
              Icons.chevron_left,
              color: AppColors.subtleAccentText,
              size: 18,
            ),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          "Login",
          style: AppTextStyles.bodyLarge.copyWith(
            fontWeight: FontWeight.w700,
            color: AppColors.subtleAccentText,
          ),
        ),
      ],
    );
  }

  Widget _buildOtpInputFields(
    BuildContext context,
    loginState,
    loginNotifier,
    bool isMobile,
  ) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: List.generate(6, (index) {
        return SizedBox(
          width: isMobile ? 41 : 62,
          height: isMobile ? 49 : 62,
          child: CustomInputField(
            label: "",
            placeholder: " ",
            value: index < loginState.otpCode.length
                ? loginState.otpCode[index]
                : "",
            keyboardType: TextInputType.number,
            onChanged: (value) {
              String newOtpCode = loginState.otpCode;
              if (value.isNotEmpty && value.length == 1) {
                if (index < newOtpCode.length) {
                  newOtpCode =
                      newOtpCode.substring(0, index) +
                      value +
                      newOtpCode.substring(index + 1);
                } else {
                  while (newOtpCode.length < index) {
                    newOtpCode += " ";
                  }
                  newOtpCode += value;
                }

                if (index < 5) {
                  FocusScope.of(context).nextFocus();
                }
              } else if (value.isEmpty) {
                if (index < newOtpCode.length) {
                  newOtpCode =
                      "${newOtpCode.substring(0, index)} ${newOtpCode.substring(index + 1)}";
                }

                // Focus previous field
                if (index > 0) {
                  FocusScope.of(context).previousFocus();
                }
              }

              loginNotifier.updateOtpCode(otpCode: newOtpCode.trim());
            },
          ),
        );
      }),
    );
  }

  Widget _buildResendButton(
    LoginState loginState,
    LoginViewModel loginNotifier,
    bool isMobile,
  ) {
    final isEnabled = loginState.canResendOtp;
    final timerText = loginState.canResendOtp
        ? "Resend Code"
        : "You can resend code in ${loginState.resendTimer}s";

    return InkWell(
      onTap: isEnabled ? () => loginNotifier.resendOtpCode() : null,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        child: Text(
          timerText,
          style: AppTextStyles.buttonText.copyWith(
            color: isEnabled
                ? AppColors.subtleAccentText
                : AppColors.subtleAccentText.withValues(alpha: 0.32),
            fontSize: 14,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }

  String _formatContact(String contact) {
    if (contact.contains('@')) {
      return contact;
    } else {
      if (contact.length >= 10) {
        return "(${contact.substring(0, 3)})${contact.substring(3, 6)}-${contact.substring(6)}";
      }
      return contact;
    }
  }
}
