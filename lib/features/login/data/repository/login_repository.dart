import 'package:collectors_card/core/dependencies/authentication/models/auth_steps.dart';
import 'package:collectors_card/core/dependencies/authentication/models/auth_responses.dart';

abstract interface class LoginRepository {
  Future<bool> addToBox<T>(String key, T? value);
  Future<T?> getFromBox<T>(String key);
  Future<AuthStep> login(String identity, String userName);
  Future<AuthSuccessResponse> verifyAuthenticationCode(
    String identity,
    String otp,
  );
  Future<AuthSuccessResponse> isSessionActive();
  Future<void> logout();
}
