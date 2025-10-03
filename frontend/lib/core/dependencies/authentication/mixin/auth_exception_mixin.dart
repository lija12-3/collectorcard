import 'dart:async';
import 'package:collectors_card/core/dependencies/authentication/service/auth_service.dart';
import 'package:collectors_card/core/exception/failure.dart';

mixin AuthExceptionMixin {
  Future<T> callAuthService<T>(FutureOr<T> Function() call) async {
    try {
      return await call();
    } on InvalidCredentialAuthServiceException catch (e) {
      throw Failure(message: e.message, stackTrace: e.stackTrace);
    } on EmailVerificationRequiredAuthServiceException catch (e) {
      throw Failure(message: e.message, stackTrace: e.stackTrace);
    } on AuthServiceException catch (e) {
      throw Failure(message: e.message, stackTrace: e.stackTrace);
    } on UsernameExistsAuthServiceException catch (e) {
      throw Failure(message: e.message, stackTrace: e.stackTrace);
    } on MFARequiredAuthServiceException {
      throw Failure(message: "MFA Required", stackTrace: StackTrace.current);
    }
  }
}
