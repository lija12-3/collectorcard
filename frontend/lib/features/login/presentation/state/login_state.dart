import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../../core/common/enums/contact_type.dart';

part 'login_state.freezed.dart';

enum LoginStatus {
  idle,
  loading,
  error,
  otpSent,
  otpVerifyInProgress,
  otpVerified,
  otpError,
}

@freezed
class LoginState with _$LoginState {
  const factory LoginState({
    @Default("") final String lastName,
    @Default("") final String contact,
    @Default("") final String pspId,
    @Default(ContactType.phone) final ContactType contactType,
    @Default("") final String errorMessage,
    @Default(LoginStatus.idle) final LoginStatus loginStatus,
    @Default(AsyncData(false)) final AsyncValue<bool> isLoginComplete,
    @Default(AsyncLoading()) final AsyncValue<bool> isSessionValid,
    @Default("") final String otpCode,
    @Default(60) final int resendTimer,
    @Default(false) final bool canResendOtp,
  }) = _LoginState;
}
