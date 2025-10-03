import 'package:collectors_card/core/router/app_router_notifier.dart';
import 'package:collectors_card/features/splash/domain/model/user_data.dart';
import 'package:collectors_card/main.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final authTokenProvider = StateProvider<String>((ref) {
  return "";
});

final userDataProvider = StateProvider<UserData>((ref) {
  return const UserData(
    id: '',
    name: '',
    email: '',
    photo: '',
    emailVerified: false,
    role: '',
  );
});

Future<void> updateAuthToken(String token) async {
  providerContainer.read(authTokenProvider.notifier).state = token;
  providerContainer.read(appRouterNotifierProvider).isLoggedIn = true;
}

Future<void> resetToken() async {
  providerContainer.read(authTokenProvider.notifier).state = '';
  providerContainer.read(appRouterNotifierProvider).isLoggedIn = false;
}

Future<void> updateUserData(UserData user) async {
  providerContainer.read(userDataProvider.notifier).state = user;
}

Future<void> resetUserData() async {
  providerContainer.read(userDataProvider.notifier).state = const UserData(
    id: '',
    name: '',
    email: '',
    photo: '',
    emailVerified: false,
    role: '',
  );
}
