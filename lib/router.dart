import 'package:flutter/material.dart';
import 'package:foxxi/components/check.dart';
import 'package:foxxi/screens/email_verfication_screen.dart';
import 'package:foxxi/screens/forgot_password_email_screen.dart';
import 'package:foxxi/screens/forgot_password_resetscreen.dart';
import 'package:foxxi/screens/login_screen.dart';
import 'package:foxxi/screens/main_screen.dart';
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
    case MainScreen.routeName:
      return MaterialPageRoute(
        settings: routeSettings,
        builder: (_) => const MainScreen(),
      );
    case BottomNavBar.routeName:
      return MaterialPageRoute(
        builder: (_) => const BottomNavBar(),
      );
    //   case AddressScreen.routeName:
    //     var totalAmount = routeSettings.arguments as String;
    //     return MaterialPageRoute(
    //       settings: routeSettings,
    //       builder: (_) => AddressScreen(
    //         totalAmount: totalAmount,
    //       ),
    //     );
    //   case OrderDetailScreen.routeName:
    //     var order = routeSettings.arguments as Order;
    //     return MaterialPageRoute(
    //       settings: routeSettings,
    //       builder: (_) => OrderDetailScreen(
    //         order: order,
    //       ),
    //     );
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
