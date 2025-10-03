import 'dart:async';
import 'dart:io';

import 'package:collectors_card/core/exception/failure.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

mixin DioExceptionMixin {
  Future<T> callApi<T>(FutureOr<T> Function() call) async {
    try {
      return await call();
    } on DioException catch (e, s) {
      debugPrint(e.toString());
      if (e.error is SocketException) {
        throw Failure(
          message: e.message,
          statusCode: e.response?.statusCode,
          exception: e,
          stackTrace: s,
        );
      }

      if (e.response?.statusCode == 400) {
        throw Failure(
          message: e.response?.data['message'].toString() ?? '',
          statusCode: e.response?.statusCode,
          exception: e,
          stackTrace: s,
        );
      }

      if (e.response?.statusCode == 403) {
        throw Failure(
          message: e.response?.data['message'].toString() ?? '',
          statusCode: e.response?.statusCode,
          exception: e,
          stackTrace: s,
        );
      }

      if (e.response?.statusCode == 401) {
        throw Failure(
          message: e.response?.data['message'].toString() ?? '',
          statusCode: e.response?.statusCode,
          exception: e,
          stackTrace: s,
        );
      }

      if (e.response?.statusCode == 422) {
        throw Failure(
          message: e.response?.data['message'].toString() ?? '',
          statusCode: e.response?.statusCode,
          exception: e,
          stackTrace: s,
        );
      }

      if (e.response?.statusCode == 500) {
        throw Failure(
          message:
              e.response?.data['message'].toString() ?? 'Internal Server Error',
          statusCode: e.response?.statusCode,
          exception: e,
          stackTrace: s,
        );
      }

      throw Failure(
        message:
            e.response?.statusMessage ??
            'Something went wrong: ${e.error} : ${e.response?.statusCode}',
        statusCode: e.response?.statusCode,
        exception: e,
        stackTrace: s,
      );
    }
  }
}
