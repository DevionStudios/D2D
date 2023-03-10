import 'dart:io';

import 'package:flutter/material.dart';
import 'package:foxxi/services/auth_service.dart';
import 'package:image_picker/image_picker.dart';

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
    return Scaffold(
      body: SingleChildScrollView(
        child: Container(
          padding: EdgeInsets.only(
              top: MediaQuery.of(context).padding.top,
              bottom: MediaQuery.of(context).padding.bottom),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
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
                            fontFamily: 'InstagramSans',
                            color: Colors.black,
                            fontSize: 15),
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
                                  color: Colors.grey[800],
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
                            fontFamily: 'InstagramSans',
                            color: Colors.black,
                            fontSize: 15),
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
                                  color: Colors.grey[800],
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
                  style: TextStyle(
                      fontFamily: 'InstagramSans',
                      color: Colors.black,
                      fontSize: 15),
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
                  style: TextStyle(
                      fontFamily: 'InstagramSans',
                      color: Colors.black,
                      fontSize: 15),
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
                  style: TextStyle(
                      fontFamily: 'InstagramSans',
                      color: Colors.black,
                      fontSize: 15),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                child: TextField(
                  controller: _walletAddressTextController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    prefixText: 'undefined',
                  ),
                ),
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  'Bio',
                  style: TextStyle(
                      fontFamily: 'InstagramSans',
                      color: Colors.black,
                      fontSize: 15),
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
              Container(
                padding: const EdgeInsets.only(right: 8),
                alignment: Alignment.centerRight,
                child: ElevatedButton(
                  style: ButtonStyle(
                    foregroundColor:
                        MaterialStateProperty.all<Color>(Colors.white),
                    backgroundColor:
                        MaterialStateProperty.all<Color>(Colors.blue),
                  ),
                  onPressed: () {
                    authService.updateProfile(
                        context: context,
                        bio: _bioTextController.text,
                        coverImagePath:
                            coverImage?.path == null ? null : coverImage!.path,
                        imagePath: image?.path == null ? null : image!.path,
                        name: _nameTextController.text,
                        username: _usernameTextController.text,
                        walletAddress: _walletAddressTextController.text);
                  },
                  child: const Text('Submit'),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
