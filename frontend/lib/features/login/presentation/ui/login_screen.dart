import 'package:collectors_card/core/base/base_consumer_state.dart';
import 'package:collectors_card/core/common/widgets/responsive_login_button.dart';
import 'package:collectors_card/features/login/presentation/state/login_state.dart';
import 'package:collectors_card/features/login/presentation/view_model/login_view_model.dart';
import 'package:collectors_card/core/common/extension/validator_extension.dart';
import 'package:collectors_card/core/common/enums/contact_type.dart';
import 'package:collectors_card/core/theme/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'login_form.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends BaseConsumerState<LoginScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      ref.read(loginViewModelProvider.notifier).checkUserSession();
    });
  }

  @override
  Widget build(BuildContext context) {
    // Listen for login success
    ref.listen<LoginStatus>(
      loginViewModelProvider.select((state) => state.loginStatus),
      (previous, next) {
        if (next == LoginStatus.otpVerified) {
          context.go('/home');
        }
      },
    );

    // Listen for errors
    ref.listen<String>(
      loginViewModelProvider.select((state) => state.errorMessage),
      (previous, next) {
        if (next.isNotEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(next),
              backgroundColor: AppColors.primarySemanticErrorBackground,
            ),
          );
        }
      },
    );

    listenUserStateChange();

    return Scaffold(
      backgroundColor: AppColors.rocket, // instead of white
      body: Column(
        children: [
          const LoginMobileAppBar(),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 16),
              child: const LoginForm(),
            ),
          ),
          const LoginMobileCTA(),
        ],
      ),
    );
  }

  void listenUserStateChange() {
    ref.listen<AsyncValue<bool>>(
      loginViewModelProvider.select((value) => value.isSessionValid),
      (previous, next) {
        if (next is AsyncData<bool> && next.value == true) {
          GoRouter.of(context).go('/home');
        }
      },
    );
  }
}

class LoginMobileAppBar extends StatelessWidget {
  const LoginMobileAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 90,
      child: Column(children: [Container(height: 44, color: Colors.white)]),
    );
  }
}

class LoginMobileCTA extends ConsumerWidget {
  const LoginMobileCTA({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final loginState = ref.watch(loginViewModelProvider);
    final loginNotifier = ref.read(loginViewModelProvider.notifier);

    final bool isOtpMode =
        loginState.loginStatus == LoginStatus.otpSent ||
        loginState.loginStatus == LoginStatus.otpError;

    return SizedBox(
      height: 124,
      child: Column(
        children: [
          Container(
            height: 70,
            padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 10),
            child: ResponsiveLoginButton(
              text: isOtpMode ? "Verify Code" : "Login",
              isEnabled: _isFormValid(loginState),
              isLoading:
                  loginState.loginStatus == LoginStatus.loading ||
                  loginState.loginStatus == LoginStatus.otpVerifyInProgress,
              onPressed: isOtpMode
                  ? () => loginNotifier.verifyOtp()
                  : () => loginNotifier.login(),
            ),
          ),
        ],
      ),
    );
  }

  bool _isFormValid(LoginState loginState) {
    if (loginState.loginStatus == LoginStatus.otpSent ||
        loginState.loginStatus == LoginStatus.otpError) {
      return loginState.otpCode.length == 6;
    }

    final contact = loginState.contact.trim();
    final isValidEmailOrPhone = loginState.contactType == ContactType.email
        ? contact.isValidEmail()
        : contact.isValidPhone();

    return loginState.lastName.trim().isNotEmpty &&
        contact.isNotEmpty &&
        loginState.pspId.trim().isNotEmpty &&
        isValidEmailOrPhone;
  }
}
