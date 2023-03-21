// import 'package:flutter/material.dart';
// import 'package:foxxi/models/post.dart';
// import 'package:foxxi/widgets/card.dart';
// import 'package:foxxi/widgets/feed_post_card.dart';

// import '../widgets/story_bar.dart';
// import 'chat_screen.dart';

// class PostHomeScreen extends StatefulWidget {
//   const PostHomeScreen({super.key});

//   @override
//   State<PostHomeScreen> createState() => _PostHomeScreenState();
// }

// class _PostHomeScreenState extends State<PostHomeScreen> {
//   late Future<List<Post>> _post;
//   @override
//   void initState() {
//     _post = Post().getPosts();
//     super.initState();
//   }

//   @override
//   Widget build(BuildContext context) {
//     return FutureBuilder<List<Post>>(
//         future: _post,
//         builder: (context, snapshot) {
//           if (snapshot.hasData) {
//             return Scaffold(
//               // appBar: AppBar(),
//               body: Padding(
//                 padding:
//                     EdgeInsets.only(top: MediaQuery.of(context).padding.top),
//                 child: SingleChildScrollView(
//                   child: Column(
//                     children: [
//                       Row(
//                         mainAxisSize: MainAxisSize.max,
//                         mainAxisAlignment: MainAxisAlignment.end,
//                         children: [
//                           Container(
//                             child: IconButton(
//                               icon: const Icon(
//                                 Icons.send_rounded,
//                                 color: Colors.black,
//                                 size: 30,
//                               ),
//                               onPressed: () {
//                                 Navigator.push(
//                                     context,
//                                     MaterialPageRoute(
//                                         builder: (context) => const Chat()));
//                               },
//                             ),
//                           ),
//                         ],
//                       ),
//                       const StoryBar(),
//                       MediaQuery.removePadding(
//                         context: context,
//                         removeTop: true,
//                         child: ListView.builder(
//                           physics: const ScrollPhysics(),
//                           shrinkWrap: true,
//                           itemCount: snapshot.data!.length,
//                           itemBuilder: ((context, index) {
//                             return const FeedCard();
//                           }),
//                         ),
//                       ),
//                     ],
//                   ),
//                 ),
//               ),
//             );
//           } else {
//             return const CircularProgressIndicator();
//           }
//         });
//   }
// }
