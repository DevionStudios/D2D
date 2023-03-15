import 'package:flutter/material.dart';
import 'package:foxxi/screens/chat_screen.dart';
import 'package:foxxi/services/post_service.dart';
// import 'package:foxxi/models/post.dart';
// import 'package:foxxi/widgets/card.dart';
import 'package:foxxi/widgets/feed_post_card.dart';
import 'package:foxxi/widgets/story_bar.dart';
import 'package:provider/provider.dart';

import '../models/feed_post_model.dart';
import '../providers/theme_provider.dart';

class FeedScreen extends StatefulWidget {
  FeedScreen({Key? key}) : super(key: key);

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  PostService postService = PostService();
  late Future<List<FeedPostModel>> _post;
  @override
  void initState() {
    _post = postService.getAllPost(context: context);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;

    return FutureBuilder<List<FeedPostModel>>(
        future: _post,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return Scaffold(
              backgroundColor:
                  isDark ? Colors.grey.shade900 : Colors.grey.shade100,
              // appBar: AppBar(),
              body: Padding(
                padding:
                    EdgeInsets.only(top: MediaQuery.of(context).padding.top),
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      Row(
                        mainAxisSize: MainAxisSize.max,
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          SizedBox(
                            child: IconButton(
                              icon: Icon(
                                Icons.send_rounded,
                                color: isDark
                                    ? Colors.grey.shade100
                                    : Colors.grey.shade900,
                                size: 30,
                              ),
                              onPressed: () {
                                Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (context) => const Chat()));
                              },
                            ),
                          ),
                        ],
                      ),
                      const StoryBar(),
                      MediaQuery.removePadding(
                        context: context,
                        removeTop: true,
                        child: ListView.builder(
                          physics: const ScrollPhysics(),
                          shrinkWrap: true,
                          itemCount: snapshot.data!.length,
                          itemBuilder: ((context, index) {
                            return FeedCard(
                              post: snapshot.data![index],
                              isImage: snapshot.data![index].media?.mediatype ==
                                      'image'
                                  ? true
                                  : false,
                              isVideo: snapshot.data![index].media?.mediatype ==
                                      'video'
                                  ? true
                                  : false,
                            );
                          }),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          } else {
            return const Center(child: CircularProgressIndicator());
          }
        });
  }
}
