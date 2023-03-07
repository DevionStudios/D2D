// import 'dart:ui';
// import 'package:foxxi/models/comment.dart';
// import 'package:foxxi/widgets/commentCard.dart';
// import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
// import 'package:badges/badges.dart' as badges;
// import 'package:flutter/material.dart';
// import 'package:video_player/video_player.dart';
// import '../models/post.dart';
// import './like_animation.dart';

// // import 'package:flutter_svg/flutter_svg.dart';

// class PostCard extends StatefulWidget {
//   String? name;
//   String? userName;
//   String? date;
//   String? caption;
//   bool? isImage;
//   String? image;
//   bool isVideo;
//   String? video;
//   PostCard(
//       {this.caption,
//       this.date,
//       this.isImage,
//       required this.isVideo,
//       this.name,
//       this.userName,
//       this.image,
//       this.video});
//   // const PostCard({super.key});

//   @override
//   State<PostCard> createState() => _PostCardState();
// }

// class _PostCardState extends State<PostCard> {
//   late VideoPlayerController _controller;
//   @override
//   void initState() {
//     if (widget.isVideo) {
//       _controller = VideoPlayerController.network(widget.video.toString())
//         ..initialize().then((_) {
//           // Ensure the first frame is shown after the video is initialized, even before the play button has been pressed.
//           setState(() {});
//         });
//     }
//     // TODO: implement initState
//     super.initState();
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: Container(
//         padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top),
//         child: SingleChildScrollView(
//           child: Column(
//             mainAxisSize: MainAxisSize.min,
//             children: [
//               Container(
//                 padding: const EdgeInsetsDirectional.fromSTEB(0, 0, 0, 10),
//                 child: Padding(
//                   padding: const EdgeInsetsDirectional.fromSTEB(10, 10, 10, 10),
//                   child: Container(
//                     decoration: BoxDecoration(
//                         borderRadius: BorderRadius.circular(30),
//                         color: Colors.white),
//                     child: ClipRRect(
//                       borderRadius: BorderRadius.circular(30),
//                       child: Column(
//                         crossAxisAlignment: CrossAxisAlignment.start,
//                         mainAxisSize: MainAxisSize.min,
//                         children: [
//                           Container(
//                             padding: const EdgeInsets.symmetric(
//                               vertical: 4,
//                               horizontal: 16,
//                             ).copyWith(right: 0),
//                             child: Row(
//                               children: <Widget>[
//                                 Card(
//                                   shape: const CircleBorder(),
//                                   elevation: 5,
//                                   child: CircleAvatar(
//                                     radius: 16,
//                                     backgroundImage:
//                                         NetworkImage(Posts[1].image.toString()),
//                                   ),
//                                 ),
//                                 Expanded(
//                                   child: Padding(
//                                     padding: const EdgeInsets.only(
//                                       left: 8,
//                                     ),
//                                     child: Column(
//                                       mainAxisSize: MainAxisSize.min,
//                                       crossAxisAlignment:
//                                           CrossAxisAlignment.start,
//                                       children: <Widget>[
//                                         Text(
//                                           Posts[1].userName.toString(),
//                                           style: const TextStyle(
//                                             fontWeight: FontWeight.bold,
//                                           ),
//                                         ),
//                                         const Text(
//                                           '@Kuntal271',
//                                           style: TextStyle(color: Colors.grey),
//                                         )
//                                       ],
//                                     ),
//                                   ),
//                                 ),
//                                 true
//                                     ? IconButton(
//                                         onPressed: () {
//                                           showDialog(
//                                             useRootNavigator: false,
//                                             context: context,
//                                             builder: (context) {
//                                               return Dialog(
//                                                 child: ListView(
//                                                     padding: const EdgeInsets
//                                                             .symmetric(
//                                                         vertical: 16),
//                                                     shrinkWrap: true,
//                                                     children: [
//                                                       'Delete',
//                                                     ]
//                                                         .map(
//                                                           (e) => InkWell(
//                                                               child: Container(
//                                                                 padding: const EdgeInsets
//                                                                         .symmetric(
//                                                                     vertical:
//                                                                         12,
//                                                                     horizontal:
//                                                                         16),
//                                                                 child: Text(e),
//                                                               ),
//                                                               onTap: () {
//                                                                 // deletePost(
//                                                                 //   widget.snap['postId']
//                                                                 //       .toString(),
//                                                                 // );
//                                                                 // remove the dialog box
//                                                                 // Navigator.of(context).pop();
//                                                               }),
//                                                         )
//                                                         .toList()),
//                                               );
//                                             },
//                                           );
//                                         },
//                                         icon: const Icon(Icons.more_vert),
//                                       )
//                                     : Container(),
//                               ],
//                             ),
//                           ),
//                           // IMAGE SECTION OF THE POST
//                           // GestureDetector(
//                           //   onDoubleTap: () {
//                           //     // FireStoreMethods().likePost(
//                           //     //   widget.snap['postId'].toString(),
//                           //     //   user.uid,
//                           //     //   widget.snap['likes'],
//                           //     // );
//                           //     setState(() {
//                           //       isLikeAnimating = true;
//                           //     });
//                           //   },
//                           Padding(
//                             padding: const EdgeInsets.all(8.0),
//                             child: Text(widget.caption.toString()),
//                           ),
//                           widget.isImage!
//                               ? Container(
//                                   height: 400,
//                                   width: MediaQuery.of(context).size.width - 20,
//                                   decoration: BoxDecoration(
//                                     borderRadius: const BorderRadius.all(
//                                         Radius.circular(30)),
//                                     // border: Border(
//                                     //     bottom: BorderSide(color: Colors.black.withOpacity(1))),
//                                     image: DecorationImage(
//                                       image:
//                                           NetworkImage(widget.image.toString()),
//                                       fit: BoxFit.cover,
//                                     ),
//                                   ),
//                                   child: Column(
//                                     mainAxisSize: MainAxisSize.max,
//                                     mainAxisAlignment: MainAxisAlignment.end,
//                                     children: [
//                                       ClipRRect(
//                                         borderRadius: const BorderRadius.only(
//                                             bottomLeft: Radius.circular(30),
//                                             bottomRight: Radius.circular(30)),
//                                         child: BackdropFilter(
//                                           filter: ImageFilter.blur(
//                                             sigmaX: 3,
//                                             sigmaY: 3,
//                                           ),
//                                           child: Container(
//                                             width: MediaQuery.of(context)
//                                                     .size
//                                                     .width -
//                                                 20,
//                                             height: 50,
//                                             decoration: BoxDecoration(
//                                               borderRadius:
//                                                   const BorderRadius.only(
//                                                       bottomLeft:
//                                                           Radius.circular(30),
//                                                       bottomRight:
//                                                           Radius.circular(30)),
//                                               gradient: LinearGradient(
//                                                 colors: [
//                                                   Colors.lightBlue.shade100
//                                                       .withOpacity(0.4),
//                                                   Colors.purpleAccent.shade100
//                                                       .withOpacity(0.4),
//                                                 ],
//                                                 stops: const [0, 1],
//                                                 begin:
//                                                     const AlignmentDirectional(
//                                                         1, 0),
//                                                 end: const AlignmentDirectional(
//                                                     -1, 0),
//                                                 // color: Colors.purpleAccent.shade100.withOpacity(
//                                                 // 0.3,
//                                               ),
//                                             ),
//                                             child: Row(
//                                               // mainAxisAlignment: MainAxisAlignment.end,
//                                               crossAxisAlignment:
//                                                   CrossAxisAlignment.end,
//                                               children: <Widget>[
//                                                 LikeAnimation(
//                                                     isAnimating: true,
//                                                     smallLike: true,
//                                                     child: IconButton(
//                                                       icon: badges.Badge(
//                                                         badgeStyle: const badges
//                                                                 .BadgeStyle(
//                                                             badgeColor:
//                                                                 Color.fromARGB(
//                                                                     255,
//                                                                     244,
//                                                                     179,
//                                                                     254)),
//                                                         badgeContent:
//                                                             const Text('0'),
//                                                         child: Icon(
//                                                           Icons
//                                                               .favorite_rounded,
//                                                           size: 30,
//                                                           color: const Color
//                                                                       .fromARGB(
//                                                                   255,
//                                                                   244,
//                                                                   204,
//                                                                   250)
//                                                               .withOpacity(0.7),
//                                                         ),
//                                                       ),
//                                                       onPressed: () {},
//                                                     )

//                                                     // color: Colors.grey.shade500,
//                                                     // size: 50,

//                                                     // color: ,

//                                                     // ignore: dead_code
//                                                     // : const Icon(
//                                                     //     Icons.favorite_border,
//                                                     //   ),
//                                                     // onPressed: () => FireStoreMethods().likePost(
//                                                     //   widget.snap['postId'].toString(),
//                                                     //   user.uid,
//                                                     //   widget.snap['likes'],
//                                                     // ),
//                                                     // onPressed: () {},
//                                                     ),
//                                                 IconButton(
//                                                   icon: badges.Badge(
//                                                     badgeStyle:
//                                                         const badges.BadgeStyle(
//                                                             badgeColor:
//                                                                 Color.fromARGB(
//                                                                     255,
//                                                                     244,
//                                                                     179,
//                                                                     254)),
//                                                     badgeContent:
//                                                         const Text('0'),
//                                                     child: Icon(
//                                                       Icons.comment_rounded,
//                                                       color:
//                                                           const Color.fromARGB(
//                                                                   255,
//                                                                   244,
//                                                                   204,
//                                                                   250)
//                                                               .withOpacity(0.7),
//                                                       size: 30,
//                                                     ),
//                                                     // onPressed: () => Navigator.of(context).push(
//                                                     //   MaterialPageRoute(
//                                                     //     builder: (context) => CommentsScreen(
//                                                     //       postId: widget.snap['postId'].toString(),
//                                                     //     ),
//                                                     //   ),
//                                                     // ),
//                                                   ),
//                                                   onPressed: () {},
//                                                 ),
//                                                 IconButton(
//                                                     icon: Icon(
//                                                       Icons.send_rounded,
//                                                       color:
//                                                           const Color.fromARGB(
//                                                                   255,
//                                                                   244,
//                                                                   204,
//                                                                   250)
//                                                               .withOpacity(0.7),
//                                                       size: 30,
//                                                     ),
//                                                     onPressed: () {}),
//                                               ],
//                                             ),
//                                           ),
//                                         ),
//                                       ),
//                                     ],
//                                   ),
//                                 )
//                               : Container(
//                                   height: 400,
//                                   width: MediaQuery.of(context).size.width - 20,
//                                   decoration: const BoxDecoration(
//                                     borderRadius:
//                                         BorderRadius.all(Radius.circular(30)),
//                                     // border: Border(
//                                     //     bottom: BorderSide(color: Colors.black.withOpacity(1))),
//                                   ),
//                                   child: Column(
//                                     mainAxisSize: MainAxisSize.max,
//                                     mainAxisAlignment: MainAxisAlignment.end,
//                                     children: [
//                                       Stack(
//                                         children: [
//                                           _controller.value.isInitialized
//                                               ? Container(
//                                                   decoration:
//                                                       const BoxDecoration(
//                                                           borderRadius:
//                                                               BorderRadius.all(
//                                                                   Radius
//                                                                       .circular(
//                                                                           30))),
//                                                   height: 330,
//                                                   width: 400,
//                                                   child:
//                                                       VideoPlayer(_controller))
//                                               : Container(),
//                                           Positioned(
//                                             top: 270,
//                                             left: 10,
//                                             child: FloatingActionButton(
//                                               onPressed: () {
//                                                 setState(
//                                                   () {
//                                                     _controller.value.isPlaying
//                                                         ? _controller.pause()
//                                                         : _controller.play();
//                                                   },
//                                                 );
//                                               },
//                                               child: Icon(
//                                                 _controller.value.isPlaying
//                                                     ? Icons.pause
//                                                     : Icons.play_arrow,
//                                               ),
//                                             ),
//                                           ),
//                                         ],
//                                       ),
//                                       ClipRRect(
//                                         borderRadius: const BorderRadius.only(
//                                             bottomLeft: Radius.circular(30),
//                                             bottomRight: Radius.circular(30)),
//                                         child: BackdropFilter(
//                                           filter: ImageFilter.blur(
//                                             sigmaX: 3,
//                                             sigmaY: 3,
//                                           ),
//                                           child: Container(
//                                             width: MediaQuery.of(context)
//                                                     .size
//                                                     .width -
//                                                 20,
//                                             height: 50,
//                                             decoration: BoxDecoration(
//                                               borderRadius:
//                                                   const BorderRadius.only(
//                                                       bottomLeft:
//                                                           Radius.circular(30),
//                                                       bottomRight:
//                                                           Radius.circular(30)),
//                                               gradient: LinearGradient(
//                                                 colors: [
//                                                   Colors.lightBlue.shade100
//                                                       .withOpacity(0.4),
//                                                   Colors.purpleAccent.shade100
//                                                       .withOpacity(0.4),
//                                                 ],
//                                                 stops: const [0, 1],
//                                                 begin:
//                                                     const AlignmentDirectional(
//                                                         1, 0),
//                                                 end: const AlignmentDirectional(
//                                                     -1, 0),
//                                                 // color: Colors.purpleAccent.shade100.withOpacity(
//                                                 // 0.3,
//                                               ),
//                                             ),
//                                             child: Row(
//                                               // mainAxisAlignment: MainAxisAlignment.end,
//                                               crossAxisAlignment:
//                                                   CrossAxisAlignment.end,
//                                               children: <Widget>[
//                                                 LikeAnimation(
//                                                     isAnimating: true,
//                                                     smallLike: true,
//                                                     child: IconButton(
//                                                       icon: badges.Badge(
//                                                         badgeStyle: const badges
//                                                                 .BadgeStyle(
//                                                             badgeColor:
//                                                                 Color.fromARGB(
//                                                                     255,
//                                                                     244,
//                                                                     179,
//                                                                     254)),
//                                                         badgeContent:
//                                                             const Text('0'),
//                                                         child: Icon(
//                                                           Icons
//                                                               .favorite_rounded,
//                                                           size: 30,
//                                                           color: const Color
//                                                                       .fromARGB(
//                                                                   255,
//                                                                   244,
//                                                                   204,
//                                                                   250)
//                                                               .withOpacity(0.7),
//                                                         ),
//                                                       ),
//                                                       onPressed: () {},
//                                                     )

//                                                     // color: Colors.grey.shade500,
//                                                     // size: 50,

//                                                     // color: ,

//                                                     // ignore: dead_code
//                                                     // : const Icon(
//                                                     //     Icons.favorite_border,
//                                                     //   ),
//                                                     // onPressed: () => FireStoreMethods().likePost(
//                                                     //   widget.snap['postId'].toString(),
//                                                     //   user.uid,
//                                                     //   widget.snap['likes'],
//                                                     // ),
//                                                     // onPressed: () {},
//                                                     ),
//                                                 IconButton(
//                                                   icon: badges.Badge(
//                                                     badgeStyle:
//                                                         const badges.BadgeStyle(
//                                                             badgeColor:
//                                                                 Color.fromARGB(
//                                                                     255,
//                                                                     244,
//                                                                     179,
//                                                                     254)),
//                                                     badgeContent:
//                                                         const Text('0'),
//                                                     child: Icon(
//                                                       Icons.comment_rounded,
//                                                       color:
//                                                           const Color.fromARGB(
//                                                                   255,
//                                                                   244,
//                                                                   204,
//                                                                   250)
//                                                               .withOpacity(0.7),
//                                                       size: 30,
//                                                     ),
//                                                     // onPressed: () => Navigator.of(context).push(
//                                                     //   MaterialPageRoute(
//                                                     //     builder: (context) => CommentsScreen(
//                                                     //       postId: widget.snap['postId'].toString(),
//                                                     //     ),
//                                                     //   ),
//                                                     // ),
//                                                   ),
//                                                   onPressed: () {},
//                                                 ),
//                                                 IconButton(
//                                                     icon: Icon(
//                                                       Icons.send_rounded,
//                                                       color:
//                                                           const Color.fromARGB(
//                                                                   255,
//                                                                   244,
//                                                                   204,
//                                                                   250)
//                                                               .withOpacity(0.7),
//                                                       size: 30,
//                                                     ),
//                                                     onPressed: () {}),
//                                               ],
//                                             ),
//                                           ),
//                                         ),
//                                       ),
//                                     ],
//                                   ),
//                                 ),
//                         ],
//                       ),
//                     ),
//                   ),
//                 ),
//               ),
//               Container(
//                 child: Column(
//                   children: [
//                     Row(
//                       mainAxisAlignment: MainAxisAlignment.start,
//                       children: const [
//                         Padding(
//                           padding: EdgeInsets.all(8.0),
//                           child: Text(
//                             'Your Reply',
//                             style: TextStyle(
//                                 fontFamily: 'InstagramSans',
//                                 color: Colors.black,
//                                 fontSize: 20),
//                           ),
//                         ),
//                       ],
//                     ),
//                     const Padding(
//                       padding: EdgeInsets.only(left: 15.0, right: 15.0),
//                       child: TextField(
//                         scrollPadding: EdgeInsets.all(100.0),
//                         decoration: InputDecoration(
//                           border: OutlineInputBorder(),
//                           hintText: 'An Interesting Reply',
//                         ),
//                       ),
//                     ),
//                     Row(
//                       mainAxisAlignment: MainAxisAlignment.end,
//                       children: [
//                         Padding(
//                           padding: const EdgeInsets.only(left: 10, right: 10),
//                           child: ElevatedButton(
//                             style: ButtonStyle(
//                               foregroundColor: MaterialStateProperty.all<Color>(
//                                   Colors.white),
//                               backgroundColor:
//                                   MaterialStateProperty.all<Color>(Colors.blue),
//                             ),
//                             onPressed: () {},
//                             child: const Text('Reply'),
//                           ),
//                         ),
//                         Padding(
//                           padding: const EdgeInsets.only(left: 10, right: 10),
//                           child: TextButton(
//                             style: ButtonStyle(
//                               foregroundColor: MaterialStateProperty.all<Color>(
//                                   Colors.white),
//                               backgroundColor: MaterialStateProperty.all<Color>(
//                                   Colors.blue.shade400),
//                             ),
//                             onPressed: () {},
//                             child: const Text(
//                               'Cancel',
//                               // style: TextStyle(color: Colors.grey),
//                             ),
//                           ),
//                         )
//                       ],
//                     ),
//                     Column(
//                       crossAxisAlignment: CrossAxisAlignment.start,
//                       mainAxisAlignment: MainAxisAlignment.start,
//                       children: [
//                         const Padding(
//                           padding: EdgeInsets.all(8.0),
//                           child: Text(
//                             'Comments',
//                             style: TextStyle(
//                                 fontFamily: 'InstagramSans',
//                                 color: Colors.black,
//                                 fontSize: 20),
//                           ),
//                         ),
//                         MediaQuery.removePadding(
//                           context: context,
//                           removeTop: true,
//                           child: ListView.builder(
//                             // scrollDirection: Axis.vertical,
//                             shrinkWrap: true,
//                             physics: const NeverScrollableScrollPhysics(),
//                             itemCount: comments.length,
//                             itemBuilder: (context, index) {
//                               return Column(
//                                 children: const [
//                                   CommentCard(),
//                                   Divider(
//                                     height: 2,
//                                   ),
//                                 ],
//                               );
//                             },
//                           ),
//                         ),
//                       ],
//                     )
//                   ],
//                 ),
//               )
//             ],
//           ),
//         ),
//       ),
//     );
//     // );
//     // );
//     // );

//     // LIKE, COMMENT SECTION OF THE POST
//     // Row(
//     //   children: <Widget>[
//     //     LikeAnimation(
//     //       isAnimating: true,
//     //       smallLike: true,
//     //       child: IconButton(
//     //         icon: true
//     //             ? const Icon(
//     //                 Icons.favorite,
//     //                 color: Colors.red,
//     //               )
//     //             : const Icon(
//     //                 Icons.favorite_border,
//     //               ),
//     //         // onPressed: () => FireStoreMethods().likePost(
//     //         //   widget.snap['postId'].toString(),
//     //         //   user.uid,
//     //         //   widget.snap['likes'],
//     //         // ),
//     //         onPressed: () {},
//     //       ),
//     //     ),
//     //     IconButton(
//     //       icon: const Icon(
//     //         Icons.comment_outlined,
//     //       ),
//     //       // onPressed: () => Navigator.of(context).push(
//     //       //   MaterialPageRoute(
//     //       //     builder: (context) => CommentsScreen(
//     //       //       postId: widget.snap['postId'].toString(),
//     //       //     ),
//     //       //   ),
//     //       // ),
//     //       onPressed: () {},
//     //     ),
//     //     IconButton(
//     //         icon: const Icon(
//     //           Icons.send,
//     //         ),
//     //         onPressed: () {}),
//     //     Expanded(
//     //         child: Align(
//     //       alignment: Alignment.bottomRight,
//     //       child: IconButton(
//     //           icon: const Icon(Icons.bookmark_border), onPressed: () {}),
//     //     ))
//     //   ],
//     // ),
//     //DESCRIPTION AND NUMBER OF COMMENTS
//     // Container(
//     //   padding: const EdgeInsets.symmetric(horizontal: 16),
//     //   child: Column(
//     //       mainAxisSize: MainAxisSize.min,
//     //       crossAxisAlignment: CrossAxisAlignment.start,
//     //       children: <Widget>[
//     //         DefaultTextStyle(
//     //             style: Theme.of(context)
//     //                 .textTheme
//     //                 .subtitle2!
//     //                 .copyWith(fontWeight: FontWeight.w800),
//     //             child: Text(
//     //               // '${widget.snap['likes'].length} likes',
//     //               '0 Likes',
//     //               style: Theme.of(context).textTheme.bodyText2,
//     //             )),
//     //         Container(
//     //           width: double.infinity,
//     //           padding: const EdgeInsets.only(
//     //             top: 8,
//     //           ),
//     //           child: RichText(
//     //             text: TextSpan(
//     //               style: const TextStyle(color: Colors.black),
//     //               children: [
//     //                 TextSpan(
//     //                   // text: widget.snap['username'].toString(),
//     //                   text: Posts[1].userName,
//     //                   style: const TextStyle(
//     //                     fontWeight: FontWeight.bold,
//     //                   ),
//     //                 ),
//     //                 const TextSpan(
//     //                   text: 'Test Description',
//     //                 ),
//     //               ],
//     //             ),
//     //           ),
//     //         ),
//     //         InkWell(
//     //           child: Container(
//     //             child: Text(
//     //               'View all $commentLen comments',
//     //               style: const TextStyle(
//     //                 fontSize: 16,
//     //                 color: Colors.white,
//     //               ),
//     //             ),
//     //             padding: const EdgeInsets.symmetric(vertical: 4),
//     //           ),
//     //           // onTap: () => Navigator.of(context).push(
//     //           //   MaterialPageRoute(
//     //           //     builder: (context) => CommentsScreen(
//     //           //       // postId: widget.snap['postId'].toString(),
//     //           //     ),
//     //           onTap: () {},
//     //         ),
//     //       ]),
//     // ),
//     // Container(
//     //   child: Text(
//     //     DateFormat.yMMMd()
//     //         .format(widget.snap['datePublished'].toDate()),
//     //     style: const TextStyle(
//     //       color: secondaryColor,
//     //     ),
//     //   ),
//     //   padding: const EdgeInsets.symmetric(vertical: 4),
//     // ),

//     // Stack(alignment: Alignment.bottomCenter, children: [
//     //   Container(
//     //     // color: Colors.cyan,
//     //     height: 45,
//     //     decoration: BoxDecoration(
//     //       // backgroundBlendMode: BlendMode.modulate,
//     //       color: Colors.white70.withOpacity(0.65),
//     //       borderRadius: const BorderRadius.only(
//     //           bottomLeft: Radius.circular(30),
//     //           bottomRight: (Radius.circular(30))),
//     //     ),
//     //   ),
//   }
// }


