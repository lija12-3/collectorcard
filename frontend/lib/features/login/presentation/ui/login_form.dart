import 'package:collectors_card/features/login/presentation/state/login_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/common/enums/contact_type.dart';
import '../../../../core/common/widgets/custom_input_field.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../view_model/login_view_model.dart';

class LoginForm extends ConsumerWidget {
  const LoginForm({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final loginState = ref.watch(loginViewModelProvider);
    final loginNotifier = ref.read(loginViewModelProvider.notifier);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Last Name field
        _FieldWithLabel(
          label: "Last Name",
          child: CustomInputField(
            label: "",
            placeholder: "Enter your last name",
            value: loginState.lastName,
            onChanged: (value) => loginNotifier.updateLastName(lastName: value),
          ),
        ),
        const SizedBox(height: 24),

        // Contact field with radio switch (Phone / Email)
        _FieldWithLabel(
          label: "Contact",
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _ContactTypeRadios(
                loginState: loginState,
                loginNotifier: loginNotifier,
              ),
              const SizedBox(height: 16),
              CustomInputField(
                label: "",
                placeholder: loginState.contactType == ContactType.phone
                    ? "474-321-4456"
                    : "Enter your email",
                value: loginState.contact,
                prefixIcon: loginState.contactType == ContactType.phone
                    ? Icon(
                        Icons.phone,
                        size: 18,
                        color: AppColors.misty,
                      ) // subtle icon
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
        const SizedBox(height: 24),

        // PSP ID field
        _FieldWithLabel(
          label: "PSP ID",
          child: CustomInputField(
            label: "",
            placeholder: "123456789",
            value: loginState.pspId,
            keyboardType: TextInputType.number,
            onChanged: (value) => loginNotifier.updatePspId(pspId: value),
          ),
        ),
      ],
    );
  }
}

class _ContactTypeRadios extends StatelessWidget {
  final LoginState loginState;
  final LoginViewModel loginNotifier;

  const _ContactTypeRadios({
    required this.loginState,
    required this.loginNotifier,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _RadioChip(
          text: "Phone",
          isSelected: loginState.contactType == ContactType.phone,
          onTap: () => loginNotifier.updateContactType(contactType: "phone"),
        ),
        const SizedBox(width: 16),
        _RadioChip(
          text: "Email",
          isSelected: loginState.contactType == ContactType.email,
          onTap: () => loginNotifier.updateContactType(contactType: "email"),
        ),
      ],
    );
  }
}

class _RadioChip extends StatelessWidget {
  final String text;
  final bool isSelected;
  final VoidCallback onTap;

  const _RadioChip({
    required this.text,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.lavender : AppColors.boulder,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isSelected ? AppColors.lavender : AppColors.pewter,
          ),
        ),
        child: Text(
          text,
          style: AppTextStyles.bodyMedium.copyWith(
            color: isSelected ? AppColors.rocket : AppColors.lavender,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}

class _FieldWithLabel extends StatelessWidget {
  final String label;
  final Widget child;

  const _FieldWithLabel({required this.label, required this.child});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: AppTextStyles.labelText.copyWith(
            color: AppColors.lavender, // accent purple
          ),
        ),
        const SizedBox(height: 8),
        child,
      ],
    );
  }
}
