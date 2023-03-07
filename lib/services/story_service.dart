import 'dart:developer' as dev;
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:foxxi/providers/story_provider.dart';
import 'package:http/http.dart' as http;
import 'package:foxxi/constants.dart';
import 'dart:convert';
import 'package:foxxi/http_error_handle.dart';
import 'package:provider/provider.dart';

import '../models/story.dart';

class StoryService {
  final _storage = const FlutterSecureStorage();
  void createStories() {}
  void getFollowingUserStories({required BuildContext context}) async {
    try {
      List<Story>? storyList = [];
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      dev.log(foxxijwt, name: "Reading JWT");
      http.Response res = await http.get(Uri.parse('$url/api/story/getstories'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'cookies': foxxijwt
          });
      dev.log(res.body.toString(), name: 'Story data');

      httpErrorHandle(
          response: res,
          onSuccess: () {
            final data = jsonDecode(res.body);

            for (var stories in data) {
              storyList.add(
                Story.fromJson(
                  jsonEncode(stories),
                ),
              );
            }
          });
    } catch (e) {
      dev.log(e.toString(), name: 'StoryService - Get Following User Error');
    }
  }
}
