import 'package:collectors_card/core/dependencies/authentication/auth_provider.dart';
import 'package:collectors_card/core/exception/failure.dart';
import 'package:collectors_card/core/local/db/hive_box_key.dart';
import 'package:collectors_card/features/login/data/repository/login_repository.dart';
import 'package:collectors_card/features/login/data/repository/login_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:multiple_result/multiple_result.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'check_session_use_case.g.dart';

@Riverpod(keepAlive: true)
CheckSessionUseCase checkSessionUseCase(Ref ref) {
  final loginRepository = ref.watch(loginRepositoryImplProvider);
  return CheckSessionUseCase(loginRepository: loginRepository);
}

class CheckSessionUseCase {
  final LoginRepository loginRepository;
  CheckSessionUseCase({required this.loginRepository});

  Future<Result<bool, Failure>> call() async {
    try {
      final accessToken = await loginRepository.getFromBox(accessTokenKey);
      if (accessToken == null || accessToken.isEmpty) {
        return const Success(false);
      } else {
        await updateAuthToken(accessToken);
        final authSessionData = await loginRepository.isSessionActive();
        return Success(authSessionData.isValidSession);

        //(TODO) naseem : Get user data from the profile API
        //
        //final userData = await loginRepository.isSessionActive();
        // Logger.root.info("PRINTING USER DATA");
        // Logger.root.info(userData);
        // if (userData.status != "success" || userData.data.id.isEmpty) {
        //   return const Success(false);
        // }
        // final user = UserData(
        //   email: userData.data.email,
        //   name: userData.data.name,
        //   photo: userData.data.photo,
        //   id: userData.data.id,
        //   role: userData.data.role,
        //   emailVerified: userData.data.emailVerified,
        // );
        // updateUserData(user);
        // return const Success(true);
      }
    } catch (error, stackTrace) {
      return Error(Failure(message: error.toString(), stackTrace: stackTrace));
    }
  }
}
