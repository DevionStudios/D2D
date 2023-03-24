import 'dart:convert';
import 'dart:developer' as dev;
import 'package:foxxi/http_error_handle.dart';
import 'package:foxxi/models/user.dart';
import 'package:foxxi/providers/user_provider.dart';
import 'package:foxxi/utils.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:foxxi/constants.dart';
import 'package:provider/provider.dart';

const _storage = FlutterSecureStorage();

class UserService {
  void getCurrentUserData(
      {required BuildContext context, required String id}) async {
    try {
      http.Response res = await http.get(
          Uri.parse('$url/api/users/otheruser/id/$id'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
          });
      dev.log(res.body.toString(), name: 'UserDAta');

      if (context.mounted) {
        httpErrorHandle(
            response: res,
            context: context,
            onSuccess: () {
              Provider.of<UserProvider>(context, listen: false)
                  .setUser(res.body);
            });
      }
    } catch (e) {
      dev.log(e.toString(), name: 'GetUserDataError');
    }
  }

  Future<User> getCurrentUserDatawithUsername(
      {required BuildContext context, required String username}) async {
    dynamic user;
    try {
      http.Response res = await http.get(
          Uri.parse('$url/api/users/otheruser/$username'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
          });
      dev.log(res.body.toString(), name: 'UserDAta by using username');
      dev.log(username, name: 'UserService = username');
      if (context.mounted) {
        httpErrorHandle(
            response: res,
            context: context,
            onSuccess: () {
              user = User.fromJson(res.body);
            });
      }
    } catch (e) {
      dev.log(e.toString(), name: 'GetUserDataError - username');
    }
    return user;
  }

  Future<int> followUser(
      {required BuildContext context, required String username}) async {
    int statusCode = 0;
    try {
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      dev.log(foxxijwt, name: "Reading JWT");
      final res = await http.put(Uri.parse('$url/api/follow/users'),
          body: jsonEncode({'username': username}),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'cookies': foxxijwt
          });

      if (context.mounted) {
        httpErrorHandle(
            response: res,
            context: context,
            onSuccess: () {
              statusCode = res.statusCode;
            });
      }
    } catch (e) {
      dev.log(e.toString(), name: 'UserService: UserFollow Error');
    }
    return statusCode;
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
      dev.log(e.toString(), name: 'UserService: Update Profile Pic Error');
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
          http.MultipartRequest('PUT', Uri.parse('$url/api/users/update'));
      request.headers.addAll(header);
      if (username != null) {
        request.fields['username'] = username;
      }
      if (name != null) {
        request.fields['username'] = name;
      }
      if (bio != null) {
        dev.log('Bio Update', name: 'Profile Update: Request');

        request.fields['username'] = bio;
      }
      if (walletAddress != null) {
        request.fields['username'] = walletAddress;
      }

      if (imagePath != null) {
        dev.log('Image Update', name: 'Profile Update: Request');
        request.files.add(
          await http.MultipartFile.fromPath('image', imagePath),
        );
        if (coverImagePath != null) {
          request.files.add(
              await http.MultipartFile.fromPath('coverImage', coverImagePath));
        }
      }
      final res = await request.send();

      dev.log(res.toString(), name: 'Profile Update');
      if (res.statusCode == 201) {
        dev.log('Profile Updated ', name: 'Profile Status');
        if (context.mounted) {
          showSnackBar(context, 'Profile Updated');
        }
      }
      if (res.statusCode == 500) {
        dev.log('Profile Update Error', name: 'Profile Update Error');
      }
    } catch (e) {
      dev.log(e.toString(), name: 'UserService: Update Profile  Error');
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
}
