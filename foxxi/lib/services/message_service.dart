import 'package:foxxi/http_error_handle.dart';
import 'package:http/http.dart' as http;
import 'package:foxxi/constants.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:developer' as dev;

final _storage = FlutterSecureStorage();

class MessageService {
  // void getMessages() async {
  //   try {
  //     http.Response res = await http.post(Uri.parse('$url/api/getmessages'),);
  //   } catch (e) {}
  // }

  void getAssociatedUsers() async {
    try {
      var jwt = await _storage.read(key: 'cookies');
      final foxxijwt = 'foxxi_jwt=$jwt;';
      dev.log(foxxijwt, name: "Reading JWT");
      final res = await http.get(Uri.parse('$url/api/users/currentuser'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'cookies': foxxijwt
          });

      httpErrorHandle(
          response: res,
          onSuccess: () {
            dev.log(res.body.toString(), name: 'Get associated User');
          });
    } catch (e) {}
  }
}
