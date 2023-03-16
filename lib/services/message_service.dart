import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:foxxi/http_error_handle.dart';
import 'package:foxxi/models/chat_model.dart';
import 'package:foxxi/models/user.dart';
import 'package:http/http.dart' as http;
import 'package:foxxi/constants.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:developer' as dev;

const _storage = FlutterSecureStorage();

class MessageService {
  // void getMessages() async {
  //   try {
  //     http.Response res = await http.post(Uri.parse('$url/api/getmessages'),);
  //   } catch (e) {}
  // }

  Future<List<User>> getAssociatedUsers({required BuildContext context}) async {
    List<User> associatedUserList = [];
    try {
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      dev.log(foxxijwt, name: "Reading JWT");
      final res = await http.get(Uri.parse('$url/api/messages/users'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'cookies': foxxijwt
          });

      if (context.mounted) {
        httpErrorHandle(
            context: context,
            response: res,
            onSuccess: () {
              dev.log(res.body.toString(), name: 'Get associated User');
              final data = jsonDecode(res.body);
              for (var users in data) {
                associatedUserList.add(User.fromJson(jsonEncode(users)));
              }
            });
      }
    } catch (e) {
      dev.log(e.toString(),
          name: 'Message Service : Get Associated Users Error');
    }
    return associatedUserList;
  }

  Future<List<ChatModel>?> getAllMessages({
    required BuildContext context,
    required String from,
    required String to,
  }) async {
    List<ChatModel> messageList = [];
    try {
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      http.Response res = await http.post(Uri.parse('$url/api/getmessages'),
          body: jsonEncode({'from': from, 'to': to}),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'cookies': foxxijwt
          });

      if (context.mounted) {
        httpErrorHandle(
            context: context,
            response: res,
            onSuccess: () {
              dev.log(res.body.toString(), name: 'Messages');
              final data = jsonDecode(res.body);
              if (data != null) {
                for (var message in data) {
                  messageList.add(ChatModel.fromJson(jsonEncode(message)));
                }
              }
            });
      }
    } catch (e) {
      dev.log(e.toString(), name: 'Message Service : Get Messages Error');
    }
    return messageList;
  }

  void addMessage(
      {required String text,
      required String from,
      required String to,
      required BuildContext context}) async {
    try {
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      dev.log(foxxijwt, name: "Reading JWT");
      final res = await http.post(Uri.parse('$url/api/addmessage'),
          body: jsonEncode({'text': text, 'from': from, 'to': to}),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'cookies': foxxijwt
          });

      if (context.mounted) {
        httpErrorHandle(
            context: context,
            response: res,
            onSuccess: () {
              dev.log('message sent');
            });
      }
    } catch (e) {
      dev.log(e.toString(), name: 'Message Service : Add Message Error');
    }
  }
}
