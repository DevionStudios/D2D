import 'package:flutter/material.dart';
import 'package:foxxi/components/entry_Point1.dart';
import 'package:foxxi/screens/chat.dart';
import 'package:foxxi/screens/email_verfication_screen.dart';
import 'package:foxxi/screens/forgot_password_email_screen.dart';
import 'package:foxxi/screens/forgot_password_resetscreen.dart';
import 'package:foxxi/screens/login_screen.dart';
import 'package:foxxi/screens/notification_screen.dart';
import 'package:foxxi/screens/otp_screen.dart';
import 'package:foxxi/screens/sign_up_screen.dart';

Route<dynamic> generateRoute(RouteSettings routeSettings) {
  switch (routeSettings.name) {
    case EmailVerificationScreen.routeName:
      return MaterialPageRoute(
        settings: routeSettings,
        builder: (_) => const EmailVerificationScreen(),
      );

    case LoginScreen.routeName:
      return MaterialPageRoute(
        settings: routeSettings,
        builder: (_) => const LoginScreen(),
      );
    case SignUpScreen.routeName:
      return MaterialPageRoute(
        settings: routeSettings,
        builder: (_) => const SignUpScreen(),
      );
    case OTPScreen.routeName:
      return MaterialPageRoute(
        settings: routeSettings,
        builder: (_) => OTPScreen(),
      );

    case ForgotPasswordEmailScreen.routeName:
      return MaterialPageRoute(
        settings: routeSettings,
        builder: (_) => const ForgotPasswordEmailScreen(),
      );
    case ForgotPasswordResetScreen.routeName:
      return MaterialPageRoute(
        settings: routeSettings,
        builder: (_) => const ForgotPasswordResetScreen(),
      );
    case NotificationScreen.routeName:
      return MaterialPageRoute(
        settings: routeSettings,
        builder: (_) => const NotificationScreen(),
      );
    case BottomNavBar.routeName:
      return MaterialPageRoute(
        settings: routeSettings,
        builder: (_) => BottomNavBar(),
      );

    default:
      return MaterialPageRoute(
        settings: routeSettings,
        builder: (_) => const Scaffold(
          body: Center(
            child: Text('Screen does not exist!'),
          ),
        ),
      );
    // }
  }
}
