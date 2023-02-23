import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:foxxi/http_error_handle.dart';
import 'package:foxxi/models/comments.dart';
import 'package:foxxi/models/feed_post_model.dart';
import 'package:foxxi/providers/post_provider.dart';
import 'package:foxxi/utils.dart';
import 'package:foxxi/constants.dart';
import 'package:http/http.dart' as http;
import 'dart:developer' as dev;

import 'package:provider/provider.dart';

const _storage = FlutterSecureStorage();

class PostService {
  Future<List<FeedPostModel>> getAllPost(
      {required BuildContext context}) async {
    List<FeedPostModel> list = [];
    try {
      http.Response res = await http.get(
        Uri.parse('$url/api/posts'),
      );

      // ignore: use_build_context_synchronously
      httpErrorHandle(
          response: res,
          context: context,
          onSuccess: () {
            dev.log(res.body.toString(), name: 'Post Res Body');

            final data = jsonDecode(res.body);
            for (int i = 0; i < data.length; i++) {
              list.add(FeedPostModel.fromJson(jsonEncode(data[i])));
            }
            // list = (data as List)
            //     .map((i) => FeedPostModel.fromJson(i.toString()))
            //     .toList();
          });
    } catch (e) {
      dev.log(e.toString(), name: 'Get All Post Error');
      showSnackBar(context, e.toString());
    }
    return list;
  }

  Future<List<Comment>> getCommentByPostId(
      {required BuildContext context, required String id}) async {
    List<Comment> comments = [];
    try {
      http.Response res = await http.get(
        Uri.parse('$url/api/post/$id'),
      );

      // ignore: use_build_context_synchronously
      httpErrorHandle(
          response: res,
          context: context,
          onSuccess: () {
            // dev.log(res.body.toString(), name: 'Get Post By Id Body');
            final data = jsonDecode(res.body)['comments'];
            for (int i = 0; i < data.length; i++) {
              comments.add(Comment.fromJson(jsonEncode(data[i])));
            }
          });
    } catch (e) {
      dev.log(e.toString(), name: 'Post By Id Error');
      showSnackBar(context, e.toString());
    }
    return comments;
  }

  void getTrendingPosts({required BuildContext context}) async {
    List<FeedPostModel> list = [];
    try {
      http.Response res = await http.get(
        Uri.parse('$url/api/posts/trending'),
      );

      // ignore: use_build_context_synchronously
      httpErrorHandle(
          response: res,
          context: context,
          onSuccess: () {
            final data = jsonDecode(res.body);
            for (int i = 0; i < data.length; i++) {
              list.add(FeedPostModel.fromJson(jsonEncode(data[i])));
            }
          });

      Provider.of<PostProvider>(context, listen: false)
          .setTrendingPostsList(list);
    } catch (e) {
      dev.log(e.toString(), name: 'Get All Post Error');
      showSnackBar(context, e.toString());
    }
  }

  void getUserFeed() async {
    try {
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      dev.log(foxxijwt, name: "Reading JWT");
      http.Response res = await http.get(
          Uri.parse('$url/api/users/currentuser'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'cookies': foxxijwt
          });

      httpErrorHandle(
          response: res,
          onSuccess: () {
            dev.log(res.body.toString(), name: 'User Feed data');
          });
    } catch (e) {
      dev.log(e.toString(), name: 'PostService - Get UserFeed Error');
    }
  }

  Future<List<FeedPostModel>> getPostByPreference() async {
    List<FeedPostModel> preferencePostList = [];
    try {
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      dev.log(foxxijwt, name: "Reading JWT");
      http.Response res = await http.post(Uri.parse('$url/api/post/preference'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'cookies': foxxijwt
          });

      httpErrorHandle(
          response: res,
          onSuccess: () {
            final data = jsonDecode(res.body);
            preferencePostList =
                (data as List).map((i) => FeedPostModel.fromJson(i)).toList();
          });
    } catch (e) {
      dev.log(e.toString(),
          name: 'Post Service : Get Post By Preference Error');
    }
    return preferencePostList;
  }

  void searchPost({
    required String searchWord,
  }) async {
    try {
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      dev.log(foxxijwt, name: "Reading JWT");
      http.Response res = await http.get(
          Uri.parse('$url/api/post/search/$searchWord'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'cookies': foxxijwt
          });
      httpErrorHandle(
          response: res,
          onSuccess: () {
            dev.log(res.body.toString(), name: 'Post Search Log');
          });
    } catch (e) {
      dev.log(e.toString(), name: 'Post Service : Search Post Error');
    }
  }

  void createPost({
    required String caption,
    String? filePath,
  }) async {
    try {
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      dev.log(foxxijwt, name: "Reading JWT");
      Map<String, String> header = <String, String>{'cookies': foxxijwt};
      // http.Response res = await http.post(Uri.parse('$url/posts/create'),
      //     body: {},
      //     headers: <String, String>{
      //       'Content-Type': 'application/json; charset=UTF-8',
      //       'cookies': foxxijwt
      //     });
      final request =
          http.MultipartRequest('POST', Uri.parse('$url/posts/create'));
      request.headers.addAll(header);
      request.files
          .add(await http.MultipartFile.fromPath('media', filePath.toString()));
      request.send().then((response) {
        if (response.statusCode == 201) print("Uploaded!");
        if (response.statusCode == 500) print('Error Post Upload');
      });
    } catch (e) {
      dev.log(e.toString(), name: 'Post Service : Create Post Error');
    }
  }

  void deletePost({
    required String id,
  }) async {
    try {
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      dev.log(foxxijwt, name: "Reading JWT");
      http.Response res = await http.delete(Uri.parse('$url/posts/delete/$id'),
          body: {
            'id': id
          },
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'cookies': foxxijwt
          });
    } catch (e) {
      dev.log(e.toString(), name: 'Post Service : Delete Post Error');
    }
  }

  void reportPost({
    required String id,
  }) async {
    try {
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      dev.log(foxxijwt, name: "Reading JWT");
      http.Response res = await http.put(Uri.parse('$url/posts/report'), body: {
        'postId': id
      }, headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'cookies': foxxijwt
      });
    } catch (e) {
      dev.log(e.toString(), name: 'Post Service : Report Post Error');
    }
  }

  void updatePost({
    required BuildContext context,
    required String id,
    String? caption,
    String? hashtags,
  }) async {
    try {
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      dev.log(foxxijwt, name: "Reading JWT");
      http.Response res =
          await http.put(Uri.parse('$url/posts/edit/$id'), body: {
        'caption': caption ?? '',
        'hashtags': hashtags ?? '',
      }, headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'cookies': foxxijwt
      });

      // ignore: use_build_context_synchronously
      httpErrorHandle(
          response: res,
          context: context,
          onSuccess: () {
            showSnackBar(context, 'Post Updated Succesfully');
          });
    } catch (e) {
      dev.log(e.toString(), name: 'Post Service : Update Post Error');
    }
  }

  void importUserTweets() async {
    try {
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      dev.log(foxxijwt, name: "Reading JWT");
      http.Response res = await http.post(Uri.parse('$url/api/tweets'),
          body: {},
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'cookies': foxxijwt
          });
      httpErrorHandle(response: res, onSuccess: () {});
    } catch (e) {
      dev.log(e.toString(), name: 'Post Service : Import User Tweets Error');
    }
  }
}
