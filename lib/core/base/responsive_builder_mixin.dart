import 'package:flutter/material.dart';
import 'break_point.dart';

mixin ResponsiveBuilder {
  Widget responsiveBuilder({
    required BuildContext context,
    Widget? mobile,
    Widget? tablet,
    Widget? desktop,
  }) {
    final screenWidth = MediaQuery.of(context).size.width;

    if (screenWidth >= BreakPoint.desktop) {
      return desktop ?? tablet ?? mobile ?? const SizedBox.shrink();
    } else if (screenWidth >= BreakPoint.tablet) {
      return tablet ?? mobile ?? const SizedBox.shrink();
    } else {
      return mobile ?? const SizedBox.shrink();
    }
  }

  bool isMobile(BuildContext context) {
    return MediaQuery.of(context).size.width < BreakPoint.tablet;
  }

  bool isTablet(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    return width >= BreakPoint.tablet && width < BreakPoint.desktop;
  }

  bool isDesktop(BuildContext context) {
    return MediaQuery.of(context).size.width >= BreakPoint.desktop;
  }
}
