import 'package:amplify_auth_cognito/amplify_auth_cognito.dart'
    hide AuthSession, AuthUser;
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:collectors_card/core/dependencies/authentication/models/auth_steps.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

export 'package:amplify_flutter/amplify_flutter.dart' show AuthCategory;
import 'dart:math';

part 'auth_service_exception.dart';
part 'auth_session.dart';
part 'auth_user.dart';

final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService();
});

class AuthService {
  AuthService({AuthCategory? authCategory})
    : _auth = authCategory ?? Amplify.Auth;

  final AuthCategory _auth;

  Future<bool> get isPhoneVerified {
    return _handleException(() async {
      final attributes = await _auth.fetchUserAttributes();
      return attributes.any(_isPhoneVerified);
    });
  }

  Future<bool> register({
    required String email,
    required String password,
    required String name,
  }) {
    final userAttributes = {
      CognitoUserAttributeKey.email: email,
      CognitoUserAttributeKey.givenName: name,
    };

    return _handleException(() async {
      final result = await _auth.signUp(
        username: email,
        password: password,
        options: SignUpOptions(userAttributes: userAttributes),
      );
      return result.userId != null ? result.userId!.isNotEmpty : false;
    });
  }

  Future<void> verifyEmail({required String confirmationCode}) {
    return _handleException(
      () => _auth.confirmUserAttribute(
        userAttributeKey: CognitoUserAttributeKey.email,
        confirmationCode: confirmationCode,
      ),
    );
  }

  Future<bool> verifyEmailCode({
    required String email,
    required String confirmationCode,
  }) {
    return _handleException(() async {
      final result = await _auth.confirmSignUp(
        username: email,
        confirmationCode: confirmationCode,
      );
      return result.isSignUpComplete;
    });
  }

  Future<void> socialLogin({required AuthProvider provider}) {
    return _handleException(() async {
      await _auth.signInWithWebUI(provider: provider);
      return;
    });
  }

  Future<bool> socialLoginMobile({required AuthProvider provider}) {
    return _handleException(() async {
      final result = await _auth.signInWithWebUI(provider: provider);
      return result.isSignedIn;
    });
  }

  Future<bool> authenticate({required String identity}) {
    return _handleException(() async {
      debugPrint("Authenticating with identity: $identity");
      final result = await _auth.signIn(
        username: identity,
        options: const SignInOptions(
          pluginOptions: CognitoSignInPluginOptions(
            authFlowType: AuthenticationFlowType
                .customAuthWithoutSrp, // Changed for passwordless
          ),
        ),
      );
      final nextStep = result.nextStep;

      debugPrint('Next step: ${nextStep.signInStep}');

      if (nextStep.signInStep == AuthSignInStep.confirmSignUp) {
        throw const UserNotConfirmedException("User is not confirmed.");
      }
      if (nextStep.signInStep == AuthSignInStep.confirmSignInWithSmsMfaCode) {
        final details = nextStep.codeDeliveryDetails;

        throw MFARequiredAuthServiceException(
          deliveryMethod: details?.deliveryMedium.toString() ?? '',
          destination: details?.destination ?? '',
        );
      }
      return result.isSignedIn;
    });
  }

  /// Generates a random password of the given length.
  ///
  /// The password is composed of the characters [a-zA-Z0-9!@#%^&*()_+-=].
  /// The length of the password is 32 characters by default.
  String generateRandomPassword([int length = 32]) {
    const chars =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#%^&*()_+-=';
    final rand = Random.secure();
    return List.generate(
      length,
      (index) => chars[rand.nextInt(chars.length)],
    ).join();
  }

  Future<void> passwordLessSignup({
    required String identity,
    required String name,
  }) async {
    final isEmail = identity.contains('@');
    final userAttributes = <AuthUserAttributeKey, String>{
      if (isEmail)
        CognitoUserAttributeKey.email: identity
      else
        CognitoUserAttributeKey.phoneNumber: identity,
      CognitoUserAttributeKey.name: name, // Standard attribute
    };
    await Amplify.Auth.signUp(
      username: identity,
      password: "${generateRandomPassword()}123",
      options: SignUpOptions(userAttributes: userAttributes),
    );
    return;
  }

  Future<AuthStep> passwordLessSignIn({
    required String identity,
    required String name,
  }) async {
    try {
      final result = await Amplify.Auth.signIn(
        username: identity,
        options: const SignInOptions(
          pluginOptions: CognitoSignInPluginOptions(
            authFlowType: AuthenticationFlowType.customAuthWithoutSrp,
          ),
        ),
      );

      final nextStep = result.nextStep;
      if (nextStep.signInStep ==
          AuthSignInStep.confirmSignInWithCustomChallenge) {
        return AuthStep.confirmSignInWithCustomChallenge;
      }
    } on UserLambdaValidationException catch (e) {
      if (e.message.contains("Invalid or missing email address") ||
          e.message.contains("Invalid or missing phone number")) {
        await passwordLessSignup(identity: identity, name: name);
        return await passwordLessSignIn(identity: identity, name: name);
      }
    }
    return AuthStep.error;
  }

  Future<bool> confirmAuthentication({required String confirmationCode}) {
    return _handleException(() async {
      final result = await _auth.confirmSignIn(
        confirmationValue: confirmationCode,
      );
      return result.isSignedIn;
    });
  }

  Future<String?> resendEmailVerification({required String email}) {
    return _handleException(() async {
      final result = await _auth.resendSignUpCode(username: email);
      return result.codeDeliveryDetails.destination;
    });
  }

