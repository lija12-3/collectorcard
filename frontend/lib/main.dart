import 'package:collectors_card/core/common/logger/logger_provider.dart';
import 'package:collectors_card/core/config/nonweb_url_strategy.dart'
    if (dart.library.html) 'package:collectors_card/core/config/web_url_strategy.dart';
import 'package:collectors_card/core/dependencies/authentication/amplify/amplify_config.dart';
import 'package:collectors_card/core/env/env_reader.dart';
import 'package:collectors_card/core/flavor/flavor.dart';
import 'package:collectors_card/core/local/db/hive_db.dart';
import 'package:collectors_card/main_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

ProviderContainer _providerContainer = ProviderContainer();

ProviderContainer get providerContainer => _providerContainer;

Future<void> mainApp(Flavor flavor) async {
  SentryWidgetsFlutterBinding.ensureInitialized();
  WidgetsFlutterBinding.ensureInitialized();

  configureUrl();

  // Load the environment based on the flavour
  final envReader = providerContainer.read(envReaderProvider);
  final envFile = envReader.getEnvFileName(flavor);
  await dotenv.load(fileName: envFile);

  //Set up Logger
  providerContainer.read(loggerProvider);

  //Initialise cognito amplify client
  await providerContainer.read(amplifyConfigProvider).initializeAmplify();

  // setup the hive database
  final db = providerContainer.read(hiveDbProvider);
  await db.init();

  await SentryFlutter.init(
    (options) {
      options.dsn =
          'https://d058a8588f2cd38751434c306b0b4323@o4508233844326400.ingest.us.sentry.io/4508233845440512';
      options.tracesSampleRate = 1.0;
      options.profilesSampleRate = 1.0;
    },
    appRunner: () => runApp(
      UncontrolledProviderScope(
        container: providerContainer,
        child: const MainWidget(),
      ),
    ),
  );
}
