import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../env/env_reader.dart';

part 'base_url.g.dart';

@Riverpod(keepAlive: true)
String baseUrl(Ref ref) {
  return EnvReader.instance.apiBaseUrl;
}
