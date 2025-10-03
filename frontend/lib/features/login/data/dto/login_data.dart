import 'package:freezed_annotation/freezed_annotation.dart';
import 'user_data.dart';

part 'login_data.freezed.dart';
part 'login_data.g.dart';

@freezed
class LoginData with _$LoginData {
  const factory LoginData({
    required String accessToken,
    required String refreshToken,
    UserData? user,
  }) = _LoginData;

  factory LoginData.fromJson(Map<String, dynamic> json) =>
      _$LoginDataFromJson(json);
}
