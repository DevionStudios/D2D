import 'package:flutter/material.dart';
import 'package:foxxi/models/feed_post_model.dart';
import 'package:foxxi/services/post_service.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';

import 'package:foxxi/like_animation.dart';
import 'dart:developer' as dev;
import '../screens/post_screen.dart';

class FeedCard extends StatelessWidget {
  final FeedPostModel post;
  PostService postService = PostService();
  FeedCard({super.key, required this.post});

  // @override
  @override
  Widget build(context) {
    // final userProvider = Provider.of<UserProvider>(context, listen: true);
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => PostCard(
              post: post,
              isImage: post.media?.mediatype == 'image' ? true : false,
              isVideo: post.media?.mediatype == 'video' ? true : false,
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
                borderRadius: BorderRadius.circular(30), color: Colors.white),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(30),
              child: Column(
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
                            backgroundImage:
                                NetworkImage(post.author.image.toString()),
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
                                  post.author.name.toString(),
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  post.author.username.toString(),
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
                                              'Delete',
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
                                                            'Delete Button Pressed',
                                                            name:
                                                                'FeedPostCard Delete button');
                                                        postService.deletePost(
                                                            context: context,
                                                            id: post.id
                                                                .toString());
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
                        post.caption.toString(),
                        style: const TextStyle(
                          color: Colors.black54,
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
                                color: const Color.fromARGB(255, 226, 127, 245)
                                    .withOpacity(0.4),
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
                            color: const Color.fromARGB(255, 226, 127, 245)
                                .withOpacity(0.4),
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
                                    const Padding(
                                      padding: EdgeInsets.all(8.0),
                                      child: Text('Reply',
                                          style: TextStyle(
                                              color: Colors.black,
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
                                                post.author.image.toString()),
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
                                                    post.author.username
                                                        .toString(),
                                                    style: const TextStyle(
                                                      color: Colors.black,
                                                    ),
                                                  ),
                                                ),
                                                const Padding(
                                                  padding: EdgeInsets.only(
                                                      left: 4.0),
                                                  child: Text(
                                                    '@Kuntal27 1',
                                                    style: TextStyle(
                                                      color: Colors.grey,
                                                    ),
                                                  ),
                                                )
                                              ],
                                            ),
                                            const Padding(
                                              padding: EdgeInsets.only(
                                                left: 8,
                                              ),
                                              child: Text(
                                                'Feb 6',
                                                style: TextStyle(
                                                  color: Colors.grey,
                                                ),
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
                              color: const Color.fromARGB(255, 226, 127, 245)
                                  .withOpacity(0.4),
                              size: 30,
                            ),
                            onPressed: () {}),
                        Expanded(
                          child: Align(
                            alignment: Alignment.bottomRight,
                            child: IconButton(
                                iconSize: 40,
                                icon: Icon(
                                  Icons.attach_money_rounded,
                                  color:
                                      const Color.fromARGB(255, 226, 127, 245)
                                          .withOpacity(0.4),
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
                                          const Padding(
                                            padding: EdgeInsets.all(8.0),
                                            child: Text('Donate',
                                                style: TextStyle(
                                                    color: Colors.black,
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
                                                      post.author.image
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
                                                          post.author.username
                                                              .toString(),
                                                          style:
                                                              const TextStyle(
                                                            color: Colors.black,
                                                          ),
                                                        ),
                                                      ),
                                                      Padding(
                                                        padding:
                                                            const EdgeInsets
                                                                    .only(
                                                                left: 4.0),
                                                        child: Text(
                                                          post.author.username
                                                              .toString(),
                                                          style:
                                                              const TextStyle(
                                                            color: Colors.grey,
                                                          ),
                                                        ),
                                                      )
                                                    ],
                                                  ),
                                                  const Padding(
                                                    padding: EdgeInsets.only(
                                                      left: 8,
                                                    ),
                                                    child: Text(
                                                      'Feb 6',
                                                      style: TextStyle(
                                                        color: Colors.grey,
                                                      ),
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
                                                padding:
                                                    EdgeInsets.only(left: 8.0),
                                                child: Text('Your Reply'),
                                              ),
                                            ],
                                          ),
                                          const Padding(
                                            padding: EdgeInsets.all(8),
                                            child: TextField(
                                              decoration: InputDecoration(
                                                border: OutlineInputBorder(),
                                                hintText: 'Enter Token Amount',
                                              ),
                                            ),
                                          )
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
