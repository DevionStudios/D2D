import 'dart:developer' as dev;

import 'package:flutter/material.dart';
import 'package:foxxi/services/notification_service.dart';
import 'package:provider/provider.dart';

import 'package:foxxi/components/postlikebar.dart';
import 'package:foxxi/models/feed_post_model.dart';
import 'package:foxxi/providers/theme_provider.dart';
import 'package:foxxi/services/post_service.dart';
import 'package:video_player/video_player.dart';

import '../providers/user_provider.dart';
import '../screens/post_screen.dart';
import '../services/comment_service.dart';

class FeedCard extends StatefulWidget {
  final FeedPostModel post;
  final bool isImage;
  final bool isVideo;
  const FeedCard({
    Key? key,
    required this.post,
    required this.isImage,
    required this.isVideo,
  }) : super(key: key);

  @override
  State<FeedCard> createState() => _FeedCardState();
}

class _FeedCardState extends State<FeedCard> {
  final commentService = CommentService();
  VideoPlayerController? _controller;
  NotificationService notificationService = NotificationService();
  PostService postService = PostService();

  @override
  void initState() {
    if (widget.isVideo) {
      _controller =
          VideoPlayerController.network(widget.post.media!.url.toString())
            ..initialize().then((_) {
              _controller!.setLooping(true);

              setState(() {});
            });
    }
    super.initState();
  }

  @override
  void dispose() {
    if (_controller != null) {
      _controller!.dispose();
    }
    super.dispose();
  }

  // @override
  @override
  Widget build(context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;

    final userProvider = Provider.of<UserProvider>(context, listen: true);

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => PostCard(
              post: widget.post,
              isImage: widget.isImage,
              isVideo: widget.isVideo,
            ),
          ),
        );
      },
      child: Container(
        padding: const EdgeInsetsDirectional.fromSTEB(0, 0, 0, 10),
        child: Padding(
          padding: const EdgeInsetsDirectional.fromSTEB(10, 10, 10, 10),
          child: Container(
            decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(30),
                color: isDark ? Colors.grey.shade700 : Colors.white),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(30),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      vertical: 4,
                      horizontal: 16,
                    ).copyWith(right: 0),
                    child: Row(
                      children: <Widget>[
                        Card(
                          shape: const CircleBorder(),
                          elevation: 5,
                          child: CircleAvatar(
                            radius: 16,
                            backgroundImage: NetworkImage(
                                widget.post.author.image.toString()),
                            onBackgroundImageError: (exception, stackTrace) =>
                                const Icon(Icons.person_outline),
                          ),
                        ),
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.only(
                              left: 8,
                            ),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                Text(
                                  widget.post.author.name.toString(),
                                  style: const TextStyle(
                                    fontSize: 15,
                                    fontFamily: 'InstagramSans',
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  '@${widget.post.author.username.toString()}',
                                  style: const TextStyle(color: Colors.grey),
                                )
                              ],
                            ),
                          ),
                        ),
                        true
                            ? IconButton(
                                onPressed: () {
                                  showDialog(
                                    useRootNavigator: false,
                                    context: context,
                                    builder: (context) {
                                      return Dialog(
                                        child: ListView(
                                          padding: const EdgeInsets.symmetric(
                                              vertical: 16),
                                          shrinkWrap: true,
                                          children: [
                                            widget.post.author.id ==
                                                    userProvider.user.id
                                                ? 'Delete Post'
                                                : null,
                                            widget.post.author.id ==
                                                    userProvider.user.id
                                                ? null
                                                : 'Repost Post',
                                            widget.post.author.id ==
                                                    userProvider.user.id
                                                ? 'Update Post'
                                                : null,
                                          ]
                                              .map(
                                                (e) => InkWell(
                                                    child: Container(
                                                      padding: e == null
                                                          ? null
                                                          : const EdgeInsets
                                                                  .symmetric(
                                                              vertical: 12,
                                                              horizontal: 16),
                                                      child: e == null
                                                          ? null
                                                          : Text(e.toString()),
                                                    ),
                                                    onTap: () {
                                                      dev.log(
                                                          '$e Button Pressed',
                                                          name:
                                                              'FeedPostCard  button');
                                                      if (e == 'Delete Post') {
                                                        postService.deletePost(
                                                            context: context,
                                                            id: widget.post.id
                                                                .toString());
                                                      }
                                                      if (e == 'Repost Post') {
                                                        postService.repostPost(
                                                            id: widget.post.id,
                                                            context: context);
                                                      }
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
                            : Container(),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.all(8),
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text(
                        widget.post.caption.toString(),
                        style: TextStyle(
                          fontFamily: 'InstagramSans',
                          color: Colors.grey.shade400,
                          fontSize: 15,
                        ),
                        maxLines: 4,
                      ),
                    ),
                  ),
                  widget.isImage
                      ? Container(
                          height: 400,
                          width: MediaQuery.of(context).size.width - 20,
                          decoration: BoxDecoration(
                            borderRadius: const BorderRadius.only(
                                bottomLeft: Radius.circular(30),
                                bottomRight: Radius.circular((30))),
                            // border: Border(
                            //     bottom: BorderSide(color: Colors.black.withOpacity(1))),
                            image: DecorationImage(
                              image: NetworkImage(
                                  widget.post.media!.url.toString()),
                              fit: BoxFit.cover,
                            ),
                          ),
                          child: PostLikeCommentBar(post: widget.post))
                      : widget.isVideo
                          ? Container(
                              height: 400,
                              width: MediaQuery.of(context).size.width - 20,
                              decoration: const BoxDecoration(
                                borderRadius:
                                    BorderRadius.all(Radius.circular(30)),
                                // border: Border(
                                //     bottom: BorderSide(color: Colors.black.withOpacity(1))),
                              ),
                              child: Column(
                                mainAxisSize: MainAxisSize.max,
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  _controller?.value == null
                                      ? const SizedBox()
                                      : Stack(
                                          children: [
                                            _controller!.value.isInitialized
                                                ? Container(
                                                    decoration: const BoxDecoration(
                                                        borderRadius:
                                                            BorderRadius.all(
                                                                Radius.circular(
                                                                    30))),
                                                    height: 330,
                                                    width: 400,
                                                    child: VideoPlayer(
                                                        _controller!))
                                                : Container(),
                                            Positioned(
                                              top: 270,
                                              left: 10,
                                              child: FloatingActionButton(
                                                heroTag: widget.post.id,
                                                onPressed: () {
                                                  setState(
                                                    () {
                                                      _controller!
                                                              .value.isPlaying
                                                          ? _controller!.pause()
                                                          : _controller!.play();
                                                    },
                                                  );
                                                },
                                                child: Icon(
                                                  _controller!.value.isPlaying
                                                      ? Icons.pause
                                                      : Icons.play_arrow,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                  PostLikeCommentBar(post: widget.post),
                                ],
                              ),
                            )
                          : const SizedBox(),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
