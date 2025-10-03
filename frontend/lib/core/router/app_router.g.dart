// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_router.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$appRouterHash() => r'8d72f6c72c6c07c807a34162deb8ff3f883017f7';

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
///
/// Copied from [appRouter].
@ProviderFor(appRouter)
final appRouterProvider = AutoDisposeProvider<GoRouter>.internal(
  appRouter,
  name: r'appRouterProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$appRouterHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef AppRouterRef = AutoDisposeProviderRef<GoRouter>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
