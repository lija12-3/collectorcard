import 'dart:async';

import 'package:collectors_card/core/common/enums/contact_type.dart';
import 'package:collectors_card/core/common/extension/validator_extension.dart';
import 'package:collectors_card/core/dependencies/authentication/models/auth_steps.dart';
import 'package:collectors_card/features/login/domain/use_case/check_session_use_case.dart';
import 'package:collectors_card/features/login/domain/use_case/login_usecase.dart';
import 'package:collectors_card/features/login/domain/use_case/verify_otp_usecase.dart';
import 'package:collectors_card/features/login/presentation/state/login_state.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'login_view_model.g.dart';

@riverpod
class LoginViewModel extends _$LoginViewModel {
  Timer? _resendTimer;

  @override
  LoginState build() {
    return const LoginState();
  }

  LoginState _resetProgress(LoginState newState) {
    return newState.copyWith(
      isLoginComplete: const AsyncValue.data(false),
      errorMessage: "",
    );
  }

  void updateLastName({required String lastName}) {
    state = _resetProgress(state.copyWith(lastName: lastName));
  }

  void updateContact({required String contact}) {
    state = state.copyWith(
      contact: contact,
      isLoginComplete: const AsyncValue.data(false),
      errorMessage: "",
    );
  }

  void updatePspId({required String pspId}) {
    state = state.copyWith(
      pspId: pspId,
      isLoginComplete: const AsyncValue.data(false),
      errorMessage: "",
    );
  }

  void updateContactType({required String contactType}) {
    state = state.copyWith(
      contactType: ContactType.fromString(contactType),
      isLoginComplete: const AsyncValue.data(false),
      errorMessage: "",
    );
  }

  void updateOtpCode({required String otpCode}) {
    state = state.copyWith(otpCode: otpCode, errorMessage: "");

    if (otpCode.length == 6) {
      verifyOtp();
    }
  }

  void goBackToLogin() {
    state = state.copyWith(
      loginStatus: LoginStatus.idle,
      otpCode: "",
      errorMessage: "",
      resendTimer: 60,
      canResendOtp: false,
    );
    _resendTimer?.cancel();
  }

  void login() async {
    if (!_validateForm()) {
      return;
    }

    state = state.copyWith(
      loginStatus: LoginStatus.loading,
      isLoginComplete: const AsyncLoading(),
      errorMessage: "",
    );

    final loginResult = await ref
        .read(loginUseCaseProvider)
        .call(
          state.lastName,
          state.contact,
          state.pspId,
          state.contactType.value,
        );

    loginResult.when(
      (authStep) {
        if (authStep == AuthStep.confirmSignInWithCustomChallenge) {
          state = state.copyWith(
            loginStatus: LoginStatus.otpSent,
            isLoginComplete: const AsyncValue.data(false),
          );
          _startResendTimer();
        } else {
          state = state.copyWith(
            loginStatus: LoginStatus.error,
            isLoginComplete: const AsyncValue.data(false),
            errorMessage: "Login failed. Please check your credentials.",
          );
        }
      },
      (error) {
        state = state.copyWith(
          loginStatus: LoginStatus.error,
          isLoginComplete: AsyncError(error, StackTrace.current),
          errorMessage: error.toString(),
        );
      },
    );
  }

  void verifyOtp() async {
    if (state.otpCode.length != 6) {
      state = state.copyWith(
        errorMessage: "Please enter the complete 6-digit code",
      );
      return;
    }
    state = state.copyWith(
      loginStatus: LoginStatus.otpVerifyInProgress,
      isLoginComplete: const AsyncLoading(),
      errorMessage: "",
    );

    try {
      final loginResult = await ref
          .read(verifyOtpUseCaseProvider)
          .call(state.contact, state.otpCode);

      loginResult.when(
        (success) {
          if (success) {
            state = state.copyWith(
              loginStatus: LoginStatus.otpVerified,
              isLoginComplete: const AsyncValue.data(true),
              errorMessage: "",
            );
          } else {
            state = state.copyWith(
              loginStatus: LoginStatus.otpError,
              isLoginComplete: const AsyncValue.data(false),
              errorMessage: "Invalid verification code. Please try again.",
            );
          }
        },
        (failure) {
          state = state.copyWith(
            loginStatus: LoginStatus.otpError,
            isLoginComplete: AsyncError(failure, StackTrace.current),
            errorMessage: "Verification failed. Please try again.",
          );
        },
      );
    } catch (error) {
      state = state.copyWith(
        loginStatus: LoginStatus.otpError,
        isLoginComplete: AsyncError(error, StackTrace.current),
        errorMessage: "Verification failed. Please try again.",
      );
    }
  }

  void resendOtpCode() async {
    if (!state.canResendOtp) return;

    try {
      await Future.delayed(const Duration(seconds: 1));

      state = state.copyWith(
        errorMessage: "",
        resendTimer: 60,
        canResendOtp: false,
      );

      _startResendTimer();
    } catch (error) {
      state = state.copyWith(
        errorMessage: "Failed to resend code. Please try again.",
      );
    }
  }

  void _startResendTimer() {
    _resendTimer?.cancel();
    _resendTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (state.resendTimer <= 1) {
        timer.cancel();
        state = state.copyWith(resendTimer: 0, canResendOtp: true);
      } else {
        state = state.copyWith(resendTimer: state.resendTimer - 1);
      }
    });
  }

  bool _validateForm() {
    if (state.lastName.trim().isEmpty) {
      state = state.copyWith(errorMessage: "Last name is required");
      return false;
    }

    if (state.contact.trim().isEmpty) {
      state = state.copyWith(errorMessage: "Contact is required");
      return false;
    }

    if (state.pspId.trim().isEmpty) {
      state = state.copyWith(errorMessage: "PSP ID is required");
      return false;
    }

    if (state.contactType == ContactType.email) {
      if (!state.contact.isValidEmail()) {
        state = state.copyWith(
          errorMessage: "Please enter a valid email address",
        );
        return false;
      }
    }

    if (state.contactType == ContactType.phone) {
      if (!state.contact.isValidPhone()) {
        state = state.copyWith(
          errorMessage:
              "Please enter a valid phone number with minimum 9 digits",
        );
        return false;
      }
    }
    return true;
  }

  void checkUserSession() async {
    state = state.copyWith(isSessionValid: AsyncLoading());

    try {
      final checkUserSessionResult = await ref
          .read(checkSessionUseCaseProvider)
          .call();

      checkUserSessionResult.when(
        (sessionCheckResult) {
          state = state.copyWith(
            isSessionValid: AsyncValue.data(sessionCheckResult),
          );
        },
        (failure) {
          state = state.copyWith(isSessionValid: const AsyncValue.data(false));
        },
      );
    } catch (error) {
      state = state.copyWith(isSessionValid: const AsyncValue.data(false));
    }
  }
}
