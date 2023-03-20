import 'package:flutter/material.dart';
import 'package:foxxi/models/comments.dart';
import 'package:foxxi/providers/user_provider.dart';
import 'package:foxxi/services/comment_service.dart';
import 'package:foxxi/services/post_service.dart';
import 'package:provider/provider.dart';
import 'dart:developer' as dev;
import '../models/feed_post_model.dart';
import '../providers/theme_provider.dart';

class CommentCard extends StatelessWidget {
  final FeedPostModel post;
  final Comment? comment;
  const CommentCard({super.key, required this.post, this.comment});

  @override
  Widget build(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;
    final userProvider = Provider.of<UserProvider>(context, listen: true);
    CommentService commentService = CommentService();

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
          border: Border.all(
              width: 2, color: isDark ? Colors.grey : Colors.grey.shade300),
          borderRadius: BorderRadius.circular(20)),
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  CircleAvatar(
                    backgroundImage: NetworkImage(
                      comment!.author.image.toString(),
                    ),
                    radius: 18,
                  ),
                  Padding(
                    padding: const EdgeInsets.only(left: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(comment!.author.name.toString(),
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color:
                                  isDark ? Colors.grey.shade400 : Colors.grey.shade300,
                            )),
                        Padding(
                          padding: const EdgeInsets.only(top: 4),
                          child: Text(
                            // DateFormat.yMMMd().format(
                            //   snap.data()['datePublished'].toDate(),
                            '@${comment!.author.username.toString()}',
                            style: TextStyle(
                              color:
                                  isDark ? Colors.grey.shade500 : Colors.grey.shade400,
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
              IconButton(
                onPressed: () {
                  showDialog(
                    useRootNavigator: false,
                    context: context,
                    builder: (context) {
                      return Dialog(
                        child: ListView(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shrinkWrap: true,
                          children: [
                            comment!.author.id == userProvider.user.id
                                ? 'Delete Comment'
                                : null,
                            // comment!.author.id == userProvider.user.id
                            //     ? 'Update Comment'
                            //     : null,
                          ]
                              .map(
                                (e) => InkWell(
                                    child: Container(
                                      padding: e == null
                                          ? null
                                          : const EdgeInsets.symmetric(
                                              vertical: 12, horizontal: 16),
                                      child:
                                          e == null ? null : Text(e.toString()),
                                    ),
                                    onTap: () {
                                      dev.log('$e Button Pressed',
                                          name: 'Comment Delete button');
                                      if (e == 'Delete Comment') {
                                        commentService.deleteComment(
                                            context: context, id: comment!.id);
                                      }
                                      // if (e == 'Repost Comment') {
                                      //   commentService.updateComment(
                                      //       context: context,
                                      //       id: comment!.id,
                                      //       caption: caption);
                                      // }
                                      Navigator.pop(context);
                                    }),
                              )
                              .toList(),
                        ),
                      );
                    },
                  );
                },
                icon: const Icon(Icons.more_vert),
              )
            ],
          ),
          Padding(
            padding: const EdgeInsets.only(top: 5),
            child: Text(comment!.caption.toString(),
                style: TextStyle(
                  color: isDark ? Colors.white : Colors.black,
                )),
          ),
        ],
      ),
    );
  }
}
