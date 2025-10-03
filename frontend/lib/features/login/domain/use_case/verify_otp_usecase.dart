import 'package:collectors_card/core/local/db/hive_box_key.dart';
import 'package:collectors_card/features/login/data/repository/login_repository.dart';
import 'package:collectors_card/features/login/data/repository/login_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:multiple_result/multiple_result.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'package:collectors_card/core/exception/failure.dart';
import 'package:collectors_card/core/dependencies/authentication/auth_provider.dart';

part 'verify_otp_usecase.g.dart';

@Riverpod(keepAlive: true)
VerifyOtpUseCase verifyOtpUseCase(Ref ref) {
  final loginRepository = ref.watch(loginRepositoryImplProvider);
  return VerifyOtpUseCase(loginRepository: loginRepository);
}

class VerifyOtpUseCase {
  final LoginRepository _loginRepository;

  VerifyOtpUseCase({required LoginRepository loginRepository})
    : _loginRepository = loginRepository;

  Future<Result<bool, Failure>> call(String contact, String otp) async {
    try {
      final loginResult = await _loginRepository.verifyAuthenticationCode(
        contact,
        otp,
      );

      if (loginResult.accessToken.isNotEmpty) {
        await _loginRepository.addToBox(
          accessTokenKey,
          loginResult.accessToken,
        );
        await _loginRepository.addToBox(
          refreshTokenKey,
          loginResult.refreshToken,
        );

        updateAuthToken(loginResult.accessToken);

        return const Success(true);
      } else {
        return const Success(false);
      }
    } on Failure catch (e) {
      return Error(Failure(message: e.toString(), stackTrace: e.stackTrace));
    }
  }
}
