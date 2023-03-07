import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:foxxi/components/check.dart';
import 'package:foxxi/components/check2.dart';
import 'package:foxxi/providers/navigation_argument_data_provider.dart';
import 'package:foxxi/providers/post_provider.dart';
import 'package:foxxi/providers/story_provider.dart';
import 'package:foxxi/providers/wallet_address.dart';
import 'package:foxxi/screens/login_screen.dart';
import 'package:foxxi/router.dart';
import 'package:foxxi/providers/user_provider.dart';
import 'package:foxxi/screens/splash_screen.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(MultiProvider(
    providers: [
      ChangeNotifierProvider(create: ((context) => WalletAddressProvider())),
      ChangeNotifierProvider(create: ((context) => UserProvider())),
      ChangeNotifierProvider(create: ((context) => PostProvider())),
      ChangeNotifierProvider(
          create: (context) => ScreenNavigationArgumentProvider()),
      ChangeNotifierProvider(create: ((context) => StoryProvider())),
    ],
    child: const MyApp(),
  ));
}

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      onGenerateRoute: (settings) => generateRoute(settings),
      home: const SplashScreen(),
    );
  }
}
