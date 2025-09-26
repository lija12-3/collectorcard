import 'package:collectors_card/core/base/responsive_builder_mixin.dart';
import 'package:collectors_card/features/login/presentation/state/login_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/common/enums/contact_type.dart';
import '../../../../core/common/widgets/custom_input_field.dart';
import '../../../../core/common/widgets/custom_radio_button.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../view_model/login_view_model.dart';

class LoginForm extends ConsumerWidget with ResponsiveBuilder {
  const LoginForm({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final loginState = ref.watch(loginViewModelProvider);
    final loginNotifier = ref.read(loginViewModelProvider.notifier);
    final isMobileScreen = isMobile(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildFieldWithLabel(
          label: "Last Name",
          isMobile: isMobileScreen,
          child: CustomInputField(
            label: isMobileScreen ? "" : "Last Name",
            placeholder: isMobileScreen ? " " : "Enter your last name",
            value: loginState.lastName,
            onChanged: (value) => loginNotifier.updateLastName(lastName: value),
          ),
        ),

        SizedBox(height: isMobileScreen ? 16 : 24),

        _buildFieldWithLabel(
          label: "Contact",
          isMobile: isMobileScreen,
          child: Column(
            children: [
              _buildContactTypeRadios(
                loginState,
                loginNotifier,
                isMobileScreen,
              ),
              SizedBox(height: isMobileScreen ? 16 : 16),
              CustomInputField(
                label: "",
                placeholder: loginState.contactType == ContactType.phone
                    ? "474-321-4456"
                    : "Enter your email",
                value: loginState.contact,
                prefixIcon: loginState.contactType == ContactType.phone
                    ? Icon(Icons.phone, size: 16, color: Color(0xFF51534A))
                    : null,
                keyboardType: loginState.contactType == ContactType.phone
                    ? TextInputType.phone
                    : TextInputType.emailAddress,
                onChanged: (value) =>
                    loginNotifier.updateContact(contact: value),
              ),
            ],
          ),
        ),

        SizedBox(height: isMobileScreen ? 16 : 24),
        _buildFieldWithLabel(
          label: "PSP ID",
          isMobile: isMobileScreen,
          child: CustomInputField(
            label: isMobileScreen ? "" : "PSP ID",
            placeholder: "123456789",
            value: loginState.pspId,
            keyboardType: TextInputType.number,
            onChanged: (value) => loginNotifier.updatePspId(pspId: value),
          ),
        ),
      ],
    );
  }

  Widget _buildContactTypeRadios(
    LoginState loginState,
    LoginViewModel loginNotifier,
    bool isMobile,
  ) {
    return Row(
      children: [
        CustomRadioButton(
          text: "Phone",
          isSelected: loginState.contactType == ContactType.phone,
          onTap: () => loginNotifier.updateContactType(contactType: "phone"),
        ),
        SizedBox(width: isMobile ? 24 : 24),
        CustomRadioButton(
          text: "Email",
          isSelected: loginState.contactType == ContactType.email,
          onTap: () => loginNotifier.updateContactType(contactType: "email"),
        ),
      ],
    );
  }

  Widget _buildFieldWithLabel({
    required String label,
    required Widget child,
    required bool isMobile,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (label.isNotEmpty)
          Text(
            label,
            style: isMobile
                ? AppTextStyles.mobileLabelText
                : AppTextStyles.labelText,
          ),
        if (label.isNotEmpty) const SizedBox(height: 4),
        child,
      ],
    );
  }
}
