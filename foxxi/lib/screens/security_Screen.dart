import 'package:flutter/material.dart';
import 'package:foxxi/services/auth_service.dart';
import 'package:foxxi/utils.dart';

class SecuritySettingScreen extends StatefulWidget {
  SecuritySettingScreen({super.key});

  @override
  State<SecuritySettingScreen> createState() => _SecuritySettingScreenState();
}

class _SecuritySettingScreenState extends State<SecuritySettingScreen> {
  final TextEditingController _oldPasswordTextController =
      TextEditingController();

  final TextEditingController _newPasswordTextController =
      TextEditingController();

  final TextEditingController _confirmNewPasswordTextController =
      TextEditingController();
  AuthService authService = AuthService();
  @override
  void dispose() {
    _confirmNewPasswordTextController.dispose();
    _newPasswordTextController.dispose();
    _oldPasswordTextController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                  padding: const EdgeInsets.all(16),
                  height: 100,
                  // width: MediaQuery.of(context).size.width * 0.1,
                  child: CircleAvatar(
                    backgroundColor:
                        Colors.purpleAccent.shade100.withOpacity(0.4),
                    child: IconButton(
                      // iconSize: 20,
                      icon: const Icon(
                        Icons.arrow_back_ios_new_rounded,
                        color: Colors.white,
                        // size: 15,
                      ),
                      onPressed: () {
                        Navigator.pop(context);
                      },
                    ),
                  )),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  'Secuity Settings',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 30),
                ),
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  'Change your password',
                  style: TextStyle(
                    fontFamily: 'InstagramSans',
                    fontSize: 18,
                  ),
                ),
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  'Current Password',
                  style: TextStyle(
                    fontFamily: 'InstagramSans',
                    fontSize: 15,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: TextField(
                  controller: _oldPasswordTextController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                  ),
                ),
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  'New Password',
                  style: TextStyle(
                    fontFamily: 'InstagramSans',
                    fontSize: 15,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: TextField(
                  controller: _newPasswordTextController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                  ),
                ),
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  'Confirm your password',
                  style: TextStyle(
                    fontFamily: 'InstagramSans',
                    fontSize: 15,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: TextField(
                  controller: _confirmNewPasswordTextController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                  ),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Container(
                    padding: const EdgeInsets.all(8.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Stack(children: <Widget>[
                          Positioned.fill(
                            child: Container(
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(15),
                                gradient: LinearGradient(
                                  colors: [
                                    Colors.lightBlue.shade100.withOpacity(0.4),
                                    Colors.purpleAccent.shade100
                                        .withOpacity(0.4),
                                  ],
                                  stops: [0, 1],
                                  begin: const AlignmentDirectional(1, 0),
                                  end: const AlignmentDirectional(-1, 0),
                                  // color: Colors.purpleAccent.shade100.withOpacity(
                                  // 0.3,
                                ),
                              ),
                            ),
                          ),
                          TextButton(
                            style: TextButton.styleFrom(
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.all(16.0),
                              textStyle: const TextStyle(fontSize: 20),
                            ),
                            onPressed: () {
                              if (_newPasswordTextController.text ==
                                  _confirmNewPasswordTextController.text) {
                                authService.updatePassword(
                                    context: context,
                                    oldPassword:
                                        _oldPasswordTextController.text,
                                    newPassword:
                                        _confirmNewPasswordTextController.text);
                              } else {
                                _newPasswordTextController.clear();
                                _confirmNewPasswordTextController.clear();
                                showSnackBar(
                                    context, 'New Password Do not match');
                              }
                            },
                            child: const Text('Update'),
                          ),
                        ]),
                      ],
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
