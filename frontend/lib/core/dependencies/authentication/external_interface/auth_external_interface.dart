import 'package:collectors_card/core/dependencies/authentication/mixin/auth_exception_mixin.dart';
import 'package:collectors_card/core/dependencies/authentication/models/auth_responses.dart';
import 'package:collectors_card/core/dependencies/authentication/models/auth_steps.dart';
import 'package:collectors_card/core/dependencies/authentication/service/auth_service.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final authExternalInterfaceProvider = Provider<AuthExternalInterface>((ref) {
  final authService = ref.watch(authServiceProvider);
  return AuthExternalInterface(authService);
});

class AuthExternalInterface with AuthExceptionMixin {
  AuthExternalInterface(this._authService);
  final AuthService _authService;

  Future<bool> signUp(String name, String email, String password) async {
    return callAuthService(
      () => _authService.register(name: name, email: email, password: password),
    );
  }

  Future<AuthStep> unifiedLogin(String identity, String userName) async {
    return callAuthService(
      () => _authService.passwordLessSignIn(identity: identity, name: userName),
    );
  }

  Future<AuthSuccessResponse> confirmAuthentication(String otp) async {
    return callAuthService(() async {
      await _authService.confirmAuthentication(confirmationCode: otp);
      return await _successResponse;
    });
  }

  Future<AuthSuccessResponse> isSessionActive() {
    return callAuthService(() async {
      return await _successResponse;
    });
  }

  Future<void> logout() async {
    return callAuthService(() async {
      return await _authService.logOut();
    });
  }

  Future<AuthSuccessResponse> get _successResponse async {
    final session = await _authService.getSession();
    return AuthSuccessResponse(
      userId: session.userId,
      isValidSession: session.isValid,
      jwtIdToken: session.jwtToken,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    );
  }

  Future<AuthUserData> getUserDetails() {
    return callAuthService(() async {
      return await _authService.getCurrentUserData();
    });
  }

  Future<bool> verifyUserForPasswordReset(String email) {
    return callAuthService(() async {
      return await _authService.verifyUserForPasswordReset(
        associatedEmail: email,
      );
    });
  }
}
