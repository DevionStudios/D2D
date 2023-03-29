import 'package:flutter/material.dart';
import 'package:foxxi/screens/followers_screen.dart';
import 'package:foxxi/screens/following_screen.dart';
import 'package:foxxi/services/user_service.dart';

class FollowerFollowingScreen extends StatefulWidget {
  final String username;

  final bool isMe;
  const FollowerFollowingScreen(
      {super.key, required this.isMe, required this.username});
  @override
  State<FollowerFollowingScreen> createState() =>
      _FollowerFollowingScreenState();
}

class _FollowerFollowingScreenState extends State<FollowerFollowingScreen> {
  final controller = PageController(
    initialPage: 0,
  );
  UserService userService = UserService();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          elevation: 0,
        ),
        body: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(
              height: 20,
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: const [Text('Followers'), Text('Following')],
            ),
            Expanded(
              child: PageView(
                controller: controller,
                pageSnapping: true,
                scrollDirection: Axis.horizontal,
                children: <Widget>[
                  FollowerScreen(
                    isMe: widget.isMe,
                    username: widget.username,
                  ),
                  FollowingScreen(username: widget.username, isMe: widget.isMe)
                ],
              ),
            ),
          ],
        ));
  }
}
