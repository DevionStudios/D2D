import 'dart:io';

import 'package:flutter/material.dart';
import 'package:foxxi/services/auth_service.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

import '../providers/theme_provider.dart';

// import 'package:flutter/material.dart';
class ProfileSettings extends StatefulWidget {
  // const ProfileSettings
// ({super.key});

  @override
  State<ProfileSettings> createState() => _ProfileSettingsState();
}

class _ProfileSettingsState extends State<ProfileSettings> {
  final TextEditingController _usernameTextController = TextEditingController();
  final TextEditingController _nameTextController = TextEditingController();
  final TextEditingController _bioTextController = TextEditingController();
  final TextEditingController _walletAddressTextController =
      TextEditingController();
  AuthService authService = AuthService();
  var _imageProfile;
  var _imageCover;
  XFile? image;
  XFile? coverImage;

  var imagePicker;
  @override
  void initState() {
    super.initState();
    imagePicker = ImagePicker();
  }

  @override
  void dispose() {
    _bioTextController.dispose();
    _nameTextController.dispose();
    _usernameTextController.dispose();
    _walletAddressTextController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;

    return Scaffold(
      body: SingleChildScrollView(
        child: Container(
          padding: EdgeInsets.only(
              top: MediaQuery.of(context).padding.top,
              bottom: MediaQuery.of(context).padding.bottom),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                  padding: EdgeInsets.all(16),
                  height: 100,
                  // width: MediaQuery.of(context).size.width * 0.1,
                  child: CircleAvatar(
                    backgroundColor:
                        Colors.purpleAccent.shade100.withOpacity(0.4),
                    child: IconButton(
                      // iconSize: 20,
                      icon: Icon(
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
                  "Profile",
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 30),
                ),
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  "This information will be displayed publicly so be careful what you share",
                  style: TextStyle(
                    fontFamily: 'InstagramSans',
                    fontSize: 15,
                  ),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Column(
                    children: [
                      const Text(
                        'Image',
                        style: TextStyle(
                            fontFamily: 'InstagramSans', fontSize: 15),
                      ),
                      GestureDetector(
                        onTap: () async {
                          image = await imagePicker.pickImage(
                              source: ImageSource.gallery);
                          if (image?.path != null) {
                            setState(() {
                              _imageProfile = File(image!.path);
                            });
                          }
                        },
                        child: Container(
                          // padding: EdgeInsets.only(left: 8),
                          decoration: BoxDecoration(
                              border: Border.all(
                                  color: Colors.grey.shade500,
                                  style: BorderStyle.solid,
                                  width: 3)),
                          width: MediaQuery.of(context).size.width / 3 - 20,
                          height: 100,
                          child: _imageProfile != null
                              ? Image.file(
                                  _imageProfile,
                                  fit: BoxFit.cover,
                                )
                              : Icon(
                                  Icons.file_upload_rounded,
                                  color: isDark
                                      ? Colors.grey.shade200
                                      : Colors.grey[800],
                                ),
                        ),
                      )
                    ],
                  ),
                  Column(
                    children: [
                      const Text(
                        'Cover Image',
                        style: TextStyle(
                            fontFamily: 'InstagramSans', fontSize: 15),
                      ),
                      GestureDetector(
                        onTap: () async {
                          coverImage = await imagePicker.pickImage(
                              source: ImageSource.gallery);
                          if (coverImage?.path != null) {
                            setState(() {
                              _imageCover = File(coverImage!.path);
                            });
                          }
                        },
                        child: Container(
                          decoration: BoxDecoration(
                              border: Border.all(
                                  color: Colors.grey.shade500,
                                  style: BorderStyle.solid,
                                  width: 3)),
                          width: (2 * (MediaQuery.of(context).size.width) / 3) -
                              20,
                          height: 100,
                          child: _imageCover != null
                              ? Image.file(
                                  _imageCover,
                                  fit: BoxFit.fitWidth,
                                )
                              : Icon(
                                  Icons.upload_rounded,
                                  color: isDark
                                      ? Colors.grey.shade200
                                      : Colors.grey[800],
                                ),
                        ),
                      )
                    ],
                  ),
                ],
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  'Full Name',
                  style: TextStyle(fontFamily: 'InstagramSans', fontSize: 15),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                child: TextField(
                  controller: _nameTextController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    // prefixText: 'Kuntal',
                  ),
                ),
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  'Username on Twitter (Cannot be changed once set)',
                  style: TextStyle(fontFamily: 'InstagramSans', fontSize: 15),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                child: TextField(
                  controller: _usernameTextController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'You cannot change this later',
                  ),
                ),
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  "Wallet Address",
                  style: TextStyle(fontFamily: 'InstagramSans', fontSize: 15),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                child: TextField(
                  controller: _walletAddressTextController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                  ),
                ),
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  'Bio',
                  style: TextStyle(fontFamily: 'InstagramSans', fontSize: 15),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8.0),
                child: TextField(
                  controller: _bioTextController,
                  maxLines: 3,
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
                                  begin: AlignmentDirectional(1, 0),
                                  end: AlignmentDirectional(-1, 0),
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
                              authService.updateProfile(
                                  context: context,
                                  bio: _bioTextController.text,
                                  coverImagePath: coverImage?.path == null
                                      ? null
                                      : coverImage!.path,
                                  imagePath:
                                      image?.path == null ? null : image!.path,
                                  name: _nameTextController.text,
                                  username: _usernameTextController.text,
                                  walletAddress:
                                      _walletAddressTextController.text);
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
