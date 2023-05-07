import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:foxxi/widgets/add_comment.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
import 'package:provider/provider.dart';
import 'dart:developer' as dev;
import 'package:foxxi/models/comments.dart';
import 'package:foxxi/models/feed_post_model.dart';
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
  List<Comment> comments = [];
  CommentService commentService = CommentService();

  @override
  void initState() {
    getReplies();
    super.initState();
  }

  void getReplies() {
    replies = [];
    commentService
        .getCommentByPostId(context: context, id: widget.post.id)
        .then((value) {
      comments = value;

      for (var comment in comments) {
        if (comment.parentId == widget.comment.id) {
          replies.add(comment);
        }
      }
      setState(() {});
    });
  }

  @override
  Widget build(BuildContext context) {
    // final parentCommentList =
    //     Provider.of<CommentProvider>(context, listen: true).commentList;
    final isDark = Provider.of<ThemeProvider>(context, listen: true).isDarkMode;

    final userProvider = Provider.of<UserProvider>(context, listen: true);

    List<String> captionElements = widget.comment.caption.split(' ');

    return Scaffold(
      appBar: AppBar(leading: Padding(
          padding: const EdgeInsets.all(8.0),
          child: CircleAvatar(
            
            backgroundColor:
                Colors.purpleAccent.shade100.withOpacity(0.4),
            child: IconButton(
              // iconSize: 20,
              icon: const Icon(
                Icons.arrow_back_ios_new_rounded,
                color: Colors.white,
                // size: 15,
              ),
              onPressed: () {
                Navigator.pop(context);
              },
            ),

          ),

        ),
        backgroundColor: isDark?Colors.black:Colors.white,),
        body: SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [

          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ProfileWidget(
                              isMe: widget.comment.id == userProvider.user.id
                                  ? true
                                  : false,
                              username: widget.comment.author.username),
                        ));
                  },
                  child: Row(
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
                                  color: isDark
                                      ? Colors.grey.shade500
                                      : Colors.grey,
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
                ),
              ],
            ),
          ),
          const SizedBox(
            height: 10,
          ),
          Padding(
            padding: const EdgeInsets.only(top: 5, right: 5, left: 5),
            child: Text.rich(TextSpan(
                text: null,
                children: captionElements.map((w) {
                  return w.startsWith('@') && w.length > 1
                      ? TextSpan(
                          text: ' ${w.replaceAll(':', '')}',
                          style:
                              const TextStyle(color: Colors.blue, fontSize: 20),
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
                                      username:
                                          w.replaceAll(RegExp('[@:]'), '')),
                                ),
                              );
                            },
                        )
                      : TextSpan(
                          text: ' $w',
                          style: TextStyle(
                              color: isDark ? Colors.white : Colors.black,
                              fontSize: 20));
                }).toList())),
          ),
          GestureDetector(
            onTap: () {
              showMaterialModalBottomSheet<void>(
                shape: const RoundedRectangleBorder(
                    borderRadius:
                        BorderRadius.vertical(top: Radius.circular(25))),
                context: context,
                builder: (context) => Padding(
                    padding: EdgeInsets.only(
                        bottom: MediaQuery.of(context).viewInsets.bottom),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Text('Comment Reply',
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
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Padding(
                                      padding: const EdgeInsets.only(left: 8),
                                      child: Text(
                                        widget.post.author.name.toString(),
                                        style: TextStyle(
                                          color: isDark
                                              ? Colors.grey.shade200
                                              : Colors.black,
                                        ),
                                      ),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.only(left: 4.0),
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
                          notifyComments: getReplies,
                          isAddCommentReply: true,
                          postId: widget.post.id,
                          commentId: widget.comment.id,
                        ),
                      ],
                    ),
                  ),
                );
            },
            child: const Padding(
              padding: EdgeInsets.all(10.0),
              child: Text(
                'Reply',
                style: TextStyle(color: Colors.grey, fontSize: 12),
              ),
            ),
          ),
          Divider(
            thickness: 5,
            indent: MediaQuery.of(context).size.width / 20,
            endIndent: MediaQuery.of(context).size.width / 20,
          ),
          replies.isNotEmpty
              ? const SizedBox()
              : const Center(
                  child: Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Text(
                      'No Replies ',
                      style: TextStyle(color: Colors.grey, fontSize: 20),
                    ),
                  ),
                ),
          ListView.builder(
            physics: const ScrollPhysics(),
            reverse: true,
            shrinkWrap: true,
            itemCount: replies.length,
            itemBuilder: (context, index) {
              return CommentCard(
                notifyComment: getReplies,
                comment: replies[index],
                post: widget.post,
              );
            },
          )
        ],
      ),
    ));
  }
}
