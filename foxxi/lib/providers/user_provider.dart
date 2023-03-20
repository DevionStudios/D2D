import 'dart:convert';
import 'dart:developer' as dev;

import 'package:flutter/material.dart';
import 'package:foxxi/models/user.dart';

class UserProvider with ChangeNotifier {
  User _user = User(
      id: '',
      email: '',
      username: '',
      name: '',
      password: '',
      walletAddress: '',
      hasClaimed: false,
      image: '',
      coverImage: '',
      bio: '',
      followers: [],
      following: [],
      hashtagsfollowed: [],
      posts: [],
      twitterUsername: '',
      accountWallet: '',
      reports: [],
      preferences: [],
      isBanned: false);

  User get user => _user;

  void setUser(String user) {
    final currentUser = jsonDecode(user)["currentUser"];

    _user = User.fromJson((jsonEncode(currentUser)));
    // dev.log(_user.toString(), name: '_user data');
    // dev.log(_user.followers.toString(), name: '_user ');
    notifyListeners();
  }

  void setUserFromModel(User user) {
    _user = user;
    notifyListeners();
  }
}
