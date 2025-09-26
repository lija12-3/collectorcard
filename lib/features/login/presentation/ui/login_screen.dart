import 'package:collectors_card/core/base/base_consumer_state.dart';
import 'package:collectors_card/core/common/widgets/loading_widget.dart';
import 'package:collectors_card/core/common/widgets/responsive_login_button.dart';
import 'package:collectors_card/features/login/presentation/state/login_state.dart';
import 'package:collectors_card/features/login/presentation/view_model/login_view_model.dart';
import 'package:collectors_card/core/common/extension/validator_extension.dart';
import 'package:collectors_card/core/common/enums/contact_type.dart';
import 'package:collectors_card/core/theme/app_colors.dart';
import 'package:collectors_card/core/theme/app_text_styles.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';

import 'login_form.dart';
import 'verify_otp_form.dart';

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
    final isSessionCheckInProgress = ref.watch(
      loginViewModelProvider.select(
        (state) => state.isSessionValid is AsyncLoading,
      ),
    );

    if (kIsWeb && isSessionCheckInProgress) {
      return const WebLoginLoadingScreen();
    }

    ref.listen<LoginStatus>(
      loginViewModelProvider.select((state) => state.loginStatus),
      (previous, next) {
        if (next == LoginStatus.otpVerified) {
          context.go('/home');
        }
      },
    );

    ref.listen<String>(
      loginViewModelProvider.select((state) => state.errorMessage),
      (previous, next) {
        if (next.isNotEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(next), backgroundColor: AppColors.error),
          );
        }
      },
    );
    listenUserStateChange();

    return _buildUnifiedLayout(context, ref);
  }

  Widget _buildUnifiedLayout(BuildContext context, WidgetRef ref) {
    final loginState = ref.watch(loginViewModelProvider);
    final loginNotifier = ref.read(loginViewModelProvider.notifier);

    final isMobileScreen = isMobile(context);
    final isTabletScreen = isTablet(context);
    final isDesktopScreen = isDesktop(context);

    return Scaffold(
      backgroundColor: isDesktopScreen ? AppColors.background : Colors.white,
      body: SafeArea(
        child: isDesktopScreen
            ? _buildDesktopRow(context, ref, loginState, loginNotifier)
            : _buildMobileColumn(
                context,
                ref,
                loginState,
                loginNotifier,
                isMobileScreen,
                isTabletScreen,
              ),
      ),
      bottomNavigationBar: isDesktopScreen ? _buildDesktopFooter() : null,
    );
  }

  Widget _buildDesktopRow(
    BuildContext context,
    WidgetRef ref,
    loginState,
    loginNotifier,
  ) {
    return Row(
      children: [
        Expanded(
          flex: 5,
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 64, vertical: 64),
              child: SizedBox(
                width: 456,
                child: _buildFormContent(
                  context,
                  loginState,
                  loginNotifier,
                  isDesktop: true,
                ),
              ),
            ),
          ),
        ),

        Expanded(
          flex: 4,
          child: Container(
            height: double.infinity,
            margin: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.backgroundGray,
              borderRadius: BorderRadius.circular(12),
              image: const DecorationImage(
                image: AssetImage('assets/images/login_welcome_image.png'),
                fit: BoxFit.cover,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildMobileColumn(
    BuildContext context,
    WidgetRef ref,
    loginState,
    loginNotifier,
    bool isMobileScreen,
    bool isTabletScreen,
  ) {
    return Column(
      children: [
        _buildMobileAppBar(loginState, loginNotifier),
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 16),
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(
                  maxWidth: 500, // Max width for tablet-friendly design
                ),
                child: _buildFormContent(
                  context,
                  loginState,
                  loginNotifier,
                  isDesktop: false,
                ),
              ),
            ),
          ),
        ),

        _buildMobileCTA(context, loginState, loginNotifier),
      ],
    );
  }

  Widget _buildFormContent(
    BuildContext context,
    loginState,
    loginNotifier, {
    required bool isDesktop,
  }) {
    if (loginState.loginStatus == LoginStatus.otpSent ||
        loginState.loginStatus == LoginStatus.otpVerifyInProgress ||
        loginState.loginStatus == LoginStatus.otpError) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (isDesktop) ...[
            SizedBox(
              width: 168,
              height: 49,
              child: SvgPicture.asset(
                'assets/images/specialty_rx_logo.svg',
                fit: BoxFit.contain,
              ),
            ),
            const SizedBox(height: 32),
          ],
          const VerifyOtpForm(),
          if (isDesktop) ...[
            const SizedBox(height: 48),
            ResponsiveLoginButton(
              text: "Verify Code",
              isEnabled: loginState.otpCode.length == 6,
              isLoading: loginState.loginStatus == LoginStatus.loading,
              onPressed: () => loginNotifier.verifyAuthenticationCode(),
            ),
          ],
        ],
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (isDesktop) ...[
          SizedBox(
            width: 168,
            height: 49,
            child: SvgPicture.asset(
              'assets/images/specialty_rx_logo.svg',
              fit: BoxFit.contain,
            ),
          ),
          const SizedBox(height: 32),
        ],
        Text(
          "Welcome to App",
          style: isDesktop
              ? AppTextStyles.mainHeading
              : AppTextStyles.mobileMainHeading,
        ),
        SizedBox(height: isDesktop ? 48 : 16),
        const LoginForm(),
        if (isDesktop) ...[
          const SizedBox(height: 48),
          ResponsiveLoginButton(
            text: "Login",
            isEnabled: _isFormValid(loginState),
            isLoading: loginState.loginStatus == LoginStatus.loading,
            onPressed: () => loginNotifier.login(),
          ),
        ],
      ],
    );
  }

  Widget _buildDesktopFooter() {
    return Container(
      height: 104,
      color: AppColors.background,
      child: Column(
        children: [
          Container(
            height: 1,
            color: AppColors.textSecondary.withValues(alpha: 0.16),
          ),
          const SizedBox(height: 32),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 156),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "© 2025 Card Collector All rights reserved.",
                  style: AppTextStyles.footerText,
                ),
                Row(
                  children: [
                    TextButton(
                      onPressed: () {},
                      child: Text(
                        "Privacy Policy",
                        style: AppTextStyles.footerLinkText,
                      ),
                    ),
                    const SizedBox(width: 32),
                    TextButton(
                      onPressed: () {},
                      child: Text(
                        "Term & Conditions",
                        style: AppTextStyles.footerLinkText,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 35),
        ],
      ),
    );
  }

  Widget _buildMobileAppBar(LoginState loginState, loginNotifier) {
    final bool isOtpMode =
        loginState.loginStatus == LoginStatus.otpSent ||
        loginState.loginStatus == LoginStatus.otpError;

    if (isOtpMode) {
      return _buildOtpMobileAppBar(loginNotifier);
    } else {
      return _buildLoginMobileAppBar();
    }
  }

  Widget _buildLoginMobileAppBar() {
    return SizedBox(
      height: 90, // 44 for status bar + 46 for app bar
      child: Column(
        children: [
          Container(height: 44, color: Colors.white),
          // Container(
          //   height: 46,
          //   color: Colors.white,
          //   child: Center(
          //     child: SvgPicture.asset(
          //       'assets/images/specialty_rx_logo.svg',
          //       width: 115,
          //       height: 46,
          //       fit: BoxFit.contain,
          //     ),
          //   ),
          // ),
        ],
      ),
    );
  }

  Widget _buildOtpMobileAppBar(LoginViewModel loginNotifier) {
    return SizedBox(
      height: 102,
      child: Column(
        children: [
          Container(
            height: 44,
            color: AppColors.primary, // Blue background
          ),

          Container(
            height: 46,
            color: AppColors.primary, // Blue background
            child: Row(
              children: [
                // Back button
                GestureDetector(
                  onTap: () => loginNotifier.goBackToLogin(),
                  child: Container(
                    width: 48, // 16px margin + 32px button
                    height: 46,
                    alignment: Alignment.centerLeft,
                    padding: const EdgeInsets.only(left: 16),
                    child: Container(
                      width: 32,
                      height: 32,
                      alignment: Alignment.center,
                      child: Icon(
                        Icons.chevron_left,
                        color: Colors.white,
                        size: 24,
                      ),
                    ),
                  ),
                ),
                // Spacer
                const Expanded(child: SizedBox()),
              ],
            ),
          ),

          Container(
            height: 12,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMobileCTA(BuildContext context, loginState, loginNotifier) {
    final bool isOtpMode =
        loginState.loginStatus == LoginStatus.otpSent ||
        loginState.loginStatus == LoginStatus.otpError;

    return SizedBox(
      height: 124,
      child: Column(
        children: [
          Container(
            height: 20,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                stops: [0.375, 1.0],
                colors: [
                  Colors.white.withAlpha(255),
                  Colors.white.withAlpha(0),
                ],
              ),
            ),
          ),
          Container(
            height: 70,
            padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 10),
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(
                  maxWidth: 500, // Same max width as form for consistency
                ),
                child: Column(
                  children: [
                    ResponsiveLoginButton(
                      text: isOtpMode ? "Verify Code" : "Login",
                      isEnabled: _isFormValid(loginState),
                      isLoading:
                          loginState.loginStatus == LoginStatus.loading ||
                          loginState.loginStatus ==
                              LoginStatus.otpVerifyInProgress,
                      onPressed: isOtpMode
                          ? () => loginNotifier.verifyAuthenticationCode()
                          : () => loginNotifier.login(),
                    ),
                  ],
                ),
              ),
            ),
          ),

          SizedBox(
            height: 34,
            child: Column(
              children: [
                const Spacer(),
                Container(
                  width: 134,
                  height: 5,
                  decoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.circular(100),
                  ),
                ),
                const SizedBox(height: 20),
              ],
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

    final contact = (loginState.contact).trim();
    final isValidEmailOrPhone = loginState.contactType == ContactType.email
        ? contact.isValidEmail()
        : contact.isValidPhone();

    return loginState.lastName.trim().isNotEmpty &&
        contact.isNotEmpty &&
        loginState.pspId.trim().isNotEmpty &&
        isValidEmailOrPhone;
  }

  void listenUserStateChange() {
    ref.listen<AsyncValue<bool>>(
      loginViewModelProvider.select((value) => value.isSessionValid),
      (previous, next) {
        if (next is AsyncData<bool> && next.value == true) {
          debugPrint("redirecting via listenUserStateChange");
          GoRouter.of(context).go('/home');
        }
      },
    );
  }
}
