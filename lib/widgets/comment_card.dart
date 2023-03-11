import 'package:flutter/material.dart';
import 'package:foxxi/models/comments.dart';
import 'package:provider/provider.dart';

import '../models/feed_post_model.dart';
import '../providers/theme_provider.dart';

class CommentCard extends StatelessWidget {
  final FeedPostModel post;
  final Comment? comment;
  const CommentCard({super.key, required this.post, this.comment});

  @override
  Widget build(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;

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
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              CircleAvatar(
                backgroundImage: NetworkImage(
                  post.author.image.toString(),
                ),
                radius: 18,
              ),
              Padding(
                padding: const EdgeInsets.only(left: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(post.author.username.toString(),
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: isDark ? Colors.grey : Colors.grey.shade300,
                        )),
                    Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Text(
                        // DateFormat.yMMMd().format(
                        //   snap.data()['datePublished'].toDate(),
                        post.author.username.toString(),
                        style: TextStyle(
                          color: isDark ? Colors.grey : Colors.grey.shade300,
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
