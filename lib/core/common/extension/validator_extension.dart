extension ValidatorExtension on String {
  bool isValidEmail() => RegExp(
        r"^[\w-+\.]+@([\w-]+\.)+[\w-]{2,4}$",
      ).hasMatch(this);

  bool isValidPhone() =>
      RegExp(r'^\d{9,}$').hasMatch(replaceAll(RegExp(r'[^\d]'), ''));

  bool hasMinimum8Characters() => RegExp(r'^.{8,}$').hasMatch(this);

  bool hasMinimum4Characters([int min = 4]) =>
      RegExp('^.{$min,}\$').hasMatch(this);

  bool hasUppercase() => RegExp('^.*?[A-Z]').hasMatch(this);

  bool hasNumericalCharacters() => RegExp('^(?=.*?[0-9])').hasMatch(this);

  bool hasSpecialCharacters() => RegExp(r'^(?=.*?[!@#\$&*~])').hasMatch(this);

  bool isValid() =>
      hasMinimum8Characters() &&
      hasUppercase() &&
      hasNumericalCharacters() &&
      hasSpecialCharacters();
}
