import 'package:collectors_card/core/common/widget/no_route_screen.dart';
import 'package:collectors_card/core/router/app_router_notifier.dart';
import 'package:collectors_card/core/router/named_route.dart';
import 'package:collectors_card/features/login/presentation/ui/login_screen.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:logging/logging.dart';

part 'app_router.g.dart';

final GlobalKey<NavigatorState> navigatorKey = GlobalKey();
final GlobalKey<NavigatorState> shellNavigatorKey = GlobalKey();

/// Returns a configured GoRouter instance for the application.
///
/// The router is set up with a navigator key, an initial location, and a redirect
/// function that checks if the user is logged in before allowing navigation to
/// certain routes. It also defines routes for login, home, and settings screens.
///
/// Parameters:
///   ref: A reference to the application router.
///
/// Returns:
///   GoRouter: A configured GoRouter instance.
///
@riverpod
GoRouter appRouter(Ref ref) {
  final notifier = ref.read(appRouterNotifierProvider);

  return GoRouter(
    navigatorKey: navigatorKey,
    initialLocation: kIsWeb ? '/login' : '/login',
    refreshListenable: notifier,
    redirect: (context, state) {
      final isLoggedIn = notifier.isLoggedIn;
      final isGoingToLogin = state.matchedLocation == '/login';

      // If not logged in and not going to login page, redirect to login
      if (!isLoggedIn && !isGoingToLogin) {
        return '/login';
      }

      // If logged in and going to login page, redirect to home
      if (isLoggedIn && isGoingToLogin) {
        Logger.root.info("redirecting via appRouter");
        return '/home';
      }

      return null;
    },
    routes: <RouteBase>[
      GoRoute(
        parentNavigatorKey: navigatorKey,
        path: '/login',
        name: login,
        pageBuilder: (context, state) => CustomTransitionPage(
          key: state.pageKey,
          child: const LoginScreen(),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            return FadeTransition(opacity: animation, child: child);
          },
        ),
      ),
      GoRoute(
        parentNavigatorKey: navigatorKey,
        path: '/home',
        name: home,
        pageBuilder: (context, state) => CustomTransitionPage(
          key: state.pageKey,
          child: const Scaffold(
            body: Center(child: Text('Home Screen - Coming Soon')),
          ),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            return FadeTransition(opacity: animation, child: child);
          },
        ),
      ),
      GoRoute(
        parentNavigatorKey: navigatorKey,
        path: '/',
        name: initial,
        redirect: (context, state) => '/login',
      ),
    ],
    errorBuilder: (context, state) => NoRouteScreen(key: state.pageKey),
  );
}
