import 'dart:developer' as dev;

import 'package:flutter/material.dart';
import 'package:foxxi/components/entry_Point1.dart';
import 'package:foxxi/providers/navigation_argument_data_provider.dart';
import 'package:foxxi/screens/preference_screen.dart';

import 'package:foxxi/services/auth_service.dart';
import 'package:foxxi/routing_constants.dart';
import 'package:foxxi/text_field_widget.dart';
import 'package:provider/provider.dart';

class SignUpScreen extends StatefulWidget {
  static const String routeName = signUpScreenRoute;

  const SignUpScreen({
    Key? key,
  }) : super(key: key);

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  // final TextEditingController _emailTextController = TextEditingController();
  final TextEditingController _nameTextController = TextEditingController();
  final TextEditingController _passwordTextController = TextEditingController();
  final TextEditingController _userNameTextController = TextEditingController();
  AuthService authService = AuthService();
  final bool _isLoading = false;
  String email = '';

  // void navigateToPreferenceSCreen() {
  //   Navigator.push(
  //       context,
  //       MaterialPageRoute(
  //         builder: (context) => PreferenceScreen(),
  //       ));
  // }

  void clearControllers() {
    _userNameTextController.clear();
    // _emailTextController.clear();
    _nameTextController.clear();
    _passwordTextController.clear();
  }

  @override
  void dispose() {
    _nameTextController.dispose();
    // _emailTextController.dispose();
    _passwordTextController.dispose();
    _userNameTextController.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final miscProvider =
        Provider.of<ScreenNavigationArgumentProvider>(context, listen: false);
    email = miscProvider.email;
    return Scaffold(
      body: Form(
        key: _formKey,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          width: double.infinity,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Flexible(
                flex: 2,
                child: Container(),
              ),
              const SizedBox(
                height: 40,
              ),
              Text(email),
              const SizedBox(
                height: 24,
              ),
              TextFieldWidget(
                  isName: true,
                  textEditingController: _nameTextController,
                  hintText: "Enter Name",
                  textInputType: TextInputType.text),
              const SizedBox(
                height: 24,
              ),
              TextFieldWidget(
                  isUsername: true,
                  textEditingController: _userNameTextController,
                  hintText: "Enter Username",
                  textInputType: TextInputType.text),
              const SizedBox(
                height: 24,
              ),
              TextFieldWidget(
                  isPassword: true,
                  textEditingController: _passwordTextController,
                  hintText: "Enter Password",
                  textInputType: TextInputType.text),
              const SizedBox(
                height: 24,
              ),
              InkWell(
                onTap: () {
                  if (_formKey.currentState!.validate()) {
                    dev.log("SignUp Form Validation Passed ",
                        name: "SignUp Form Validation");
                    authService.signUp(
                        context: context,
                        username: _userNameTextController.text,
                        name: _nameTextController.text,
                        password: _passwordTextController.text,
                        email: email);
                  } else {
                    dev.log("SignUp Form Validation Failed",
                        name: "SignUp Form Validation");
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
                      : const Center(child: Text("Sign Up")),
                ),
              ),
              Flexible(
                flex: 2,
                child: Container(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
