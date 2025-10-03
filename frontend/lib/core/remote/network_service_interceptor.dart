import 'dart:developer';
import 'package:dio/dio.dart';

class NetworkServiceInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    // Set default headers
    options.headers['Accept'] = 'application/json';
    options.headers['Content-Type'] = 'application/json';

    // TODO: Add authentication token when user is logged in
    // if (accessToken.isNotEmpty) {
    //   options.headers['Authorization'] = 'Bearer $accessToken';
    // }

    log('Request[${options.method}] => PATH: ${options.path}');
    super.onRequest(options, handler);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    log('Response[${response.statusCode}] => PATH: ${response.requestOptions.path}');
    super.onResponse(response, handler);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    log('Error[${err.response?.statusCode}] => PATH: ${err.requestOptions.path}');

    // Handle 401 unauthorized - could trigger re-authentication
    if (err.response?.statusCode == 401) {
      log('Unauthorized request - consider implementing token refresh');
    }

    super.onError(err, handler);
  }
}
