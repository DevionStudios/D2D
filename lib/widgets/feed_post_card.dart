import 'package:flutter/material.dart';
import 'package:foxxi/models/donate_controller.dart';
import 'package:foxxi/models/feed_post_model.dart';
import 'package:foxxi/providers/theme_provider.dart';
import 'package:foxxi/providers/wallet_address.dart';
import 'package:foxxi/screens/chat.dart';
import 'package:foxxi/screens/wallet_screen.dart';
import 'package:foxxi/services/post_service.dart';
import 'package:foxxi/utils.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';

import 'package:foxxi/like_animation.dart';
import 'package:provider/provider.dart';
import 'dart:developer' as dev;
import '../providers/user_provider.dart';
import '../screens/post_screen.dart';
import '../services/comment_service.dart';

class FeedCard extends StatefulWidget {
  final FeedPostModel post;

  const FeedCard({super.key, required this.post});

  @override
  State<FeedCard> createState() => _FeedCardState();
}

class _FeedCardState extends State<FeedCard> {
  final commentService = CommentService();
  final TextEditingController _commentTextController = TextEditingController();
  final TextEditingController _controller = TextEditingController();
  PostService postService = PostService();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  // @override
  @override
  Widget build(context) {
    final walletAddressProvider =
        Provider.of<WalletAddressProvider>(context, listen: true);
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;

    final userProvider = Provider.of<UserProvider>(context, listen: true);
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => PostCard(
              post: widget.post,
              isImage: widget.post.media?.mediatype == 'image' ? true : false,
              isVideo: widget.post.media?.mediatype == 'video' ? true : false,
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
                                              'Delete Post',
                                              'Repost Post',
                                              'Update Post',
                                            ]
                                                .map(
                                                  (e) => InkWell(
                                                      child: Container(
                                                        padding:
                                                            const EdgeInsets
                                                                    .symmetric(
                                                                vertical: 12,
                                                                horizontal: 16),
                                                        child: Text(e),
                                                      ),
                                                      onTap: () {
                                                        dev.log(
                                                            '$e Button Pressed',
                                                            name:
                                                                'FeedPostCard Delete button');
                                                        postService.deletePost(
                                                            context: context,
                                                            id: widget.post.id
                                                                .toString());
                                                        Navigator.pop(context);
                                                      }),
                                                )
                                                .toList()),
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
                  Container(
                    width: MediaQuery.of(context).size.width - 20,
                    height: 50,
                    decoration: BoxDecoration(
                      borderRadius: const BorderRadius.only(
                          bottomLeft: Radius.circular(30),
                          bottomRight: Radius.circular(30)),
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
                    child: Row(
                      // mainAxisAlignment: MainAxisAlignment.end,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: <Widget>[
                        LikeAnimation(
                            isAnimating: true,
                            smallLike: true,
                            child: IconButton(
                              icon: Icon(
                                Icons.favorite_rounded,
                                size: 30,
                                color: Color.fromARGB(255, 226, 127, 245)
                                    .withOpacity(0.7),
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
                          icon: Icon(
                            Icons.comment_rounded,
                            color: Color.fromARGB(255, 226, 127, 245)
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
                          onPressed: () {
                            showMaterialModalBottomSheet<void>(
                              shape: const RoundedRectangleBorder(
                                  borderRadius: BorderRadius.vertical(
                                      top: Radius.circular(25))),
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
                                      padding: const EdgeInsets.all(8.0),
                                      child: Text('Reply',
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
                                            backgroundImage: NetworkImage(widget
                                                .post.author.image
                                                .toString()),
                                          ),
                                        ),
                                        Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                              children: [
                                                Padding(
                                                  padding:
                                                      const EdgeInsets.only(
                                                          left: 8),
                                                  child: Text(
                                                    widget.post.author.name
                                                        .toString(),
                                                    style: TextStyle(
                                                      color: isDark
                                                          ? Colors.grey.shade200
                                                          : Colors.black,
                                                    ),
                                                  ),
                                                ),
                                                Padding(
                                                  padding:
                                                      const EdgeInsets.only(
                                                          left: 4.0),
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
                                              // child: Text(
                                              //  ,
                                              //   style: TextStyle(
                                              //     color: Colors.grey,
                                              //   ),
                                              // ),
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
                                          padding: EdgeInsets.only(left: 8.0),
                                          child: Text('Your Reply'),
                                        ),
                                      ],
                                    ),
                                    const Padding(
                                      padding: EdgeInsets.all(8),
                                      child: TextField(
                                        decoration: InputDecoration(
                                          border: OutlineInputBorder(),
                                          hintText: 'An Interesting Reply',
                                        ),
                                      ),
                                    ),
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.all(8.0),
                                          child: Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.end,
                                            children: [
                                              Stack(children: <Widget>[
                                                Positioned.fill(
                                                  child: Container(
                                                    decoration: BoxDecoration(
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                              15),
                                                      gradient: LinearGradient(
                                                        colors: [
                                                          Colors.lightBlue
                                                              .shade100
                                                              .withOpacity(0.4),
                                                          Colors.purpleAccent
                                                              .shade100
                                                              .withOpacity(0.4),
                                                        ],
                                                        stops: [0, 1],
                                                        begin:
                                                            AlignmentDirectional(
                                                                1, 0),
                                                        end:
                                                            AlignmentDirectional(
                                                                -1, 0),
                                                        // color: Colors.purpleAccent.shade100.withOpacity(
                                                        // 0.3,
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                                TextButton(
                                                  style: TextButton.styleFrom(
                                                    foregroundColor:
                                                        Colors.white,
                                                    padding:
                                                        const EdgeInsets.all(
                                                            16.0),
                                                    textStyle: const TextStyle(
                                                        fontSize: 20),
                                                  ),
                                                  onPressed: () {
                                                    commentService.addComment(
                                                        context: context,
                                                        postId: widget.post.id
                                                            .toString(),
                                                        caption:
                                                            _commentTextController
                                                                .text);

                                                    _commentTextController
                                                        .clear();
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
                              ),
                            );
                          },
                        ),
                        IconButton(
                            icon: Icon(
                              Icons.send_rounded,
                              color: Color.fromARGB(255, 226, 127, 245),
                              size: 30,
                            ),
                            onPressed: () {
                              Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => OneOneChatScreen(
                                        senderId: widget.post.author.id,
                                        senderName:
                                            widget.post.author.name.toString(),
                                        senderUsername:
                                            widget.post.author.id.toString(),
                                        senderImage: widget.post.author.image
                                            .toString()),
                                  ));
                            }),
                        Expanded(
                          child: Align(
                            alignment: Alignment.bottomRight,
                            child: IconButton(
                                iconSize: 40,
                                icon: Icon(
                                  Icons.attach_money_rounded,
                                  color: Color.fromARGB(255, 226, 127, 245),
                                ),
                                onPressed: () {
                                  showMaterialModalBottomSheet<void>(
                                    shape: const RoundedRectangleBorder(
                                        borderRadius: BorderRadius.vertical(
                                            top: Radius.circular(25))),
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
                                            padding: const EdgeInsets.all(8.0),
                                            child: Text('Donate',
                                                style: TextStyle(
                                                    color: isDark
                                                        ? Colors.grey.shade400
                                                        : Colors.black,
                                                    fontFamily: 'InstagramSans',
                                                    fontSize: 25,
                                                    fontWeight:
                                                        FontWeight.bold)),
                                          ),
                                          Row(
                                            children: [
                                              Padding(
                                                padding:
                                                    const EdgeInsets.all(8),
                                                child: CircleAvatar(
                                                  radius: 16,
                                                  backgroundImage: NetworkImage(
                                                      widget.post.author.image
                                                          .toString()),
                                                ),
                                              ),
                                              Column(
                                                crossAxisAlignment:
                                                    CrossAxisAlignment.start,
                                                children: [
                                                  Row(
                                                    children: [
                                                      Padding(
                                                        padding:
                                                            const EdgeInsets
                                                                .only(left: 8),
                                                        child: Text(
                                                          widget.post.author
                                                              .username
                                                              .toString(),
                                                          style: TextStyle(
                                                            color: isDark
                                                                ? Colors.grey
                                                                    .shade300
                                                                : Colors.black,
                                                          ),
                                                        ),
                                                      ),
                                                      Padding(
                                                        padding:
                                                            const EdgeInsets
                                                                    .only(
                                                                left: 4.0),
                                                        child: Text(
                                                          widget.post.author
                                                              .username
                                                              .toString(),
                                                          style: TextStyle(
                                                            color: isDark
                                                                ? Colors.grey
                                                                    .shade200
                                                                : Colors.black,
                                                          ),
                                                        ),
                                                      )
                                                    ],
                                                  ),
                                                  // const Padding(
                                                  //   padding: EdgeInsets.only(
                                                  //     left: 8,
                                                  //   ),
                                                  //   child: Text(
                                                  //     'Feb 6',
                                                  //     style: TextStyle(
                                                  //       color: Colors.grey,
                                                  //     ),
                                                  //   ),
                                                  // )
                                                ],
                                              )
                                            ],
                                          ),
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.start,
                                            children: [
                                              Padding(
                                                padding: const EdgeInsets.only(
                                                    left: 8.0),
                                                child: Text(
                                                  'Your Reply',
                                                  style: TextStyle(
                                                    color: isDark
                                                        ? Colors.grey.shade300
                                                        : Colors.black,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                          Padding(
                                            padding: const EdgeInsets.all(8),
                                            child: TextField(
                                              controller: _controller,
                                              decoration: const InputDecoration(
                                                border: OutlineInputBorder(),
                                                hintText: 'Enter Token Amount',
                                              ),
                                            ),
                                          ),
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.center,
                                            children: [
                                              Container(
                                                padding:
                                                    const EdgeInsets.all(8.0),
                                                child: Row(
                                                  mainAxisAlignment:
                                                      MainAxisAlignment.end,
                                                  children: [
                                                    Stack(children: <Widget>[
                                                      Positioned.fill(
                                                        child: Container(
                                                          decoration:
                                                              BoxDecoration(
                                                            borderRadius:
                                                                BorderRadius
                                                                    .circular(
                                                                        15),
                                                            gradient:
                                                                LinearGradient(
                                                              colors: [
                                                                Colors.lightBlue
                                                                    .shade100
                                                                    .withOpacity(
                                                                        0.4),
                                                                Colors
                                                                    .purpleAccent
                                                                    .shade100
                                                                    .withOpacity(
                                                                        0.4),
                                                              ],
                                                              stops: const [
                                                                0,
                                                                1
                                                              ],
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
                                                        ),
                                                      ),
                                                      TextButton(
                                                        style: TextButton
                                                            .styleFrom(
                                                          foregroundColor:
                                                              isDark
                                                                  ? Colors.black
                                                                  : Colors
                                                                      .white,
                                                          padding:
                                                              const EdgeInsets
                                                                  .all(16.0),
                                                          textStyle:
                                                              const TextStyle(
                                                                  fontSize: 20),
                                                        ),
                                                        onPressed: () {
                                                          double amount =
                                                              double.parse(
                                                                  _controller
                                                                      .text);
                                                          print(amount);
                                                          print('---');

                                                          if (walletAddressProvider
                                                                  .privateAddress ==
                                                              null) {
                                                            showSnackBar(
                                                                context,
                                                                'Connect your Wallet to Donate !!!');
                                                            Navigator.pop(
                                                                context);
                                                          } else if (widget
                                                                  .post
                                                                  .author
                                                                  .walletAddress ==
                                                              'undefined') {
                                                            showSnackBar(
                                                                context,
                                                                'Ask ${widget.post.author.name} to set their Receiving Wallet Address !!!');
                                                            Navigator.pop(
                                                                context);
                                                          } else {
                                                            DonateController()
                                                                .donate(
                                                                    walletAddressProvider
                                                                        .privateAddress!,
                                                                    walletAddressProvider
                                                                        .walletAddress!,
                                                                    widget
                                                                        .post
                                                                        .author
                                                                        .walletAddress,
                                                                    amount)
                                                                .then((String
                                                                    result) {
                                                              showSnackBar(
                                                                  context,
                                                                  'Transaction added to Pending Transaction List!! ');

                                                              Navigator.pop(
                                                                  context);
                                                            });
                                                          }
                                                        },
                                                        child: const Text(
                                                            'Donate'),
                                                      ),
                                                    ]),
                                                  ],
                                                ),
                                              )
                                            ],
                                          ),
                                          TextButton(
                                              onPressed: () {
                                                Navigator.push(
                                                    context,
                                                    MaterialPageRoute(
                                                        builder: (context) =>
                                                            WalletWeb()));
                                              },
                                              child:
                                                  const Text('Donate Screen'))
                                        ],
                                      ),
                                    ),
                                  );
                                }),
                          ),
                        )
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
