import 'package:collectors_card/core/dependencies/authentication/external_interface/auth_external_interface.dart';
import 'package:collectors_card/core/dependencies/authentication/models/auth_responses.dart';
import 'package:collectors_card/core/dependencies/authentication/models/auth_steps.dart';
import 'package:collectors_card/core/local/db/provider/session_box_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../../core/exception/dio_exception_mixin.dart';
import '../api/login_api_service.dart';
import 'login_repository.dart';

part 'login_repository_impl.g.dart';

@Riverpod(keepAlive: true)
LoginRepositoryImpl loginRepositoryImpl(Ref ref) {
  final loginApiService = ref.watch(loginApiServiceProvider);
  final authExternalInterface = ref.watch(authExternalInterfaceProvider);

  final sessionBox = ref.watch(sessionBoxProvider);

  return LoginRepositoryImpl(
    loginApiService,
    authExternalInterface,
    sessionBox,
  );
}

class LoginRepositoryImpl with DioExceptionMixin implements LoginRepository {
  final AuthExternalInterface _authExternalInterface;
  final LoginApiService _loginApiService;
  final Box _box;

  LoginRepositoryImpl(
    this._loginApiService,
    this._authExternalInterface,
    this._box,
  );

  @override
  Future<bool> addToBox<T>(String key, T? value) async {
    await _box.put(key, value);
    return true;
  }

  @override
  Future<T?> getFromBox<T>(String key) async {
    return await _box.get(key);
  }

  @override
  Future<AuthStep> login(String identity, String userName) async {
    return _authExternalInterface.unifiedLogin(identity, userName);
  }

  @override
  Future<AuthSuccessResponse> isSessionActive() {
    return _authExternalInterface.isSessionActive();
  }

  @override
  Future<void> logout() async {
    return await _authExternalInterface.logout();
  }

  @override
  Future<AuthSuccessResponse> verifyAuthenticationCode(
    String identity,
    String otp,
  ) {
    return _authExternalInterface.confirmAuthentication(otp);
  }
}
