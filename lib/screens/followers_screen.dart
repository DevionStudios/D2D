import 'dart:developer' as dev;

import 'package:flutter/material.dart';
import 'package:foxxi/screens/profile_screen.dart';
import 'package:foxxi/services/user_service.dart';
import 'package:foxxi/utils.dart';
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

  UserService userService = UserService();
  List<bool> isFollowed = [];
  void getUserData() {
    userService
        .getCurrentUserDatawithUsername(
            context: context, username: widget.username)
        ?.then((value) {
      user = value;
      setBoollistLeng();
    });
    setState(() {});
  }

  void setBoollistLeng() {
    if (user?.followers?.length != null) {
      // ignore: unused_local_variable
      for (var i in user!.followers!) {
        isFollowed.add(false);
      }
      dev.log(isFollowed.toString());
    }
    updateBoolList();
  }

  void updateBoolList() {
    int index = 0;
    if (Provider.of<UserProvider>(context, listen: false).user.following !=
        null) {
      dev.log('Finding isFollowed');
      if (user?.followers != null) {
        for (var user in user!.followers!) {
          for (var users in Provider.of<UserProvider>(context, listen: false)
              .user
              .following!) {
            if (user['id'] == users['id']) {
              setState(() {
                isFollowed[index] = true;
              });
              dev.log('found');
              break;
            } else {
              setState(() {
                isFollowed[index] = false;
              });
            }
          }
          index++;
        }
      }
    }
    dev.log(isFollowed.toString());
  }

  @override
  void initState() {
    super.initState();
    getUserData();
  }

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context, listen: true).user;

    if (user?.followers != null) {
      dev.log(user!.followers.toString());
      return ListView.builder(
        itemCount: user?.followers?.length ?? 0,
        itemBuilder: (context, index) => GestureDetector(
          onTap: () {
            Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ProfileWidget(
                      isMe: false,
                      username: user?.followers![index]['username']),
                ));
          },
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              SizedBox(
                width: MediaQuery.of(context).size.width - 100,
                child: ListTile(
                  leading: CircleAvatar(
                      backgroundImage:
                          NetworkImage(user?.followers![index]['image'])),
                  title: Text(user?.followers![index]['name']),
                  subtitle: Text('@${user?.followers![index]['username']}'),
                ),
              ),
              FollowButton(
                  isFollowed: isFollowed[index],
                  backgroundColor: Colors.white,
                  borderColor: Colors.white,
                  textColor: Colors.black,
                  function: () {
                    userService
                        .followUser(
                            context: context,
                            username: user!.followers![index]['username'])
                        .then((value) {
                      if (value == 201) {
                        setState(() {
                          isFollowed[index] = true;
                        });
                      }

                      if (value == 200) {
                        setState(() {
                          isFollowed[index] = false;
                        });

                        userService.getCurrentUserData(
                            context: context, id: userProvider.id);
                      }
                    });
                  }),
            ],
          ),
        ),
      );
    } else {
      return const Center(
        child: CustomLoader(),
      );
    }
  }
}
