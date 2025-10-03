import 'dart:convert';
import 'dart:developer';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:collectors_card/core/env/env_reader.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final amplifyConfigProvider = Provider<AmplyConfig>((ref) {
  final envReader = ref.read(envReaderProvider);
  return AmplyConfig(envReader);
});

class AmplyConfig {
  AmplyConfig(this._envReader);
  final EnvReader _envReader;

  Future<void> initializeAmplify() async {
    try {
      final plugins = [AmplifyAuthCognito()];

      if (Amplify.isConfigured) {
        await Amplify.reset(); // Important reset step
      }
      await Amplify.addPlugins(plugins);
      final userPoolId = _envReader.getCognitoUserPoolId();
      final cognitoClientId = _envReader.getCognitoClientId();
      final cognitoUserPoolRegion = _envReader.getCognitoPoolRegion();
      final cognitoRedirectUri =
          '${_envReader.getCognitoRedirectUri()}signupIntro';
      final cognitoSignOutRedirectUri = _envReader.getCognitoRedirectUri();
      final cognitoWebDomain = _envReader.getCognitoWebDomain();
      if (!Amplify.isConfigured) {
        await Amplify.configure(
          _amplifyConfig(
            cognitoClientId: cognitoClientId,
            cognitoUserPoolId: userPoolId,
            cognitoUserPoolRegion: cognitoUserPoolRegion,
            cognitoRedirectUri: cognitoRedirectUri,
            cognitoSignOutRedirectUri: cognitoSignOutRedirectUri,
            cognitoWebDomain: cognitoWebDomain,
          ),
        );
      }
    } on Exception catch (e) {
      log(e.toString(), name: 'AMPLIFY');
    }
  }

  String _amplifyConfig({
    required String cognitoClientId,
    required String cognitoUserPoolId,
    required String cognitoUserPoolRegion,
    required String cognitoRedirectUri,
    required String cognitoSignOutRedirectUri,
    required String cognitoWebDomain,
  }) {
    final config = {
      'auth': {
        'plugins': {
          CognitoPluginConfig.pluginKey: {
            'IdentityManager': {'Default': <String, Object>{}},
            'CognitoUserPool': {
              'Default': <String, String>{
                'PoolId': cognitoUserPoolId,
                'AppClientId': cognitoClientId,
                'Region': cognitoUserPoolRegion,
              },
            },
            'Auth': {
              'Default': {
                "OAuth": {
                  "WebDomain": cognitoWebDomain,
                  "AppClientId": cognitoClientId,
                  "SignInRedirectURI": 'curaconnect://$cognitoRedirectUri',
                  "SignOutRedirectURI":
                      'curaconnect://$cognitoSignOutRedirectUri',
                  "Scopes": [
                    "email",
                    "phone",
                    "openid",
                    "aws.cognito.signin.user.admin",
                  ],
                },
                'authenticationFlowType': 'ALLOW_CUSTOM_AUTH',
              },
            },
          },
        },
      },
    };
    return jsonEncode(config);
  }
}
