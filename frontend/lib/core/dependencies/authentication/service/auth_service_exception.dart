part of 'auth_service.dart';

class AuthServiceException implements Exception {
  AuthServiceException({
    required this.message,
    required this.stackTrace,
    this.suggestion,
    this.underlyingException,
  });

  factory AuthServiceException._fromAmplify(
    AmplifyException e,
    StackTrace s,
  ) {
    return AuthServiceException(
      message: e.message,
      suggestion: e.recoverySuggestion,
      stackTrace: s,
      underlyingException: e.underlyingException.toString(),
    );
  }

  final String message;
  final StackTrace stackTrace;
  final String? suggestion;
  final String? underlyingException;

  @override
  String toString() {
    return 'AuthServiceException{message: $message, suggestion: $suggestion}\nFrom: $underlyingException}';
  }
}
