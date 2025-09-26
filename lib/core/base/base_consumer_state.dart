import 'package:collectors_card/core/base/responsive_builder_mixin.dart';
import 'package:collectors_card/core/env/env_reader.dart';
import 'package:collectors_card/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:logging/logging.dart';

abstract class BaseConsumerState<T extends ConsumerStatefulWidget>
    extends ConsumerState<T>
    with ResponsiveBuilder {
  EnvReader get env => providerContainer.read(envReaderProvider);
  Logger get log => Logger(T.toString());

  @override
  void initState() {
    super.initState();
    log.info('$T initState');
  }

  @override
  void dispose() {
    super.dispose();
    log.info('$T dispose');
  }

  double appBarHeight(BuildContext context) => 72;
}
