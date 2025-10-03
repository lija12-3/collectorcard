import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_text_styles.dart';

class CustomInputField extends StatefulWidget {
  final String label;
  final String placeholder;
  final String? value;
  final ValueChanged<String>? onChanged;
  final bool isPassword;
  final TextInputType keyboardType;
  final String? errorText;
  final bool isRequired;
  final int? maxLines;
  final TextEditingController? controller;
  final bool enabled;
  final Widget? suffixIcon;
  final Widget? prefixIcon;

  const CustomInputField({
    super.key,
    required this.label,
    required this.placeholder,
    this.value,
    this.onChanged,
    this.isPassword = false,
    this.keyboardType = TextInputType.text,
    this.errorText,
    this.isRequired = false,
    this.maxLines = 1,
    this.controller,
    this.enabled = true,
    this.suffixIcon,
    this.prefixIcon,
  });

  @override
  State<CustomInputField> createState() => _CustomInputFieldState();
}

class _CustomInputFieldState extends State<CustomInputField> {
  late TextEditingController _controller;
  bool _isObscured = true;

  @override
  void initState() {
    super.initState();
    _controller =
        widget.controller ?? TextEditingController(text: widget.value);
    _isObscured = widget.isPassword;
  }

  @override
  void dispose() {
    if (widget.controller == null) {
      _controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: _controller,
      onChanged: widget.onChanged,
      obscureText: widget.isPassword && _isObscured,
      keyboardType: widget.keyboardType,
      maxLines: widget.maxLines,
      enabled: widget.enabled,
      style: AppTextStyles.bodyMedium.copyWith(color: AppColors.eggshell),
      decoration: InputDecoration(
        hintText: widget.placeholder,
        hintStyle: AppTextStyles.placeholderText.copyWith(
          color: AppColors.misty,
        ),
        filled: true,
        fillColor: AppColors.boulder, // dark background
        contentPadding: EdgeInsets.symmetric(
          horizontal: 16,
          vertical: widget.maxLines == 1 ? 16 : 18,
        ),
        prefixIcon: widget.prefixIcon,
        suffixIcon: widget.isPassword
            ? IconButton(
                icon: Icon(
                  _isObscured ? Icons.visibility_off : Icons.visibility,
                  color: AppColors.lavender, // accent toggle
                  size: 20,
                ),
                onPressed: () {
                  setState(() {
                    _isObscured = !_isObscured;
                  });
                },
              )
            : widget.suffixIcon,
        // Border styling
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.ash, width: 1),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.ash, width: 1),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.lavender, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.vermillion, width: 1),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.vermillion, width: 2),
        ),
        disabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: AppColors.ash.withValues(alpha: 0.4),
            width: 1,
          ),
        ),
        // Error text
        errorText: widget.errorText,
        errorStyle: AppTextStyles.caption.copyWith(color: AppColors.vermillion),
      ),
    );
  }
}
