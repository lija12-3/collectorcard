import 'package:collectors_card/main_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  testWidgets('App renders MainWidget', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: MainWidget())),
    );

    // Just check that MainWidget exists in the widget tree
    expect(find.byType(MainWidget), findsOneWidget);
  });
}
