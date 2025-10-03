import 'package:collectors_card/core/local/db/hive_box_key.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';

final sessionBoxProvider = Provider<Box>((ref) {
  return Hive.box(sessionBox);
});
