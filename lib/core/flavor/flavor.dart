enum Flavor {
  dev,
  staging,
  prod;

  static Flavor? _current;

  static Flavor get current {
    assert(_current != null, 'Flavor not initialized');
    return _current!;
  }

  static void setFlavor(Flavor flavor) {
    _current = flavor;
  }

  String get name {
    switch (this) {
      case Flavor.dev:
        return 'Development';
      case Flavor.staging:
        return 'Staging';
      case Flavor.prod:
        return 'Production';
    }
  }

  String get baseUrl {
    switch (this) {
      case Flavor.dev:
        return 'https://dev-api.*****.com';
      case Flavor.staging:
        return 'https://staging-api.*****.com';
      case Flavor.prod:
        return 'https://api.*****.com';
    }
  }

  String get apiBaseUrl => baseUrl;

  String get appTitle {
    switch (this) {
      case Flavor.dev:
        return 'Card Collector Rx (Dev)';
      case Flavor.staging:
        return 'Card Collector Rx (Staging)';
      case Flavor.prod:
        return 'Card Collector Rx';
    }
  }

  bool get isProduction => this == Flavor.prod;
  bool get isDevelopment => this == Flavor.dev;
  bool get isStaging => this == Flavor.staging;
}
