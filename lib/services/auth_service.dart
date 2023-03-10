import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;
import 'package:foxxi/http_error_handle.dart';
import 'package:foxxi/screens/login_screen.dart';

import 'package:foxxi/providers/user_provider.dart';
import 'package:foxxi/utils.dart';
import 'package:foxxi/constants.dart';
import 'dart:developer' as dev;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:provider/provider.dart';

import '../components/entry_Point1.dart';

const _storage = FlutterSecureStorage();

class AuthService {
  void signUp({
    required BuildContext context,
    required String username,
    required String name,
    required String password,
    required String email,
  }) async {
    try {
      http.Response res = await http.post(Uri.parse('$url/api/users/signup'),
          body: jsonEncode({
            'email': email,
            'password': password,
            'username': username,
            'name': name
          }),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8'
          });
      // ignore: use_build_context_synchronously
      httpErrorHandle(
        response: res,
        context: context,
        onSuccess: () async {
          await _storage.write(
              key: "cookies", value: jsonDecode(res.body)['jwt'].toString());
          dev.log('cookies saved', name: 'JWT');
          // ignore: use_build_context_synchronously
          showSnackBar(
            context,
            'Account created!',
          );
          Navigator.pushNamed(context, BottomNavBar.routeName);
        },
      );
    } catch (e) {
      dev.log(e.toString(), name: "SignUpErrorCatch");
      showSnackBar(context, e.toString());
    }
  }

  void signIn({
    required BuildContext context,
    required String email,
    required String password,
  }) async {
    try {
      http.Response res = await http.post(
        Uri.parse('$url/api/users/signin'),
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );
      // ignore: use_build_context_synchronously
      httpErrorHandle(
        response: res,
        context: context,
        onSuccess: () async {
          // Provider.of<UserProvider>(context, listen: false).setUser(res.body);
          await _storage.write(
              key: "cookies", value: jsonDecode(res.body)['jwt'].toString());
          dev.log(res.body, name: 'login JWT');
          Navigator.pushNamed(context, BottomNavBar.routeName);
        },
      );
    } catch (e) {
      dev.log(e.toString(), name: "LoginInErrorCatch");
      showSnackBar(context, e.toString());
    }
  }

  void emailVerification({
    required BuildContext context,
    required String email,
  }) async {
    try {
      http.Response res = await http.post(
          Uri.parse('$url/api/verification/generate'),
          body: jsonEncode(
            {'email': email},
          ),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8'
          });

      // ignore: use_build_context_synchronously
      httpErrorHandle(
          response: res,
          context: context,
          onSuccess: () {
            showSnackBar(context, 'Verification Code Sent');
          });
    } catch (e) {
      dev.log(e.toString(), name: "Email Verification Error");
      showSnackBar(context, e.toString());
    }
  }

  Future<bool> verifyCodeSent({
    required BuildContext context,
    required String email,
    required String code,
  }) async {
    bool isVerified = false;
    try {
      http.Response res = await http.post(
          Uri.parse('$url/api/verification/compare'),
          body: jsonEncode(
            {'email': email, 'code': code},
          ),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8'
          });

      // ignore: use_build_context_synchronously
      httpErrorHandle(
          response: res,
          context: context,
          onSuccess: () {
            showSnackBar(context, 'OTP Verified');
            isVerified = true;
          });
    } catch (e) {
      dev.log(e.toString(), name: "OTP Verification");
      showSnackBar(context, e.toString());
    }
    return isVerified;
  }

  void resetPassword(
      {required BuildContext context,
      required String email,
      required String password}) async {
    try {
      http.Response res = await http.put(
          Uri.parse('$url/api/users/resetpassword'),
          body: jsonEncode({'email': email, 'password': password}),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8'
          });

      // ignore: use_build_context_synchronously
      httpErrorHandle(
          response: res,
          context: context,
          onSuccess: () async {
            showSnackBar(context, 'Password Reset Successfull ');
            await _storage.write(
                key: 'cookies', value: jsonDecode(res.body)['jwt'].toString());
          });
    } catch (e) {
      dev.log(e.toString(), name: "Reset Password Error Log");
      showSnackBar(context, e.toString());
    }
  }

  void getCurrentUser({
    required BuildContext context,
  }) async {
    try {
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      dev.log(foxxijwt, name: "Reading JWT");
      final res = await http.get(Uri.parse('$url/api/users/currentuser'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'cookies': foxxijwt
          });
      dev.log(jsonEncode(jsonDecode(res.body)['currentUser']),
          name: 'Current User Body');

      // ignore: use_build_context_synchronously
      httpErrorHandle(
          response: res,
          context: context,
          onSuccess: () {
            // Map<String, dynamic> userMap = jsonDecode(res.body)['currentUser'];
            dev.log(res.body.toString(), name: 'Current User Data');

            Provider.of<UserProvider>(context, listen: false)
                .setUser(res.body.toString());
          });
      // Map<String, dynamic>? userData = jsonDecode((res.body))['currentUser'];
      // final currentUser = jsonEncode(jsonDecode(res.body)['currentUser']);
      // dev.log(currentUser, name: 'Current User Bruh');
    } catch (e) {
      dev.log(e.toString(), name: 'Get Current User Error');
      showSnackBar(context, e.toString());
    }
  }

  void updateProfileImage(
      {required BuildContext context, required String image}) async {
    try {
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      dev.log(foxxijwt, name: "Reading JWT");
      final res = await http.put(Uri.parse('$url/api/users/imageupdate'),
          body: jsonEncode({'image': image}),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'cookies': foxxijwt
          });

      if (context.mounted) {
        httpErrorHandle(
            response: res,
            context: context,
            onSuccess: () {
              showSnackBar(context, 'Profile Pic Updated');
            });
      }
    } catch (e) {
      dev.log(e.toString(), name: 'AuthService: Update Profile Pic Error');
    }
  }

  void updateProfile(
      {required BuildContext context,
      String? imagePath,
      String? coverImagePath,
      String? username,
      String? name,
      String? bio,
      String? walletAddress}) async {
    try {
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      dev.log(foxxijwt, name: "Reading JWT");
      Map<String, String> header = {'cookies': foxxijwt};

      final request =
          http.MultipartRequest('POST', Uri.parse('$url/api/users/update'));
      request.headers.addAll(header);
      if (username != null) {
        request.fields['username'] = username;
      }
      if (name != null) {
        request.fields['username'] = name;
      }
      if (bio != null) {
        request.fields['username'] = bio;
      }
      if (walletAddress != null) {
        request.fields['username'] = walletAddress;
      }

      if (imagePath != null) {
        request.files.add(
          await http.MultipartFile.fromPath('image', imagePath),
        );
        if (coverImagePath != null) {
          request.files.add(
              await http.MultipartFile.fromPath('coverImage', coverImagePath));
        }
      }
      final res = await request.send();
      if (res.statusCode == 201) {
        dev.log('Story Created Successfully ', name: 'Story Create Status');
      }
      if (res.statusCode == 500) {
        dev.log('Story Upload Error', name: 'Story Create Error');
      }
    } catch (e) {
      dev.log(e.toString(), name: 'AuthService: Update Profile  Error');
    }
  }

  void updatePassword({
    required BuildContext context,
    required String oldPassword,
    required String newPassword,
  }) async {
    try {
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      dev.log(foxxijwt, name: "Reading JWT");
      final res = await http.put(Uri.parse('$url/api/users/updatepassword'),
          body: jsonEncode(
              {'oldPassword': oldPassword, 'newPassword': newPassword}),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'cookies': foxxijwt
          });

      if (context.mounted) {
        httpErrorHandle(
            response: res,
            context: context,
            onSuccess: () {
              showSnackBar(context, 'Password Updated ');
            });
      }
    } catch (e) {
      dev.log(e.toString(), name: 'Update Password Error');
      showSnackBar(context, e.toString());
    }
  }

  void signOut({required BuildContext context}) async {
    // more to dos
    try {
      await http.post(Uri.parse('$url/api/users/signout'));
      await _storage.delete(key: 'cookies');
      if (context.mounted) {
        Navigator.pushNamed(context, LoginScreen.routeName);
      }
    } catch (e) {
      dev.log(e.toString(), name: 'SIGN OUT');
    }
  }
}
