import 'dart:async';
import 'dart:ui';

import 'package:badges/badges.dart' as badges;
import 'package:flutter/material.dart';
import 'package:foxxi/components/donateButton.dart';
import 'package:foxxi/services/notification_service.dart';
import 'package:foxxi/utils.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
import 'package:provider/provider.dart';
import 'dart:developer' as dev;
import 'package:foxxi/models/feed_post_model.dart';
import 'package:foxxi/providers/theme_provider.dart';
import 'package:foxxi/providers/user_provider.dart';
import 'package:foxxi/screens/chat.dart';
import 'package:foxxi/services/post_service.dart';
import 'package:foxxi/widgets/add_comment.dart';

class PostLikeCommentBar extends StatefulWidget {
  final FeedPostModel post;

  const PostLikeCommentBar({
    Key? key,
    required this.post,
  }) : super(key: key);

  @override
  State<PostLikeCommentBar> createState() => _PostLikeCommentBarState();
}

class _PostLikeCommentBarState extends State<PostLikeCommentBar> {
  final PostService postService = PostService();

  final NotificationService notificationService = NotificationService();
  bool isLiked = false;
  int? likes;
  @override
  void initState() {
    super.initState();
    isPostLikedByUser();
    setLikes();
  }

  // void getlikes() {
  //   postService.getPostById(context: context, id: widget.post.id).then((value) {
  //     setState(() {
  //       if (value?.likes?.length != null) {
  //         likes = value!.likes!.length;
  //       }
  //     });
  //   });
  // }

  void isPostLikedByUser() {
    dev.log('isPostLiked ran');
    if (widget.post.likes != null) {
      if (widget.post.likes!.contains(
          Provider.of<UserProvider>(context, listen: false).user.id)) {
        setState(() {
          isLiked = true;
        });
        dev.log(isLiked.toString(), name: 'IsPostLiked');
      } else {
        setState(() {
          isLiked = false;
        });
      }
    }
  }

