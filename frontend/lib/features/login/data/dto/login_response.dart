import 'package:freezed_annotation/freezed_annotation.dart';
import 'login_data.dart';

part 'login_response.freezed.dart';
part 'login_response.g.dart';

// Needed for Retrofit + compute()
LoginResponse deserializeLoginResponse(Map<String, dynamic> json) =>
    LoginResponse.fromJson(json);

Map<String, dynamic> serializeLoginResponse(LoginResponse object) =>
    object.toJson();

@freezed
class LoginResponse with _$LoginResponse {
  const factory LoginResponse({
    required String status,
    required LoginData data,
    String? message,
  }) = _LoginResponse;

  factory LoginResponse.fromJson(Map<String, dynamic> json) =>
      _$LoginResponseFromJson(json);
}
