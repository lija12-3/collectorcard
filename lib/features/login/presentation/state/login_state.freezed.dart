// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'login_state.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

/// @nodoc
mixin _$LoginState {
  String get lastName => throw _privateConstructorUsedError;
  String get contact => throw _privateConstructorUsedError;
  String get pspId => throw _privateConstructorUsedError;
  ContactType get contactType => throw _privateConstructorUsedError;
  String get errorMessage => throw _privateConstructorUsedError;
  LoginStatus get loginStatus => throw _privateConstructorUsedError;
  AsyncValue<bool> get isLoginComplete => throw _privateConstructorUsedError;
  AsyncValue<bool> get isSessionValid => throw _privateConstructorUsedError;
  String get otpCode => throw _privateConstructorUsedError;
  int get resendTimer => throw _privateConstructorUsedError;
  bool get canResendOtp => throw _privateConstructorUsedError;

  /// Create a copy of LoginState
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $LoginStateCopyWith<LoginState> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $LoginStateCopyWith<$Res> {
  factory $LoginStateCopyWith(
    LoginState value,
    $Res Function(LoginState) then,
  ) = _$LoginStateCopyWithImpl<$Res, LoginState>;
  @useResult
  $Res call({
    String lastName,
    String contact,
    String pspId,
    ContactType contactType,
    String errorMessage,
    LoginStatus loginStatus,
    AsyncValue<bool> isLoginComplete,
    AsyncValue<bool> isSessionValid,
    String otpCode,
    int resendTimer,
    bool canResendOtp,
  });
}

/// @nodoc
class _$LoginStateCopyWithImpl<$Res, $Val extends LoginState>
    implements $LoginStateCopyWith<$Res> {
  _$LoginStateCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of LoginState
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? lastName = null,
    Object? contact = null,
    Object? pspId = null,
    Object? contactType = null,
    Object? errorMessage = null,
    Object? loginStatus = null,
    Object? isLoginComplete = null,
    Object? isSessionValid = null,
    Object? otpCode = null,
    Object? resendTimer = null,
    Object? canResendOtp = null,
  }) {
    return _then(
      _value.copyWith(
            lastName: null == lastName
                ? _value.lastName
                : lastName // ignore: cast_nullable_to_non_nullable
                      as String,
            contact: null == contact
                ? _value.contact
                : contact // ignore: cast_nullable_to_non_nullable
                      as String,
            pspId: null == pspId
                ? _value.pspId
                : pspId // ignore: cast_nullable_to_non_nullable
                      as String,
            contactType: null == contactType
                ? _value.contactType
                : contactType // ignore: cast_nullable_to_non_nullable
                      as ContactType,
            errorMessage: null == errorMessage
                ? _value.errorMessage
                : errorMessage // ignore: cast_nullable_to_non_nullable
                      as String,
            loginStatus: null == loginStatus
                ? _value.loginStatus
                : loginStatus // ignore: cast_nullable_to_non_nullable
                      as LoginStatus,
            isLoginComplete: null == isLoginComplete
                ? _value.isLoginComplete
                : isLoginComplete // ignore: cast_nullable_to_non_nullable
                      as AsyncValue<bool>,
            isSessionValid: null == isSessionValid
                ? _value.isSessionValid
                : isSessionValid // ignore: cast_nullable_to_non_nullable
                      as AsyncValue<bool>,
            otpCode: null == otpCode
                ? _value.otpCode
                : otpCode // ignore: cast_nullable_to_non_nullable
                      as String,
            resendTimer: null == resendTimer
                ? _value.resendTimer
                : resendTimer // ignore: cast_nullable_to_non_nullable
                      as int,
            canResendOtp: null == canResendOtp
                ? _value.canResendOtp
                : canResendOtp // ignore: cast_nullable_to_non_nullable
                      as bool,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$LoginStateImplCopyWith<$Res>
    implements $LoginStateCopyWith<$Res> {
  factory _$$LoginStateImplCopyWith(
    _$LoginStateImpl value,
    $Res Function(_$LoginStateImpl) then,
  ) = __$$LoginStateImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String lastName,
    String contact,
    String pspId,
    ContactType contactType,
    String errorMessage,
    LoginStatus loginStatus,
    AsyncValue<bool> isLoginComplete,
    AsyncValue<bool> isSessionValid,
    String otpCode,
    int resendTimer,
    bool canResendOtp,
  });
}

/// @nodoc
class __$$LoginStateImplCopyWithImpl<$Res>
    extends _$LoginStateCopyWithImpl<$Res, _$LoginStateImpl>
    implements _$$LoginStateImplCopyWith<$Res> {
  __$$LoginStateImplCopyWithImpl(
    _$LoginStateImpl _value,
    $Res Function(_$LoginStateImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of LoginState
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? lastName = null,
    Object? contact = null,
    Object? pspId = null,
    Object? contactType = null,
    Object? errorMessage = null,
    Object? loginStatus = null,
    Object? isLoginComplete = null,
    Object? isSessionValid = null,
    Object? otpCode = null,
    Object? resendTimer = null,
    Object? canResendOtp = null,
  }) {
    return _then(
      _$LoginStateImpl(
        lastName: null == lastName
            ? _value.lastName
            : lastName // ignore: cast_nullable_to_non_nullable
                  as String,
        contact: null == contact
            ? _value.contact
            : contact // ignore: cast_nullable_to_non_nullable
                  as String,
        pspId: null == pspId
            ? _value.pspId
            : pspId // ignore: cast_nullable_to_non_nullable
                  as String,
        contactType: null == contactType
            ? _value.contactType
            : contactType // ignore: cast_nullable_to_non_nullable
                  as ContactType,
        errorMessage: null == errorMessage
            ? _value.errorMessage
            : errorMessage // ignore: cast_nullable_to_non_nullable
                  as String,
        loginStatus: null == loginStatus
            ? _value.loginStatus
            : loginStatus // ignore: cast_nullable_to_non_nullable
                  as LoginStatus,
        isLoginComplete: null == isLoginComplete
            ? _value.isLoginComplete
            : isLoginComplete // ignore: cast_nullable_to_non_nullable
                  as AsyncValue<bool>,
        isSessionValid: null == isSessionValid
            ? _value.isSessionValid
            : isSessionValid // ignore: cast_nullable_to_non_nullable
                  as AsyncValue<bool>,
        otpCode: null == otpCode
            ? _value.otpCode
            : otpCode // ignore: cast_nullable_to_non_nullable
                  as String,
        resendTimer: null == resendTimer
            ? _value.resendTimer
            : resendTimer // ignore: cast_nullable_to_non_nullable
                  as int,
        canResendOtp: null == canResendOtp
            ? _value.canResendOtp
            : canResendOtp // ignore: cast_nullable_to_non_nullable
                  as bool,
      ),
    );
  }
}

/// @nodoc

class _$LoginStateImpl implements _LoginState {
  const _$LoginStateImpl({
    this.lastName = "",
    this.contact = "",
    this.pspId = "",
    this.contactType = ContactType.phone,
    this.errorMessage = "",
    this.loginStatus = LoginStatus.idle,
    this.isLoginComplete = const AsyncData(false),
    this.isSessionValid = const AsyncLoading(),
    this.otpCode = "",
    this.resendTimer = 60,
    this.canResendOtp = false,
  });

  @override
  @JsonKey()
  final String lastName;
  @override
  @JsonKey()
  final String contact;
  @override
  @JsonKey()
  final String pspId;
  @override
  @JsonKey()
  final ContactType contactType;
  @override
  @JsonKey()
  final String errorMessage;
  @override
  @JsonKey()
  final LoginStatus loginStatus;
  @override
  @JsonKey()
  final AsyncValue<bool> isLoginComplete;
  @override
  @JsonKey()
  final AsyncValue<bool> isSessionValid;
  @override
  @JsonKey()
  final String otpCode;
  @override
  @JsonKey()
  final int resendTimer;
  @override
  @JsonKey()
  final bool canResendOtp;

  @override
  String toString() {
    return 'LoginState(lastName: $lastName, contact: $contact, pspId: $pspId, contactType: $contactType, errorMessage: $errorMessage, loginStatus: $loginStatus, isLoginComplete: $isLoginComplete, isSessionValid: $isSessionValid, otpCode: $otpCode, resendTimer: $resendTimer, canResendOtp: $canResendOtp)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$LoginStateImpl &&
            (identical(other.lastName, lastName) ||
                other.lastName == lastName) &&
            (identical(other.contact, contact) || other.contact == contact) &&
            (identical(other.pspId, pspId) || other.pspId == pspId) &&
            (identical(other.contactType, contactType) ||
                other.contactType == contactType) &&
            (identical(other.errorMessage, errorMessage) ||
                other.errorMessage == errorMessage) &&
            (identical(other.loginStatus, loginStatus) ||
                other.loginStatus == loginStatus) &&
            (identical(other.isLoginComplete, isLoginComplete) ||
                other.isLoginComplete == isLoginComplete) &&
            (identical(other.isSessionValid, isSessionValid) ||
                other.isSessionValid == isSessionValid) &&
            (identical(other.otpCode, otpCode) || other.otpCode == otpCode) &&
            (identical(other.resendTimer, resendTimer) ||
                other.resendTimer == resendTimer) &&
            (identical(other.canResendOtp, canResendOtp) ||
                other.canResendOtp == canResendOtp));
  }

  @override
  int get hashCode => Object.hash(
    runtimeType,
    lastName,
    contact,
    pspId,
    contactType,
    errorMessage,
    loginStatus,
    isLoginComplete,
    isSessionValid,
    otpCode,
    resendTimer,
    canResendOtp,
  );

  /// Create a copy of LoginState
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$LoginStateImplCopyWith<_$LoginStateImpl> get copyWith =>
      __$$LoginStateImplCopyWithImpl<_$LoginStateImpl>(this, _$identity);
}

abstract class _LoginState implements LoginState {
  const factory _LoginState({
    final String lastName,
    final String contact,
    final String pspId,
    final ContactType contactType,
    final String errorMessage,
    final LoginStatus loginStatus,
    final AsyncValue<bool> isLoginComplete,
    final AsyncValue<bool> isSessionValid,
    final String otpCode,
    final int resendTimer,
    final bool canResendOtp,
  }) = _$LoginStateImpl;

  @override
  String get lastName;
  @override
  String get contact;
  @override
  String get pspId;
  @override
  ContactType get contactType;
  @override
  String get errorMessage;
  @override
  LoginStatus get loginStatus;
  @override
  AsyncValue<bool> get isLoginComplete;
  @override
  AsyncValue<bool> get isSessionValid;
  @override
  String get otpCode;
  @override
  int get resendTimer;
  @override
  bool get canResendOtp;

  /// Create a copy of LoginState
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$LoginStateImplCopyWith<_$LoginStateImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