  Future<bool> updatePhoneNumber({
    required String phone,
    String countryCode = '+1',
  }) {
    return _handleException(() async {
      final result = await _auth.updateUserAttribute(
        userAttributeKey: CognitoUserAttributeKey.phoneNumber,
        value: '$countryCode$phone',
      );

      return result.isUpdated;
    });
  }

  Future<void> verifyPhoneNumber({required String confirmationCode}) async {
    await _handleException(
      () => _auth.confirmUserAttribute(
        userAttributeKey: CognitoUserAttributeKey.phoneNumber,
        confirmationCode: confirmationCode,
      ),
    );
  }

  Future<String?> resendPhoneNumberConfirmationCode() {
    return _handleException(() async {
      final result = await _auth.sendUserAttributeVerificationCode(
        userAttributeKey: CognitoUserAttributeKey.phoneNumber,
      );

      return result.codeDeliveryDetails.destination;
    });
  }

  Future<bool> verifyUserForPasswordReset({required String associatedEmail}) {
    return _handleException(() async {
      final result = await _auth.resetPassword(username: associatedEmail);
      return result.isPasswordReset;
    });
  }

  Future<void> resetPassword({
    required String email,
    required String password,
    required String confirmationCode,
  }) async {
    await _handleException(
      () => _auth.confirmResetPassword(
        username: email,
        newPassword: password,
        confirmationCode: confirmationCode,
      ),
    );
  }

  Future<void> changePassword({
    required String oldPassword,
    required String newPassword,
  }) async {
    await _handleException(
      () => _auth.updatePassword(
        oldPassword: oldPassword,
        newPassword: newPassword,
      ),
    );
  }

  Future<void> logOut() async {
    _handleException(_auth.signOut);
  }

  Future<AuthSession> getSession() {
    return _handleException(() async {
      final result = await _auth.fetchAuthSession(
        options: const FetchAuthSessionOptions(),
      );
      return AuthSession._fromCognito(result as CognitoAuthSession);
    });
  }

  Future<AuthUserData> getCurrentUser() {
    return _handleException(() async {
      final result = await _auth.getCurrentUser();
      return AuthUserData(userId: result.userId, email: result.username);
    });
  }

  Future<AuthUserData> getCurrentUserData() {
    return _handleException(() async {
      final res = await _auth.fetchUserAttributes();
      var userId = "", email = "", givenName = "";
      for (var attr in res) {
        if (attr.userAttributeKey == CognitoUserAttributeKey.email) {
          email = attr.value;
        }
        if (attr.userAttributeKey == CognitoUserAttributeKey.givenName) {
          givenName = attr.value;
        }
        if (attr.userAttributeKey == CognitoUserAttributeKey.sub) {
          userId = attr.value;
        }
      }
      return AuthUserData(
        email: email,
        userFullName: givenName,
        userId: userId,
      );
    });
  }

  Future<T> _handleException<T extends Object?>(Future<T> Function() fn) async {
    try {
      return await fn();
    } on AuthNotAuthorizedException catch (e, s) {
      throw InvalidCredentialAuthServiceException(e.message, s);
    } on SignedOutException catch (e, s) {
      throw AuthServiceException._fromAmplify(e, s);
    } on UsernameExistsException catch (e, s) {
      throw UsernameExistsAuthServiceException(e.message, s);
    } on UserNotConfirmedException catch (e, s) {
      throw EmailVerificationRequiredAuthServiceException(e.message, s);
    } on AuthException catch (e, s) {
      throw AuthServiceException._fromAmplify(e, s);
    } on AmplifyException catch (e, s) {
      throw AuthServiceException._fromAmplify(e, s);
    } on MFARequiredAuthServiceException {
      rethrow;
    } catch (e, s) {
      throw AuthServiceException(message: e.toString(), stackTrace: s);
    }
  }

  bool _isPhoneVerified(AuthUserAttribute attribute) {
    const phoneVerifiedKey = CognitoUserAttributeKey.phoneNumberVerified;
    final isPhoneVerifiedKey = attribute.userAttributeKey == phoneVerifiedKey;

    return isPhoneVerifiedKey && attribute.value.toLowerCase() == 'true';
  }

  Future<List<AuthDevice>> fetchDevices() async {
    return _handleException(() async {
      final authDevices = <AuthDevice>[];
      final devices = await _auth.fetchDevices();
      for (final device in devices) {
        authDevices.add(device);
      }
      return authDevices;
    });
  }

  Future<void> forgotDevice(String deviceId) async {
    await _handleException(() async {
      final device = CognitoDevice(id: deviceId);

      await _auth.forgetDevice(device);
    });
  }

  Future<void> rememberDevice() async {
    await _handleException(_auth.rememberDevice);
  }
}

class MFARequiredAuthServiceException implements Exception {
  MFARequiredAuthServiceException({
    required this.deliveryMethod,
    required this.destination,
  });

  final String deliveryMethod;
  final String destination;
}

class InvalidCredentialAuthServiceException implements Exception {
  InvalidCredentialAuthServiceException(this.message, this.stackTrace);

  final String message;
  final StackTrace stackTrace;
}

class EmailVerificationRequiredAuthServiceException implements Exception {
  EmailVerificationRequiredAuthServiceException(this.message, this.stackTrace);

  final String message;
  final StackTrace stackTrace;
}

class UsernameExistsAuthServiceException implements Exception {
  UsernameExistsAuthServiceException(this.message, this.stackTrace);

  final String message;
  final StackTrace stackTrace;
}
