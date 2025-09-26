import 'package:collectors_card/core/dependencies/authentication/models/auth_steps.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:multiple_result/multiple_result.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../../core/exception/failure.dart';
import '../../data/repository/login_repository.dart';
import '../../data/repository/login_repository_impl.dart';

part 'login_usecase.g.dart';

@Riverpod(keepAlive: true)
LoginUseCase loginUseCase(Ref ref) {
  final loginRepository = ref.watch(loginRepositoryImplProvider);
  return LoginUseCase(loginRepository: loginRepository);
}

class LoginUseCase {
  final LoginRepository _loginRepository;

  LoginUseCase({required LoginRepository loginRepository})
    : _loginRepository = loginRepository;

  Future<Result<AuthStep, Failure>> call(
    String lastName,
    String contact,
    String pspId,
    String contactType,
  ) async {
    try {
      try {
        final checkUserSessionResult = await _loginRepository.isSessionActive();
        if (checkUserSessionResult.isValidSession) {
          await _loginRepository.logout();
        }
      } catch (e) {
        debugPrint(e.toString());
      }

      final loginResult = await _loginRepository.login(contact, lastName);
      return Success(loginResult);
    } on Failure catch (e) {
      return Error(Failure(message: e.toString(), stackTrace: e.stackTrace));
    }
  }
}
