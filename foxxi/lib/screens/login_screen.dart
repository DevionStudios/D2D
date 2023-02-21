import 'package:flutter/material.dart';
import 'package:foxxi/providers/navigation_argument_data_provider.dart';
import 'package:foxxi/services/auth_service.dart';
import 'package:foxxi/screens/email_verfication_screen.dart';
import 'package:foxxi/routing_constants.dart';
import 'package:foxxi/text_field_widget.dart';
import 'dart:developer' as dev;

import 'package:provider/provider.dart';

class LoginScreen extends StatefulWidget {
  static const String routeName = loginScreenRoute;
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _emailTextController = TextEditingController();
  final TextEditingController _passwordTextController = TextEditingController();
  AuthService authService = AuthService();

  final _isLoading = false;

  void loginUser() {
    authService.signIn(
        context: context,
        email: _emailTextController.text,
        password: _passwordTextController.text);
  }

  void clearControllers() {
    _emailTextController.clear();
    _passwordTextController.clear();
  }

  @override
  void dispose() {
    _emailTextController.dispose();
    _passwordTextController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider =
        Provider.of<ScreenNavigationArgumentProvider>(context, listen: false);
    return Scaffold(
      body: Form(
        key: _formKey,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          width: double.infinity,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Flexible(
                flex: 2,
                child: Container(),
              ),
              const SizedBox(
                height: 64,
              ),
              TextFieldWidget(
                  isEmail: true,
                  textEditingController: _emailTextController,
                  hintText: "Enter Your Email",
                  textInputType: TextInputType.emailAddress),
              const SizedBox(
                height: 24,
              ),
              TextFieldWidget(
                  textEditingController: _passwordTextController,
                  isPassword: true,
                  hintText: "Enter Password",
                  textInputType: TextInputType.text),
              const SizedBox(
                height: 24,
              ),
              InkWell(
                onTap: () {
                  if (_formKey.currentState!.validate()) {
                    dev.log("Form Validation Passed",
                        name: "Login Screen Form Validation");
                    loginUser();
                    clearControllers();
                  } else {
                    dev.log("Form Validation Failed",
                        name: "Login Screen Form Validation");
                  }
                },
                child: Ink(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: const ShapeDecoration(
                    color: Colors.blue,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.all(
                        Radius.circular(
                          4,
                        ),
                      ),
                    ),
                  ),
                  child: _isLoading
                      ? const Center(
                          child: CircularProgressIndicator(
                            color: Colors.lightBlue,
                          ),
                        )
                      : const Center(child: Text("Login")),
                ),
              ),
              const SizedBox(
                height: 12,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  GestureDetector(
                    onTap: () {
                      provider.setDestination(forgotPasswordResetScreenRoute);
                      Navigator.pushNamed(
                          context, EmailVerificationScreen.routeName);
                    },
                    child: const Text(
                      'Forgot Password?',
                      style: TextStyle(color: Colors.blue),
                    ),
                  ),
                ],
              ),
              const SizedBox(
                height: 12,
              ),
              Flexible(
                flex: 2,
                child: Container(),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      vertical: 8,
                    ),
                    child: const Text("Don't have an account? "),
                  ),
                  GestureDetector(
                    onTap: () {
                      provider.setDestination(signUpScreenRoute);
                      Navigator.pushNamed(
                          context, EmailVerificationScreen.routeName);
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        vertical: 8,
                      ),
                      child: const Text(
                        "Sign Up",
                        style: TextStyle(
                          color: Colors.lightBlue,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  )
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