  void setLikes() {
    likes = widget.post.likes?.length ?? 0;
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context, listen: true).isDarkMode;
    final userProvider = Provider.of<UserProvider>(context, listen: true).user;
    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        ClipRRect(
          borderRadius: const BorderRadius.only(
              bottomLeft: Radius.circular(30),
              bottomRight: Radius.circular(30)),
          child: BackdropFilter(
            filter: ImageFilter.blur(
              sigmaX: 3,
              sigmaY: 3,
            ),
            child: Container(
              width: MediaQuery.of(context).size.width - 20,
              height: 50,
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(30),
                    bottomRight: Radius.circular(30)),
                gradient: LinearGradient(
                  colors: [
                    Colors.lightBlue.shade100.withOpacity(0.4),
                    Colors.purpleAccent.shade100.withOpacity(0.4),
                  ],
                  stops: const [0, 1],
                  begin: const AlignmentDirectional(1, 0),
                  end: const AlignmentDirectional(-1, 0),
                  // color: Colors.purpleAccent.shade100.withOpacity(
                  // 0.3,
                ),
              ),
              child: Row(
                // mainAxisAlignment: MainAxisAlignment.end,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: <Widget>[
                  IconButton(
                    icon: badges.Badge(
                      badgeAnimation: const badges.BadgeAnimation.size(),
                      badgeStyle: const badges.BadgeStyle(
                          badgeColor: Color.fromARGB(255, 244, 179, 254)),
                      badgeContent: widget.post.likes?.length == null
                          ? const Text('0')
                          : Text(likes.toString()),
                      child: Icon(
                        Icons.favorite_rounded,
                        size: 30,
                        color: isLiked
                            ? Colors.red
                            : const Color.fromARGB(255, 244, 204, 250)
                                .withOpacity(0.7),
                      ),
                    ),
                    onPressed: () {
                      if (userProvider.id != widget.post.author.id) {
                        postService
                            .likePost(
                                context: context, id: widget.post.id.toString())
                            .then((value) {
                          setState(() {
                            if (isLiked) {
                              isLiked = false;
                              likes = likes! - 1;
                            } else {
                              isLiked = true;
                              if (likes == 0) {
                                likes = 1;
                              }
                            }
                          });
                        });
                      } else {
                        showSnackBar(context, 'You Cannot like your own post');
                      }
                    },
                  ),
                  IconButton(
                    icon: badges.Badge(
                      badgeStyle: const badges.BadgeStyle(
                          badgeColor: Color.fromARGB(255, 244, 179, 254)),
                      badgeContent: widget.post.comments?.length == null
                          ? const Text('0')
                          : Text(widget.post.comments!.length.toString()),
                      child: Icon(Icons.comment_rounded,
                          color: const Color.fromARGB(255, 244, 204, 250)
                              .withOpacity(0.7),
                          size: 30),
                    ),
                    onPressed: () {
                      showMaterialModalBottomSheet<void>(
                        shape: const RoundedRectangleBorder(
                            borderRadius: BorderRadius.vertical(
                                top: Radius.circular(25))),
                        context: context,
                        builder: (context) => Padding(
                          padding: EdgeInsets.only(
                              bottom: MediaQuery.of(context).viewInsets.bottom),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Padding(
                                padding: const EdgeInsets.all(8.0),
                                child: Text('Reply',
                                    style: TextStyle(
                                        color: isDark
                                            ? Colors.grey.shade400
                                            : Colors.black,
                                        fontFamily: 'InstagramSans',
                                        fontSize: 25,
                                        fontWeight: FontWeight.bold)),
                              ),
                              Row(
                                children: [
                                  Padding(
                                    padding: const EdgeInsets.all(8),
                                    child: CircleAvatar(
                                      radius: 16,
                                      backgroundImage: NetworkImage(
                                          widget.post.author.image.toString()),
                                    ),
                                  ),
                                  Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Padding(
                                            padding:
                                                const EdgeInsets.only(left: 8),
                                            child: Text(
                                              widget.post.author.name
                                                  .toString(),
                                              style: TextStyle(
                                                color: isDark
                                                    ? Colors.grey.shade200
                                                    : Colors.black,
                                              ),
                                            ),
                                          ),
                                          Padding(
                                            padding: const EdgeInsets.only(
                                                left: 4.0),
                                            child: Text(
                                              '@${widget.post.author.username}',
                                              style: TextStyle(
                                                color: isDark
                                                    ? Colors.grey.shade600
                                                    : Colors.black,
                                              ),
                                            ),
                                          )
                                        ],
                                      ),
                                      const Padding(
                                        padding: EdgeInsets.only(
                                          left: 8,
                                        ),
                                        // child: Text(
                                        //  ,
                                        //   style: TextStyle(
                                        //     color: Colors.grey,
                                        //   ),
                                        // ),
                                      )
                                    ],
                                  )
                                ],
                              ),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.start,
                                children: const [
                                  Padding(
                                    padding: EdgeInsets.only(left: 8.0),
                                    child: Text('Your Reply'),
                                  ),
                                ],
                              ),
                              AddCommentWidget(
                                postUserId: widget.post.author.id,
                                postId: widget.post.id,
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                  widget.post.author.id != userProvider.id
                      ? IconButton(
                          icon: Icon(
                            Icons.send_rounded,
                            color: const Color.fromARGB(255, 244, 204, 250)
                                .withOpacity(0.7),
                            size: 30,
                          ),
                          onPressed: () {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => OneOneChatScreen(
                                      senderId: widget.post.author.id,
                                      senderName:
                                          widget.post.author.name.toString(),
                                      senderUsername:
                                          widget.post.author.id.toString(),
                                      senderImage:
                                          widget.post.author.image.toString()),
                                ));
                          })
                      : const SizedBox(),
                  DonateButton(post: widget.post),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
