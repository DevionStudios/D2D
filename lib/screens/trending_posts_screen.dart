// import 'package:flutter/material.dart';
// import 'package:foxxi/providers/post_provider.dart';
// import 'package:foxxi/services/auth_service.dart';
// import 'package:foxxi/services/post_service.dart';
// import 'package:foxxi/widgets/feed_post_card.dart';

// import 'package:provider/provider.dart';

// class TrendingPostScreen extends StatefulWidget {
//   TrendingPostScreen({Key? key}) : super(key: key);

//   @override
//   State<TrendingPostScreen> createState() => _FeedScreenState();
// }

// class _FeedScreenState extends State<TrendingPostScreen> {
//   AuthService authService = AuthService();
//   PostService postService = PostService();

//   @override
//   void initState() {
//     super.initState();
//   }

//   @override
//   Widget build(BuildContext context) {
//     final postProvider = Provider.of<PostProvider>(context, listen: true);
//     return Scaffold(
//         appBar: AppBar(
//           elevation: 0,
//           backgroundColor: Colors.white,
//         ),
//         body: postProvider.trendingPostsList.isEmpty
//             ? const Center(child: CircularProgressIndicator())
//             : Consumer<PostProvider>(
//                 builder: (context, post, child) {
//                   return ListView.builder(
//                     itemCount: post.trendingPostsList.length,
//                     itemBuilder: (context, index) {
//                       return FeedCard(post: post.trendingPostsList[index]);
//                     },
//                   );
//                 },
//               ));
//   }
// }
