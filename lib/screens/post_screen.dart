import 'package:flutter/material.dart';
import 'package:foxxi/components/postlikebar.dart';
import 'package:foxxi/providers/user_provider.dart';
import 'package:foxxi/screens/profile_screen.dart';
import 'package:foxxi/services/comment_service.dart';
import 'package:foxxi/services/post_service.dart';
import 'package:foxxi/widgets/comment_card.dart';
import 'package:provider/provider.dart';
import 'package:video_player/video_player.dart';

import '../models/comments.dart';
import '../models/feed_post_model.dart';
import '../providers/theme_provider.dart';
// import 'package:flutter_svg/flutter_svg.dart';

class PostCard extends StatefulWidget {
  final FeedPostModel post;
  final bool isImage;
  final bool isVideo;
  const PostCard({
    Key? key,
    required this.post,
    required this.isImage,
    required this.isVideo,
  }) : super(key: key);

  // const PostCard({super.key});

  @override
  State<PostCard> createState() => _PostCardState();
}

class _PostCardState extends State<PostCard> {
  final postService = PostService();
  final commentService = CommentService();
  final TextEditingController _commentTextController = TextEditingController();
  VideoPlayerController? _controller;
  late Future<List<Comment>> _comments;
  @override
  void initState() {
    if (widget.isVideo) {
      _controller =
          VideoPlayerController.network(widget.post.media!.url.toString())
            ..initialize().then((_) {
              _controller!.setLooping(true);

              // Ensure the first frame is shown after the video is initialized, even before the play button has been pressed.
              setState(() {});
            });
    }
    getComments();
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
    _commentTextController.dispose();
    if (_controller != null) {
      _controller!.dispose();
    }
  }

  void getComments() async {
    _comments = postService.getCommentByPostId(
        context: context, id: widget.post.id.toString());
  }

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context, listen: true).user;
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;

    return Scaffold(
      backgroundColor: isDark ? Colors.grey.shade900 : Colors.grey.shade100,
      body: Container(
        padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Container(
                      padding: const EdgeInsets.all(16),
                      height: 100,
                      // width: MediaQuery.of(context).size.width * 0.1,
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
                      )),
                ],
              ),
              Container(
                padding: const EdgeInsetsDirectional.fromSTEB(0, 0, 0, 10),
                child: Padding(
                  padding: const EdgeInsetsDirectional.fromSTEB(10, 10, 10, 10),
                  child: Container(
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(30),
                        color: isDark ? Colors.grey.shade900 : Colors.white),
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
                                  ),
                                ),
                                Expanded(
                                  child: Padding(
                                    padding: const EdgeInsets.only(
                                      left: 8,
                                    ),
                                    child: GestureDetector(
                                      onTap: () {
                                        if (widget.post.author.username !=
                                            userProvider.username) {
                                          Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                  builder: (context) =>
                                                      ProfileWidget(
                                                          isMe: false,
                                                          user: widget
                                                              .post.author)));
                                        }
                                      },
                                      child: Column(
                                        mainAxisSize: MainAxisSize.min,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: <Widget>[
                                          Text(
                                            widget.post.author.name.toString(),
                                            style: TextStyle(
                                                fontWeight: FontWeight.bold,
                                                color: isDark
                                                    ? Colors.white
                                                    : Colors.black),
                                          ),
                                          Text(
                                            widget.post.author.username
                                                .toString(),
                                            style: TextStyle(
                                                color: isDark
                                                    ? Colors.grey
                                                    : Colors.grey[300]),
                                          )
                                        ],
                                      ),
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
                                                    padding: const EdgeInsets
                                                            .symmetric(
                                                        vertical: 16),
                                                    shrinkWrap: true,
                                                    children: [
                                                      'Delete',
                                                    ]
                                                        .map(
                                                          (e) => InkWell(
                                                              child: Container(
                                                                padding: const EdgeInsets
                                                                        .symmetric(
                                                                    vertical:
                                                                        12,
                                                                    horizontal:
                                                                        16),
                                                                child: Text(e),
                                                              ),
                                                              onTap: () {
                                                                postService.deletePost(
                                                                    context:
                                                                        context,
                                                                    id: widget
                                                                        .post.id
                                                                        .toString());
                                                              }),
                                                        )
                                                        .toList()),
                                              );
                                            },
                                          );
                                        },
                                        icon: Icon(
                                          Icons.more_vert,
                                          color: isDark
                                              ? Colors.white
                                              : Colors.black,
                                        ),
                                      )
                                    : Container(),
                              ],
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Text(
                              widget.post.caption.toString(),
                              style: TextStyle(
                                  color: isDark ? Colors.white : Colors.black),
                            ),
                          ),
                          widget.isImage
                              ? Container(
                                  height: 400,
                                  width: MediaQuery.of(context).size.width - 20,
                                  decoration: BoxDecoration(
                                    borderRadius: const BorderRadius.all(
                                        Radius.circular(30)),
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
                                      width: MediaQuery.of(context).size.width -
                                          20,
                                      decoration: const BoxDecoration(
                                        borderRadius: BorderRadius.all(
                                            Radius.circular(30)),
                                        // border: Border(
                                        //     bottom: BorderSide(color: Colors.black.withOpacity(1))),
                                      ),
                                      child: Column(
                                        mainAxisSize: MainAxisSize.max,
                                        mainAxisAlignment:
                                            MainAxisAlignment.end,
                                        children: [
                                          Stack(
                                            children: [
                                              _controller!.value.isInitialized
                                                  ? Container(
                                                      decoration: const BoxDecoration(
                                                          borderRadius:
                                                              BorderRadius.all(
                                                                  Radius
                                                                      .circular(
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
                                                  onPressed: () {
                                                    setState(
                                                      () {
                                                        _controller!
                                                                .value.isPlaying
                                                            ? _controller!
                                                                .pause()
                                                            : _controller!
                                                                .play();
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
              SizedBox(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text(
                        'Comments',
                        style: TextStyle(
                            fontFamily: 'InstagramSans',
                            color: isDark ? Colors.white : Colors.black,
                            fontSize: 20),
                      ),
                    ),
                    FutureBuilder<List<Comment>>(
                        future: _comments,
                        builder: (context, snapshot) {
                          if (snapshot.hasData) {
                            return Padding(
                              padding: EdgeInsets.only(
                                  top: MediaQuery.of(context).padding.top),
                              child: MediaQuery.removePadding(
                                context: context,
                                removeTop: true,
                                child: ListView.builder(
                                  physics: const ScrollPhysics(),
                                  shrinkWrap: true,
                                  itemCount: snapshot.data!.length,
                                  itemBuilder: ((context, index) {
                                    return CommentCard(
                                      post: widget.post,
                                      comment: snapshot.data![index],
                                    );
                                  }),
                                ),
                              ),
                            );
                          } else {
                            return const Center(
                                child: CircularProgressIndicator());
                          }
                        })
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
