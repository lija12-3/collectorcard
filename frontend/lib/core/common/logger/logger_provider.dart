import 'dart:developer' as developer;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:logging/logging.dart';

part 'logger_provider.g.dart';

@Riverpod(keepAlive: true)
Logger logger(Ref ref) {
  final logger = Logger('CardCollectionRx');

  const bool isDebugMode = bool.fromEnvironment('dart.vm.product') == false;
  Logger.root.level = isDebugMode ? Level.ALL : Level.WARNING;

  Logger.root.onRecord.listen((record) {
    developer.log(
      '${record.level.name}: ${record.time}: ${record.message}',
      name: record.loggerName,
      time: record.time,
      level: record.level.value,
      error: record.error,
      stackTrace: record.stackTrace,
    );
  });

  return logger;
}
