part of 'auth_service.dart';

class AuthSession {
  AuthSession({
    required this.jwtToken,
    required this.userId,
    required this.isValid,
    required this.accessToken,
    required this.refreshToken,
  });

  factory AuthSession._fromCognito(CognitoAuthSession session) {
    return AuthSession(
      jwtToken: session.userPoolTokensResult.value.idToken.raw,
      userId: session.userSubResult.value,
      isValid: session.isSignedIn,
      accessToken: session.userPoolTokensResult.value.idToken.raw,
      refreshToken: session.userPoolTokensResult.value.refreshToken,
    );
  }

  final String jwtToken;
  final String userId;
  final bool isValid;
  final String accessToken;
  final String refreshToken;
}
