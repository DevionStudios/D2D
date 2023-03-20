import 'package:flutter/material.dart';
import 'package:foxxi/services/comment_service.dart';

class AddCommentWidget extends StatelessWidget {
  final String postId;
  AddCommentWidget({
    required this.postId,
    super.key,
  });
  final TextEditingController _commentTextController = TextEditingController();
  final CommentService commentService = CommentService();
  @override
  Widget build(BuildContext context) {
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
                        onPressed: () {
                          commentService.addComment(
                              context: context,
                              postId: postId,
                              caption: _commentTextController.text);

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
