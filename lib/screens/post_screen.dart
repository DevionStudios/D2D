import 'dart:ui';

import 'package:badges/badges.dart' as badges;
import 'package:flutter/material.dart';
import 'package:foxxi/like_animation.dart';
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
  bool isImage;
  bool isVideo;
  PostCard({
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
    // print('${widget.isImage}  ${widget.isVideo}');
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
              Container(
                padding: const EdgeInsetsDirectional.fromSTEB(0, 0, 0, 10),
                child: Padding(
                  padding: const EdgeInsetsDirectional.fromSTEB(10, 10, 10, 10),
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(30),
                      color:
                          isDark ? Colors.grey.shade900 : Colors.grey.shade100,
                    ),
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
                          // IMAGE SECTION OF THE POST
                          // GestureDetector(
                          //   onDoubleTap: () {
                          //     // FireStoreMethods().likePost(
                          //     //   widget.snap['postId'].toString(),
                          //     //   user.uid,
                          //     //   widget.snap['likes'],
                          //     // );
                          //     setState(() {
                          //       isLikeAnimating = true;
                          //     });
                          //   },
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
                                  child: Column(
                                    mainAxisSize: MainAxisSize.max,
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
                                            width: MediaQuery.of(context)
                                                    .size
                                                    .width -
                                                20,
                                            height: 50,
                                            decoration: BoxDecoration(
                                              borderRadius:
                                                  const BorderRadius.only(
                                                      bottomLeft:
                                                          Radius.circular(30),
                                                      bottomRight:
                                                          Radius.circular(30)),
                                              gradient: LinearGradient(
                                                colors: [
                                                  Colors.lightBlue.shade100
                                                      .withOpacity(0.4),
                                                  Colors.purpleAccent.shade100
                                                      .withOpacity(0.4),
                                                ],
                                                stops: const [0, 1],
                                                begin:
                                                    const AlignmentDirectional(
                                                        1, 0),
                                                end: const AlignmentDirectional(
                                                    -1, 0),
                                                // color: Colors.purpleAccent.shade100.withOpacity(
                                                // 0.3,
                                              ),
                                            ),
                                            child: Row(
                                              // mainAxisAlignment: MainAxisAlignment.end,
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.end,
                                              children: <Widget>[
                                                LikeAnimation(
                                                    isAnimating: true,
                                                    smallLike: true,
                                                    child: IconButton(
                                                      icon: badges.Badge(
                                                        badgeStyle: const badges
                                                                .BadgeStyle(
                                                            badgeColor:
                                                                Color.fromARGB(
                                                                    255,
                                                                    244,
                                                                    179,
                                                                    254)),
                                                        badgeContent: widget
                                                                    .post
                                                                    .likes
                                                                    ?.length ==
                                                                null
                                                            ? const Text('0')
                                                            : Text(widget.post
                                                                .likes!.length
                                                                .toString()),
                                                        child: Icon(
                                                          Icons
                                                              .favorite_rounded,
                                                          size: 30,
                                                          color: const Color
                                                                      .fromARGB(
                                                                  255,
                                                                  244,
                                                                  204,
                                                                  250)
                                                              .withOpacity(0.7),
                                                        ),
                                                      ),
                                                      onPressed: () {
                                                        postService.likePost(
                                                            context: context,
                                                            id: widget.post.id
                                                                .toString());
                                                        setState(() {});
                                                      },
                                                    )

                                                    // color: Colors.grey.shade500,
                                                    // size: 50,

                                                    // color: ,

                                                    // ignore: dead_code
                                                    // : const Icon(
                                                    //     Icons.favorite_border,
                                                    //   ),
                                                    // onPressed: () => FireStoreMethods().likePost(
                                                    //   widget.snap['postId'].toString(),
                                                    //   user.uid,
                                                    //   widget.snap['likes'],
                                                    // ),
                                                    // onPressed: () {},
                                                    ),
                                                IconButton(
                                                  icon: badges.Badge(
                                                    badgeStyle:
                                                        const badges.BadgeStyle(
                                                            badgeColor:
                                                                Color.fromARGB(
                                                                    255,
                                                                    244,
                                                                    179,
                                                                    254)),
                                                    badgeContent: widget
                                                                .post
                                                                .comments
                                                                ?.length ==
                                                            null
                                                        ? const Text('0')
                                                        : Text(widget.post
                                                            .comments!.length
                                                            .toString()),
                                                    child: Icon(
                                                        Icons.comment_rounded,
                                                        color: const Color
                                                                    .fromARGB(
                                                                255,
                                                                244,
                                                                204,
                                                                250)
                                                            .withOpacity(0.7),
                                                        size: 30),
                                                    // onPressed: () => Navigator.of(context).push(
                                                    //   MaterialPageRoute(
                                                    //     builder: (context) => CommentsScreen(
                                                    //       postId: widget.snap['postId'].toString(),
                                                    //     ),
                                                    //   ),
                                                    // ),
                                                  ),
                                                  onPressed: () {},
                                                ),
                                                widget.post.author.id !=
                                                        userProvider.id
                                                    ? IconButton(
                                                        icon: Icon(
                                                          Icons.send_rounded,
                                                          color: const Color
                                                                      .fromARGB(
                                                                  255,
                                                                  244,
                                                                  204,
                                                                  250)
                                                              .withOpacity(0.7),
                                                          size: 30,
                                                        ),
                                                        onPressed: () {})
                                                    : const SizedBox(),
                                              ],
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                )
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
                                          ClipRRect(
                                            borderRadius:
                                                const BorderRadius.only(
                                                    bottomLeft:
                                                        Radius.circular(30),
                                                    bottomRight:
                                                        Radius.circular(30)),
                                            child: BackdropFilter(
                                              filter: ImageFilter.blur(
                                                sigmaX: 3,
                                                sigmaY: 3,
                                              ),
                                              child: Container(
                                                width: MediaQuery.of(context)
                                                        .size
                                                        .width -
                                                    20,
                                                height: 50,
                                                decoration: BoxDecoration(
                                                  borderRadius:
                                                      const BorderRadius.only(
                                                          bottomLeft:
                                                              Radius.circular(
                                                                  30),
                                                          bottomRight:
                                                              Radius.circular(
                                                                  30)),
                                                  gradient: LinearGradient(
                                                    colors: [
                                                      Colors.lightBlue.shade100
                                                          .withOpacity(0.4),
                                                      Colors
                                                          .purpleAccent.shade100
                                                          .withOpacity(0.4),
                                                    ],
                                                    stops: const [0, 1],
                                                    begin:
                                                        const AlignmentDirectional(
                                                            1, 0),
                                                    end:
                                                        const AlignmentDirectional(
                                                            -1, 0),
                                                    // color: Colors.purpleAccent.shade100.withOpacity(
                                                    // 0.3,
                                                  ),
                                                ),
                                                child: Row(
                                                  // mainAxisAlignment: MainAxisAlignment.end,
                                                  crossAxisAlignment:
                                                      CrossAxisAlignment.end,
                                                  children: <Widget>[
                                                    LikeAnimation(
                                                        isAnimating: true,
                                                        smallLike: true,
                                                        child: IconButton(
                                                          icon: badges.Badge(
                                                            badgeStyle: const badges
                                                                    .BadgeStyle(
                                                                badgeColor: Color
                                                                    .fromARGB(
                                                                        255,
                                                                        244,
                                                                        179,
                                                                        254)),
                                                            badgeContent:
                                                                const Text('0'),
                                                            child: Icon(
                                                              Icons
                                                                  .favorite_rounded,
                                                              size: 30,
                                                              color: const Color
                                                                          .fromARGB(
                                                                      255,
                                                                      244,
                                                                      204,
                                                                      250)
                                                                  .withOpacity(
                                                                      0.7),
                                                            ),
                                                          ),
                                                          onPressed: () {},
                                                        )

                                                        // color: Colors.grey.shade500,
                                                        // size: 50,

                                                        // color: ,

                                                        // ignore: dead_code
                                                        // : const Icon(
                                                        //     Icons.favorite_border,
                                                        //   ),
                                                        // onPressed: () => FireStoreMethods().likePost(
                                                        //   widget.snap['postId'].toString(),
                                                        //   user.uid,
                                                        //   widget.snap['likes'],
                                                        // ),
                                                        // onPressed: () {},
                                                        ),
                                                    IconButton(
                                                      icon: badges.Badge(
                                                        badgeStyle: const badges
                                                                .BadgeStyle(
                                                            badgeColor:
                                                                Color.fromARGB(
                                                                    255,
                                                                    244,
                                                                    179,
                                                                    254)),
                                                        badgeContent:
                                                            const Text('0'),
                                                        child: Icon(
                                                          Icons.comment_rounded,
                                                          color: const Color
                                                                      .fromARGB(
                                                                  255,
                                                                  244,
                                                                  204,
                                                                  250)
                                                              .withOpacity(0.7),
                                                          size: 30,
                                                        ),
                                                        // onPressed: () => Navigator.of(context).push(
                                                        //   MaterialPageRoute(
                                                        //     builder: (context) => CommentsScreen(
                                                        //       postId: widget.snap['postId'].toString(),
                                                        //     ),
                                                        //   ),
                                                        // ),
                                                      ),
                                                      onPressed: () {},
                                                    ),
                                                    IconButton(
                                                        icon: Icon(
                                                          Icons.send_rounded,
                                                          color: const Color
                                                                      .fromARGB(
                                                                  255,
                                                                  244,
                                                                  204,
                                                                  250)
                                                              .withOpacity(0.7),
                                                          size: 30,
                                                        ),
                                                        onPressed: () {}),
                                                  ],
                                                ),
                                              ),
                                            ),
                                          ),
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
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Text(
                            'Your Reply',
                            style: TextStyle(
                                fontFamily: 'InstagramSans',
                                color: isDark ? Colors.white : Colors.black,
                                fontSize: 20),
                          ),
                        ),
                      ],
                    ),
                    Padding(
                      padding: const EdgeInsets.only(left: 15.0, right: 15.0),
                      child: TextField(
                        controller: _commentTextController,
                        scrollPadding: const EdgeInsets.all(100.0),
                        decoration: const InputDecoration(
                          border: OutlineInputBorder(),
                          hintText: 'An Interesting Reply',
                        ),
                      ),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Padding(
                          padding: const EdgeInsets.only(left: 10, right: 10),
                          child: ElevatedButton(
                            style: ButtonStyle(
                              foregroundColor: MaterialStateProperty.all<Color>(
                                  Colors.white),
                              backgroundColor:
                                  MaterialStateProperty.all<Color>(Colors.blue),
                            ),
                            onPressed: () {
                              commentService.addComment(
                                  context: context,
                                  postId: widget.post.id.toString(),
                                  caption: _commentTextController.text);

                              _commentTextController.clear();
                            },
                            child: const Text('Reply'),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.only(left: 10, right: 10),
                          child: TextButton(
                            style: ButtonStyle(
                              foregroundColor: MaterialStateProperty.all<Color>(
                                  Colors.white),
                              backgroundColor: MaterialStateProperty.all<Color>(
                                  Colors.blue.shade400),
                            ),
                            onPressed: () {},
                            child: const Text(
                              'Cancel',
                              // style: TextStyle(color: Colors.grey),
                            ),
                          ),
                        )
                      ],
                    ),
                    Column(
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
                        // MediaQuery.removePadding(
                        //   context: context,
                        //   removeTop: true,
                        //   child: ListView.builder(
                        //     // scrollDirection: Axis.vertical,
                        //     shrinkWrap: true,
                        //     physics: const NeverScrollableScrollPhysics(),
                        //     itemCount: comments.isEmpty ? 0 : comments.length,
                        //     itemBuilder: (context, index) {
                        //       return comments.isEmpty
                        //           ? const Center(
                        //               child: Text('No Comments So Far'))
                        //           : Column(
                        //               children: [
                        //                 CommentCard(
                        //                   post: widget.post,
                        //                   comment: comments[index],
                        //                 ),
                        //                 const Divider(
                        //                   height: 2,
                        //                 ),
                        //               ],
                        //             );
                        //     },
                        //   ),
                        // ),
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
                    )
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
    // );
    // );
    // );

    // LIKE, COMMENT SECTION OF THE POST
    // Row(
    //   children: <Widget>[
    //     LikeAnimation(
    //       isAnimating: true,
    //       smallLike: true,
    //       child: IconButton(
    //         icon: true
    //             ? const Icon(
    //                 Icons.favorite,
    //                 color: Colors.red,
    //               )
    //             : const Icon(
    //                 Icons.favorite_border,
    //               ),
    //         // onPressed: () => FireStoreMethods().likePost(
    //         //   widget.snap['postId'].toString(),
    //         //   user.uid,
    //         //   widget.snap['likes'],
    //         // ),
    //         onPressed: () {},
    //       ),
    //     ),
    //     IconButton(
    //       icon: const Icon(
    //         Icons.comment_outlined,
    //       ),
    //       // onPressed: () => Navigator.of(context).push(
    //       //   MaterialPageRoute(
    //       //     builder: (context) => CommentsScreen(
    //       //       postId: widget.snap['postId'].toString(),
    //       //     ),
    //       //   ),
    //       // ),
    //       onPressed: () {},
    //     ),
    //     IconButton(
    //         icon: const Icon(
    //           Icons.send,
    //         ),
    //         onPressed: () {}),
    //     Expanded(
    //         child: Align(
    //       alignment: Alignment.bottomRight,
    //       child: IconButton(
    //           icon: const Icon(Icons.bookmark_border), onPressed: () {}),
    //     ))
    //   ],
    // ),
    //DESCRIPTION AND NUMBER OF COMMENTS
    // Container(
    //   padding: const EdgeInsets.symmetric(horizontal: 16),
    //   child: Column(
    //       mainAxisSize: MainAxisSize.min,
    //       crossAxisAlignment: CrossAxisAlignment.start,
    //       children: <Widget>[
    //         DefaultTextStyle(
    //             style: Theme.of(context)
    //                 .textTheme
    //                 .subtitle2!
    //                 .copyWith(fontWeight: FontWeight.w800),
    //             child: Text(
    //               // '${widget.snap['likes'].length} likes',
    //               '0 Likes',
    //               style: Theme.of(context).textTheme.bodyText2,
    //             )),
    //         Container(
    //           width: double.infinity,
    //           padding: const EdgeInsets.only(
    //             top: 8,
    //           ),
    //           child: RichText(
    //             text: TextSpan(
    //               style: const TextStyle(color: Colors.black),
    //               children: [
    //                 TextSpan(
    //                   // text: widget.snap['username'].toString(),
    //                   text: Posts[1].userName,
    //                   style: const TextStyle(
    //                     fontWeight: FontWeight.bold,
    //                   ),
    //                 ),
    //                 const TextSpan(
    //                   text: 'Test Description',
    //                 ),
    //               ],
    //             ),
    //           ),
    //         ),
    //         InkWell(
    //           child: Container(
    //             child: Text(
    //               'View all $commentLen comments',
    //               style: const TextStyle(
    //                 fontSize: 16,
    //                 color: Colors.white,
    //               ),
    //             ),
    //             padding: const EdgeInsets.symmetric(vertical: 4),
    //           ),
    //           // onTap: () => Navigator.of(context).push(
    //           //   MaterialPageRoute(
    //           //     builder: (context) => CommentsScreen(
    //           //       // postId: widget.snap['postId'].toString(),
    //           //     ),
    //           onTap: () {},
    //         ),
    //       ]),
    // ),
    // Container(
    //   child: Text(
    //     DateFormat.yMMMd()
    //         .format(widget.snap['datePublished'].toDate()),
    //     style: const TextStyle(
    //       color: secondaryColor,
    //     ),
    //   ),
    //   padding: const EdgeInsets.symmetric(vertical: 4),
    // ),

    // Stack(alignment: Alignment.bottomCenter, children: [
    //   Container(
    //     // color: Colors.cyan,
    //     height: 45,
    //     decoration: BoxDecoration(
    //       // backgroundBlendMode: BlendMode.modulate,
    //       color: Colors.white70.withOpacity(0.65),
    //       borderRadius: const BorderRadius.only(
    //           bottomLeft: Radius.circular(30),
    //           bottomRight: (Radius.circular(30))),
    //     ),
    //   ),
  }
}
