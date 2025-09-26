import 'package:flutter/material.dart';

import '../../base/responsive_builder_mixin.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_text_styles.dart';

class CustomRadioButton extends StatelessWidget with ResponsiveBuilder {
  final String text;
  final bool isSelected;
  final VoidCallback onTap;

  const CustomRadioButton({
    super.key,
    required this.text,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(child: _buildRadioContainer());
  }

  Widget _buildRadioContainer() {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 32,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.backgroundGray : Colors.transparent,
          border: Border.all(
            color: isSelected
                ? AppColors.borderLight
                : AppColors.border.withValues(alpha: 0.6),
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(6),
        ),
        child: Center(child: Text(text, style: AppTextStyles.radioButtonText)),
      ),
    );
  }
}
