import 'dart:developer' as dev;

import 'package:flutter/material.dart';
import 'package:foxxi/widgets/add_comment.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
import 'package:provider/provider.dart';

import 'package:foxxi/models/comments.dart';
import 'package:foxxi/providers/user_provider.dart';
import 'package:foxxi/services/comment_service.dart';

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

    dev.log('${comment!.author.id} " " ${userProvider.user.id}');

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
                              color: isDark ? Colors.black38 : Colors.black87,
                            )),
                        Padding(
                          padding: const EdgeInsets.only(top: 4),
                          child: Text(
                            // DateFormat.yMMMd().format(
                            //   snap.data()['datePublished'].toDate(),
                            '@${comment!.author.username.toString()}',
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
              IconButton(
                onPressed: () {
                  BuildContext dialogContext;
                  showDialog(
                    useRootNavigator: false,
                    context: context,
                    builder: (context) {
                      dialogContext = context;
                      return Dialog(
                        child: ListView(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shrinkWrap: true,
                          children: [
                            comment!.author.username ==
                                    userProvider.user.username
                                ? 'Delete Comment'
                                : null,
                            comment!.author.username ==
                                    userProvider.user.username
                                ? 'Update Comment'
                                : null,
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
                                        Navigator.pop(dialogContext);

                                        commentService.deleteComment(
                                            context: context, id: comment!.id);
                                      }
                                      if (e == 'Update Comment') {
                                        Navigator.pop(dialogContext);
                                        showMaterialModalBottomSheet<void>(
                                          shape: const RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.vertical(
                                                      top:
                                                          Radius.circular(25))),
                                          context: context,
                                          builder: (context) => Padding(
                                            padding: EdgeInsets.only(
                                                bottom: MediaQuery.of(context)
                                                    .viewInsets
                                                    .bottom),
                                            child: Column(
                                              mainAxisSize: MainAxisSize.min,
                                              children: [
                                                Padding(
                                                  padding:
                                                      const EdgeInsets.all(8.0),
                                                  child: Text('Update Comment',
                                                      style: TextStyle(
                                                          color: isDark
                                                              ? Colors
                                                                  .grey.shade400
                                                              : Colors.black,
                                                          fontFamily:
                                                              'InstagramSans',
                                                          fontSize: 25,
                                                          fontWeight:
                                                              FontWeight.bold)),
                                                ),
                                                Row(
                                                  children: [
                                                    Padding(
                                                      padding:
                                                          const EdgeInsets.all(
                                                              8),
                                                      child: CircleAvatar(
                                                        radius: 16,
                                                        backgroundImage:
                                                            NetworkImage(post
                                                                .author.image
                                                                .toString()),
                                                      ),
                                                    ),
                                                    Column(
                                                      crossAxisAlignment:
                                                          CrossAxisAlignment
                                                              .start,
                                                      children: [
                                                        Row(
                                                          children: [
                                                            Padding(
                                                              padding:
                                                                  const EdgeInsets
                                                                          .only(
                                                                      left: 8),
                                                              child: Text(
                                                                post.author.name
                                                                    .toString(),
                                                                style:
                                                                    TextStyle(
                                                                  color: isDark
                                                                      ? Colors
                                                                          .grey
                                                                          .shade200
                                                                      : Colors
                                                                          .black,
                                                                ),
                                                              ),
                                                            ),
                                                            Padding(
                                                              padding:
                                                                  const EdgeInsets
                                                                          .only(
                                                                      left:
                                                                          4.0),
                                                              child: Text(
                                                                '@${post.author.username}',
                                                                style:
                                                                    TextStyle(
                                                                  color: isDark
                                                                      ? Colors
                                                                          .grey
                                                                          .shade600
                                                                      : Colors
                                                                          .black,
                                                                ),
                                                              ),
                                                            )
                                                          ],
                                                        ),
                                                        const Padding(
                                                          padding:
                                                              EdgeInsets.only(
                                                            left: 8,
                                                          ),
                                                        )
                                                      ],
                                                    )
                                                  ],
                                                ),
                                                Row(
                                                  mainAxisAlignment:
                                                      MainAxisAlignment.start,
                                                  children: const [
                                                    Padding(
                                                      padding: EdgeInsets.only(
                                                          left: 8.0),
                                                      child: Text(
                                                          'Update Comment'),
                                                    ),
                                                  ],
                                                ),
                                                AddCommentWidget(
                                                  isUpdateComment: true,
                                                  postId: post.id,
                                                  commentId: comment!.id,
                                                ),
                                              ],
                                            ),
                                          ),
                                        );
                                      }
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
