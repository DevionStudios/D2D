import 'dart:async';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:foxxi/components/entry_Point1.dart';
import 'package:foxxi/screens/login_screen.dart';
import 'package:rive/rive.dart';
import 'package:flutter/material.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _MyRiveAnimationState();
}

class _MyRiveAnimationState extends State<SplashScreen> {
  bool firstScreenBool = false;
  void jwtOrEmpty() async {
    var cookies = await const FlutterSecureStorage().read(key: 'cookies');

    if (cookies != null) {
      setState(() {
        firstScreenBool = true;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    jwtOrEmpty();

    Timer(
        const Duration(milliseconds: 1500),
        () => Navigator.pushReplacement(
            context,
            MaterialPageRoute(
                builder: (context) => firstScreenBool
                    ? const BottomNavBar()
                    : const LoginScreen())));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        color: Colors.grey.shade900,
        child: const Center(
          // width: 5,
          child: RiveAnimation.asset(
            'lib/assets/foxxiSplash.riv',
            fit: BoxFit.cover,
          ),
        ),
      ),
    );
  }
}
