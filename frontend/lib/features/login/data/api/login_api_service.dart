import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:retrofit/retrofit.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter/foundation.dart';

import '../../../../core/remote/network_service_provider.dart';
import '../dto/login_response.dart';

part 'login_api_service.g.dart';

@Riverpod(keepAlive: true)
LoginApiService loginApiService(Ref ref) {
  final dioService = ref.watch(networkServiceProvider);
  return LoginApiService(dioService);
}

@RestApi(parser: Parser.FlutterCompute)
abstract class LoginApiService {
  factory LoginApiService(Dio dio) => _LoginApiService(dio);

  @POST('auth/login')
  Future<LoginResponse> login(@Body() Map<String, dynamic> request);
}
