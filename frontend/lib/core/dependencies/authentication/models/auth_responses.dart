import 'package:equatable/equatable.dart';

class AuthSuccessResponse extends Equatable {
  const AuthSuccessResponse({
    required this.isValidSession,
    required this.userId,
    required this.accessToken,
    required this.refreshToken,
    required this.jwtIdToken,
  });

  factory AuthSuccessResponse.empty() {
    return const AuthSuccessResponse(
      isValidSession: false,
      userId: '',
      jwtIdToken: '',
      accessToken: '',
      refreshToken: '',
    );
  }

  final bool isValidSession;
  final String userId;
  final String jwtIdToken;
  final String accessToken;
  final String refreshToken;

  @override
  List<Object?> get props => [isValidSession, userId, jwtIdToken, accessToken, refreshToken];
}
