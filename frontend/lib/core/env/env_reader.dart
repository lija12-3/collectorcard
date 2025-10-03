import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../flavor/flavor.dart';

final envReaderProvider = Provider<EnvReader>((ref) {
  return EnvReader.instance;
});

class EnvReader {
  static EnvReader? _instance;

  EnvReader._();

  static EnvReader get instance {
    _instance ??= EnvReader._();
    return _instance!;
  }

  Future<void> initialize() async {
    // Load the environment file based on current flavor
    final envFileName = getEnvFileName(Flavor.current);
    await dotenv.load(fileName: envFileName);
  }

  String getEnvFileName(Flavor flavor) {
    switch (flavor) {
      case Flavor.dev:
        return '.env.dev';
      case Flavor.staging:
        return '.env.staging';
      case Flavor.prod:
        return '.env.prod';
    }
  }

  String getAppTitle() {
    return dotenv.env['APP_TITLE'] ?? Flavor.current.appTitle;
  }

  String getBaseUrl() {
    return dotenv.env['API_BASE_URL'] ?? Flavor.current.baseUrl;
  }

  String getSentryDsn() {
    return dotenv.env['SENTRY_DSN'] ?? '';
  }

  String getCognitoClientId() {
    return dotenv.get('cognitoClientId');
  }

  String getCognitoUserPoolId() {
    return dotenv.get('cognitoUserPoolId');
  }

  String getCognitoPoolRegion() {
    return dotenv.get('cognitoUserPoolRegion');
  }

  String getCognitoRedirectUri() {
    return dotenv.get('cognitoClientRedirectUri');
  }

  String getCognitoWebDomain() {
    return dotenv.get('cognitoClientWebDomain');
  }

  String getCognitoClientSecret() {
    return dotenv.get('cognitoClientSecret');
  }

  // Legacy getters for compatibility
  String get apiUrl => getBaseUrl();
  String get appName => getAppTitle();
  String get apiBaseUrl => getBaseUrl();
  String get sentryDsn => getSentryDsn();

  bool get isDebugMode => !Flavor.current.isProduction;
  String get environment => Flavor.current.name;

  // App specific configurations
  Duration get httpTimeout => const Duration(seconds: 30);
  int get maxRetryAttempts => 3;
  Duration get cacheExpiry => const Duration(hours: 24);

  // Feature flags
  bool get enableAnalytics => Flavor.current.isProduction;
  bool get enableCrashReporting => Flavor.current.isProduction;
  bool get enableLogging => !Flavor.current.isProduction;

}
