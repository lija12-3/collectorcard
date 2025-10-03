import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:logging/logging.dart';

abstract class BaseStateNotifier<T> extends AutoDisposeNotifier<T> {
  Logger get log => Logger(runtimeType.toString());

  @override
  T build() {
    log.info('${runtimeType.toString()} build');
    return initialState();
  }

  T initialState();

  // @override
  // void dispose() {
  //   log.info('${runtimeType.toString()} dispose');
  //   super.();
  // }
}
