part of 'auth_service.dart';

class AuthUserData {
  AuthUserData({
    required this.userId,
    required this.email,
    this.userFullName = "",
  });

  final String userId;
  final String email;
  final String userFullName;
}
