import 'dart:developer' as dev;
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:foxxi/screens/profile_screen.dart';
import 'package:foxxi/services/user_service.dart';
import 'package:foxxi/widgets/follow_button.dart';
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
  bool isFollowed = false;
  UserService userService = UserService();
  void getUserData() async {
    if (user == null) {
      if (!widget.isMe) {
        user = await userService.getCurrentUserDatawithUsername(
            context: context, username: widget.username);
        setState(() {});
      }
    }
  }

  void isUserFollowed(String followingUserId) {
    // if (Provider.of<UserProvider>(context, listen: true)
    //         .user
    //         .following
    //         ?.length !=
    //     null) {
    //   dev.log('ran');
    //   for (var id in Provider.of<UserProvider>(context).user.following!) {
    //     if (id['id'] == followingUserId) {
    //       dev.log('ran');
    //       if (mounted) {
    //         setState(() {
    //           isFollowed = true;
    //         });
    //       }
    //       dev.log(isFollowed.toString(), name: 'isFollowed');
    //     }
    //   }
    // } else {
    //   dev.log('not ran');
    // }
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
          itemBuilder: (context, index) {
            isUserFollowed(userData?.followers[index]['id']);
            return GestureDetector(
              onTap: () {
                Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ProfileWidget(
                          isMe: widget.isMe,
                          username: userData?.followers[index]['username']),
                    ));
              },
              child: GestureDetector(
                onTap: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => ProfileWidget(
                            isMe: false,
                            username: userData?.followers[index]['username']),
                      ));
                },
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    SizedBox(
                      width: MediaQuery.of(context).size.width / 2,
                      child: ListTile(
                        leading: CircleAvatar(
                            backgroundImage: NetworkImage(
                                userData?.followers[index]['image'])),
                        title: Text(userData?.followers[index]['name']),
                        subtitle:
                            Text('@${userData?.followers[index]['username']}'),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: FollowButton(
                          function: () {},
                          backgroundColor: Colors.white,
                          borderColor: Colors.black,
                          text: isFollowed == false ? 'Follow' : "UnFollow",
                          textColor: Colors.black),
                    ),
                  ],
                ),
              ),
            );
          });
    } else {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }
  }
}
