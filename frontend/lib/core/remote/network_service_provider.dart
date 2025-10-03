import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../providers/base_url.dart';
import 'network_service_interceptor.dart';

part 'network_service_provider.g.dart';

@Riverpod(keepAlive: true)
Dio networkService(Ref ref) {
  final baseUrl = ref.watch(baseUrlProvider);

  final dioOptions = BaseOptions(
    baseUrl: baseUrl,
    connectTimeout: const Duration(minutes: 1),
    receiveTimeout: const Duration(minutes: 1),
    sendTimeout: const Duration(minutes: 1),
  );

  return Dio(dioOptions)
    ..interceptors.addAll([
      //HttpFormatter(),
      NetworkServiceInterceptor(),
    ]);
}
