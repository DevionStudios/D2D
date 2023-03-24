import 'dart:developer' as dev;

import 'package:flutter/material.dart';
import 'package:foxxi/screens/profile_screen.dart';
import 'package:foxxi/services/user_service.dart';
import 'package:provider/provider.dart';

import 'package:foxxi/models/user.dart';
import 'package:foxxi/providers/user_provider.dart';

class FollowerScreen extends StatefulWidget {
  final String username;
  final bool isMe;
  const FollowerScreen({
    Key? key,
    required this.username,
    required this.isMe,
  }) : super(key: key);

  @override
  State<FollowerScreen> createState() => _FollowerScreenState();
}

class _FollowerScreenState extends State<FollowerScreen> {
  User? user;
  var userData;
  UserService userService = UserService();
  void getUserData() async {
    if (!widget.isMe) {
      user = await userService.getCurrentUserDatawithUsername(
          context: context, username: widget.username);
      setState(() {});
    }
  }

  @override
  void initState() {
    super.initState();
    getUserData();
  }

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context, listen: true).user;

    if (widget.isMe) {
      setState(() {
        userData = userProvider;
      });
    } else {
      setState(() {
        userData = user;
      });
    }
    if (userData?.followers != null) {
      dev.log(userData.followers.toString());
      return ListView.builder(
        itemCount: userData?.followers?.length ?? 0,
        itemBuilder: (context, index) => GestureDetector(
          onTap: () {
            Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ProfileWidget(
                      isMe: widget.isMe,
                      user: User.fromMap(userData?.followers[index])),
                ));
          },
          child: ListTile(
            leading: CircleAvatar(
                backgroundImage:
                    NetworkImage(userData?.followers[index]['image'])),
            title: Text(userData?.followers[index]['name']),
            subtitle: Text(userData?.followers[index]['username']),
          ),
        ),
      );
    } else {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }
  }
}
