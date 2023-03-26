import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:foxxi/constants.dart';
import 'package:foxxi/models/notification.dart';
import 'package:foxxi/providers/user_provider.dart';
import 'package:foxxi/services/comment_service.dart';
import 'package:foxxi/services/notification_service.dart';

class AddCommentWidget extends StatelessWidget {
  final String? postUserId;
  final String postId;
  AddCommentWidget({
    Key? key,
    this.postUserId,
    required this.postId,
  }) : super(key: key);
  final TextEditingController _commentTextController = TextEditingController();
  final CommentService commentService = CommentService();
  NotificationService notificationService = NotificationService();
  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context, listen: false).user;
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Column(
        children: [
          TextField(
            controller: _commentTextController,
            decoration: const InputDecoration(
              border: OutlineInputBorder(),
              hintText: 'An Interesting Reply',
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(8.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Stack(children: <Widget>[
                      Positioned.fill(
                        child: Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(15),
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
                        ),
                      ),
                      TextButton(
                        style: TextButton.styleFrom(
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.all(16.0),
                          textStyle: const TextStyle(fontSize: 20),
                        ),
                        onPressed: () async {
                          int statusCode = await commentService.addComment(
                              context: context,
                              postId: postId,
                              caption: _commentTextController.text);

                          if (userProvider.id != postUserId) {
                            if (context.mounted) {
                              if (statusCode == 201) {
                                notificationService.addNotification(
                                    context: context,
                                    notification: NotificationModel(
                                        notification: 'Commented On ',
                                        notificationType:
                                            NotificationType.POST_REPLY.name,
                                        userId: postUserId.toString(),
                                        username: userProvider.username,
                                        postId: postId));
                              }
                            }
                          }
                          _commentTextController.clear();
                        },
                        child: const Text('Comment'),
                      ),
                    ]),
                  ],
                ),
              )
            ],
          )
        ],
      ),
    );
  }
}
