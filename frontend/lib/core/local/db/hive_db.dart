import 'dart:convert';

import 'package:sentry_flutter/sentry_flutter.dart';
import 'package:collectors_card/core/local/db/hive_box_key.dart';
import 'package:collectors_card/core/local/db/hive_const.dart';
import 'package:collectors_card/core/local/secure_storage/secure_storage.dart';
import 'package:collectors_card/core/local/secure_storage/secure_storage_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';

final hiveDbProvider = Provider<HiveDb>((ref) {
  final secureStorage = ref.watch(secureStorageProvider);

  return HiveDb(secureStorage);
});

class HiveDb {
  final SecureStorage _secureStorage;

  HiveDb(this._secureStorage);

  Future<void> init() async {
    Sentry.captureMessage('Hive init');

    //You can provide a [subDir] where the boxes should be stored.
    await Hive.initFlutter(hiveDbPath);
    Sentry.captureMessage('Hive init flutter');

    String? encryptionKey;
    encryptionKey = await _secureStorage.getHiveKey();
    Sentry.captureMessage('Hive igetHiveKey');

    if (encryptionKey == null) {
      //Generates a secure encryption key using the fortuna random algorithm
      final key = Hive.generateSecureKey();
      Sentry.captureMessage('Hive encryption key generated');
      // store the key to flutter secure storage
      await _secureStorage.setHiveKey(base64UrlEncode(key));
      Sentry.captureMessage('store the key to flutter secure storage');

      // read the key
      encryptionKey = await _secureStorage.getHiveKey();
      Sentry.captureMessage('read the key');
    }

    if (encryptionKey != null) {
      final key = base64Url.decode(encryptionKey);
      Sentry.captureMessage(' base64Url.decode(encryptionKey)');

      await Hive.openBox(sessionBox, encryptionCipher: HiveAesCipher(key));
      Sentry.captureMessage('openbox');
    }
  }
}
