import 'package:collectors_card/core/env/env_reader.dart';
import 'package:collectors_card/core/router/app_router.dart';
import 'package:collectors_card/core/theme/theme_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class MainWidget extends ConsumerWidget {
  const MainWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final appRoute = ref.watch(appRouterProvider);
    final currentTheme = ref.watch(currentThemeProvider);
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarIconBrightness: Brightness.light,
        statusBarBrightness: Brightness.light,
      ),
    );

    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      routerConfig: appRoute,

      builder: (context, child) {
        final data = MediaQuery.of(context);
        return MediaQuery(
          data: data.copyWith(textScaler: const TextScaler.linear(1)),
          child: child!,
        );
      },
      title: ref.read(envReaderProvider).getAppTitle(),
      theme: currentTheme,
      themeMode: ThemeMode.light,
    );
  }
}
