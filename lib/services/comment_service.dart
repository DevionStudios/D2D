import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:foxxi/http_error_handle.dart';
import 'package:foxxi/services/notification_service.dart';
import 'package:foxxi/utils.dart';
import 'package:http/http.dart' as http;
import 'dart:developer' as dev;

import '../constants.dart';

const _storage = FlutterSecureStorage();
NotificationService notificationService = NotificationService();

class CommentService {
  Future<int> addComment(
      {required BuildContext context,
      required String postId,
      required String caption}) async {
    int statusCode = 0;
    try {
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      dev.log(foxxijwt, name: "Reading JWT");
      http.Response res = await http.post(Uri.parse('$url/api/comments/create'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'cookies': foxxijwt
          },
          body: jsonEncode({'postId': postId, 'caption': caption}));
      if (context.mounted) {
        httpErrorHandle(
            context: context,
            response: res,
            onSuccess: () {
              statusCode = res.statusCode;
              showSnackBar(context, "Commment Added");
            });
      }
    } catch (e) {
      dev.log(e.toString(), name: 'CommentService : Create Comment Error');
    }
    return statusCode;
  }

  void deleteComment(
      {required BuildContext context, required String id}) async {
    try {
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      dev.log(foxxijwt, name: "Reading JWT");
      http.Response res = await http.delete(
        Uri.parse('$url/api/comments/delete/$id'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'cookies': foxxijwt
        },
      );
      if (context.mounted) {
        httpErrorHandle(
            context: context,
            response: res,
            onSuccess: () {
              showSnackBar(context, 'Comment Deleted ');
            });
      }
    } catch (e) {
      dev.log(e.toString(), name: 'CommentService : Delete Comment Error');
    }
  }

  void updateComment(
      {required BuildContext context,
      required String id,
      required String caption}) async {
    try {
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      dev.log(foxxijwt, name: "Reading JWT");
      http.Response res = await http.post(Uri.parse('$url/api/comments/update'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'cookies': foxxijwt
          },
          body: {
            'id': id,
            'caption': caption
          });
      if (context.mounted) {
        httpErrorHandle(
            context: context,
            response: res,
            onSuccess: () {
              showSnackBar(context, res.body.toString());
            });
      }
    } catch (e) {
      dev.log(e.toString(), name: 'CommentService : Update Comment Error');
    }
  }
}
