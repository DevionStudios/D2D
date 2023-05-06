import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:foxxi/models/comments.dart';
import 'package:foxxi/models/feed_post_model.dart';
import 'package:foxxi/providers/comment_provider.dart';
import 'package:foxxi/providers/theme_provider.dart';
import 'package:foxxi/providers/user_provider.dart';
import 'package:foxxi/screens/profile_screen.dart';
import 'package:foxxi/services/comment_service.dart';
import 'package:foxxi/widgets/comment_card.dart';

class CommentScreen extends StatefulWidget {
  Comment comment;
  FeedPostModel post;
  CommentScreen({
    Key? key,
    required this.comment,
    required this.post,
  }) : super(key: key);

  @override
  State<CommentScreen> createState() => _CommentScreenState();
}

class _CommentScreenState extends State<CommentScreen> {
  List<Comment> replies = [];

  @override
  void initState() {
    getReplies();
    super.initState();
  }

  void getReplies() {
    for (var comment
        in Provider.of<CommentProvider>(context, listen: false).commentList) {
      if (comment.parentId == widget.comment.id) {
        replies.add(comment);
      }
    }
  }

  Widget build(BuildContext context) {
    final parentCommentList =
        Provider.of<CommentProvider>(context, listen: true).commentList;
    final isDark = Provider.of<ThemeProvider>(context, listen: true).isDarkMode;

    final userProvider = Provider.of<UserProvider>(context, listen: true);

    List<String> captionElements = widget.comment.caption.split(' ');

    return Scaffold(
        body: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: MediaQuery.of(context).size.height / 20,
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  CircleAvatar(
                    backgroundImage: NetworkImage(
                      widget.comment.author.image.toString(),
                    ),
                    radius: 18,
                  ),
                  Padding(
                    padding: const EdgeInsets.only(left: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(widget.comment.author.name.toString(),
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: isDark ? Colors.white : Colors.black87,
                            )),
                        Padding(
                          padding: const EdgeInsets.only(top: 4),
                          child: Text(
                            // DateFormat.yMMMd().format(
                            //   snap.data()['datePublished'].toDate(),
                            '@${widget.comment.author.username.toString()}',
                            style: TextStyle(
                              color:
                                  isDark ? Colors.grey.shade500 : Colors.grey,
                              fontSize: 12,
                              fontWeight: FontWeight.w400,
                            ),
                          ),
                        )
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        SizedBox(
          height: 10,
        ),
        Padding(
          padding: const EdgeInsets.only(top: 5, right: 5, left: 5, bottom: 5),
          child: Text.rich(TextSpan(
              text: null,
              children: captionElements.map((w) {
                return w.startsWith('@') && w.length > 1
                    ? TextSpan(
                        text: ' ${w.replaceAll(':', '')}',
                        style: const TextStyle(color: Colors.blue),
                        recognizer: TapGestureRecognizer()
                          ..onTap = () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => ProfileWidget(
                                    isMe: w.replaceAll(RegExp('@:'), '') ==
                                            userProvider.user.username
                                        ? true
                                        : false,
                                    username: w.replaceAll(RegExp('[@:]'), '')),
                              ),
                            );
                          },
                      )
                    : TextSpan(
                        text: ' $w',
                        style: TextStyle(
                            color: isDark ? Colors.white : Colors.black));
              }).toList())),
        ),
        Divider(
          thickness: 5,
          indent: MediaQuery.of(context).size.width / 20,
          endIndent: MediaQuery.of(context).size.width / 20,
        ),
        Expanded(
          child: ListView.builder(
            shrinkWrap: true,
            itemCount: replies.length,
            itemBuilder: (context, index) {
              return CommentCard(
                comment: replies[index],
                post: widget.post,
              );
            },
          ),
        )
      ],
    ));
  }
}
