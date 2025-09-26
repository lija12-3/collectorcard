<h1>Card Collector Mobile App</h1>

A production-ready Flutter application built with Riverpod, Freezed, Retrofit, Hive, Amplify, and Sentry, following a clean architecture boilerplate to ensure scalability, maintainability, and high-quality mobile experiences.

<h2>Architecture</h2>

The app follows a layered modular architecture with clear separation of concerns:

```
┌──────────────────────────────────────────────────────────────┐
│                        Flutter Mobile App                    │
└─────────────────────────────────┬────────────────────────────┘
                                  │
┌─────────────────────────────────▼────────────────────────────┐
│                   Presentation Layer (UI)                    │
│  • Flutter Widgets   • Riverpod Providers   • State Notifiers│
└─────────────────────────────────┬────────────────────────────┘
                                  │
┌─────────────────────────────────▼────────────────────────────┐
│                         Application Layer                    │
│  • BLoC / Riverpod Logic  • Use Cases  • Error Handling      │
└─────────────────────────────────┬────────────────────────────┘
                                  │
┌─────────────────────────────────▼────────────────────────────┐
│                           Data Layer                         │
│  • Retrofit API Clients   • Hive Local DB   • Secure Storage │
│  • DTOs with Freezed/JSON Serializable                       │
└─────────────────────────────────┬────────────────────────────┘
                                  │
┌─────────────────────────────────▼────────────────────────────┐
│                             Core Layer                       │
│  • Logging (Logger + Sentry)                                 │
│  • Theme & Localization                                      │
│  • Config & Environment (dotenv)                             │
└──────────────────────────────────────────────────────────────┘
```

<h2>Features</h2>

State Management with Riverpod
Immutable Models with Freezed
API Integration with Retrofit + Dio
Local Database with Hive (AES encryption)
Secure Storage for secrets
Amplify Cognito for Authentication
Sentry for error tracking
Multi-flavor support (dev, staging, prod)

<h2>Project Structure</h2>

```
apps/mobile_app/
├── lib/
│   ├── core/                        # Common utilities (logger, theme, env, errors)
│   ├── features/                    # Feature-based modules (login, dashboard, etc.)
│   │   ├── login/
│   │   │   ├── data/                # DTOs, Retrofit API services
│   │   │   ├── domain/              # Entities, Use cases
│   │   │   └── presentations        # Screens, Widgets, Riverpod Providers
│   ├── main.dart                    # Production entry
│   ├── main_dev.dart                # Dev entry
│   ├── main_staging.dart            # Staging entry
│   └── main_widget.dart             # Root widget with ProviderScope
├── test/                            # Unit & widget tests
├── android/                         # Android-specific configs
├── ios/                             # iOS-specific configs
└── pubspec.yaml                     # Dependencies
```

<h2>Prerequisites</h2>

Flutter SDK 3.9.2

Android Studio / Xcode / VS Code


<h2>Monitoring & Logging</h2>

Logger: Structured logging during dev & prod.

Sentry: Captures crashes, errors, stack traces.

Amplify Analytics (optional) for tracking events.
