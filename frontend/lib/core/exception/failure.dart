import 'package:equatable/equatable.dart';

class Failure with EquatableMixin implements Exception {
  final String? message;
  final int? statusCode;
  final Exception? exception;
  final StackTrace stackTrace;

  Failure({
    required this.message,
    this.statusCode,
    this.exception,
    required this.stackTrace,
  });

  @override
  List<Object?> get props => [message, statusCode, exception, stackTrace];

  @override
  bool get stringify => true;
}