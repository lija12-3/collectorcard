import 'package:collectors_card/core/flavor/flavor.dart';
import 'package:collectors_card/main.dart';

Future<void> main() async {
  Flavor.setFlavor(Flavor.dev);
  await mainApp(Flavor.dev);
}
