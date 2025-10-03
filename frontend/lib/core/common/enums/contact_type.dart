enum ContactType {
  phone("phone"),
  email("email");

  const ContactType(this.value);
  final String value;

  static ContactType fromString(String value) {
    switch (value.toLowerCase()) {
      case 'phone':
        return ContactType.phone;
      case 'email':
        return ContactType.email;
      default:
        throw ArgumentError('Invalid contact type: $value');
    }
  }
}
