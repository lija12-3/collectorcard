import 'package:flutter/material.dart';
import 'package:logging/logging.dart';
import 'responsive_builder_mixin.dart';

abstract class BaseState<T extends StatefulWidget> extends State<T>
    with ResponsiveBuilder {
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
}
