import 'package:flutter/material.dart';
import 'package:foxxi/screens/chat_screen.dart';
import 'package:foxxi/screens/foxxi_trends.dart';
import 'package:foxxi/screens/notification_screen.dart';
import 'package:foxxi/screens/search_screen.dart';
import 'package:foxxi/screens/trending_screen.dart';
import 'package:foxxi/screens/your_feed_screen.dart';
import 'package:foxxi/services/notification_service.dart';
import 'package:foxxi/services/post_service.dart';
import 'package:foxxi/services/user_service.dart';
import 'package:foxxi/utils.dart';
import 'dart:developer' as dev;
import 'package:badges/badges.dart' as badges;
// import 'package:foxxi/models/post.dart';
// import 'package:foxxi/widgets/card.dart';
import 'package:foxxi/widgets/feed_post_card.dart';
import 'package:foxxi/widgets/story_bar.dart';
import 'package:provider/provider.dart';
import '../models/feed_post_model.dart';
import '../providers/theme_provider.dart';

class FeedScreen extends StatefulWidget {
  const FeedScreen({Key? key}) : super(key: key);

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  PostService postService = PostService();
  UserService userService = UserService();
  NotificationService notificationService = NotificationService();
  // StoryService storyService = StoryService();
  Future<List<FeedPostModel>>? _post;
  List<dynamic> notificationList = [];
  dynamic notificationLength;

  @override
  void initState() {
    getData();
    fetchData();
    super.initState();
  }

  void fetchData() {
    notificationService.getNotification(context: context).then((value) {
      setState(() {
        notificationList = value;
      });
      // dev.log('Noitfication Data ==---');
      // dev.log(notificationList.toString());
    });
  }

  Future<void> getData() async {
    await Future.delayed(const Duration(seconds: 1));
    if (mounted) {
      setState(() {
        _post = postService.getAllPost(context: context);
      });
      notificationService.getNotification(context: context).then((value) {
        if (mounted) {
          setState(() {
            notificationList = value;
          });
        }
        // dev.log('Noitfication Data ==---');
        // dev.log(notificationList.toString());
      });
    }

    return;
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;
    notificationLength = notificationList.length;

    return FutureBuilder<List<FeedPostModel>>(
        future: _post,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return Scaffold(
              backgroundColor:
                  isDark ? Colors.grey.shade900 : Colors.grey.shade100,
              // appBar: AppBar(),
              body: RefreshIndicator(
                onRefresh: getData,
                child: Padding(
                  padding:
                      EdgeInsets.only(top: MediaQuery.of(context).padding.top),
                  child: SingleChildScrollView(
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            PopupMenuButton<String>(
                              icon: Icon(Icons.arrow_drop_down_outlined,
                                  color: isDark ? Colors.white : Colors.black),
                              onSelected: (selectedTab) {
                                if (selectedTab == 'Foxxi Trends') {
                                  Navigator.pushNamed(
                                      context, FoxxiTrendScreen.routeName);
                                }
                                if (selectedTab == 'Trending') {
                                  Navigator.pushNamed(
                                      context, TrendingScreen.routeName);
                                }

                                if (selectedTab == 'Your Feed') {
                                  Navigator.pushNamed(
                                      context, YourFeedScreen.routeName);
                                }
                              },
                              itemBuilder: (context) {
                                return Items.items
                                    .map((choice) => PopupMenuItem(
                                          value: choice,
                                          child: Row(
                                            children: [
                                              Text(choice),
                                            ],
                                          ),
                                        ))
                                    .toList();
                              },
                            ),
                            Row(
                              mainAxisSize: MainAxisSize.max,
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                Hero(
                                  tag: 'anim_search_bar',
                                  child: IconButton(
                                    onPressed: () {
                                      Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (context) =>
                                                const SearchScreen(),
                                          ));
                                    },
                                    icon: const Icon(Icons.search_outlined),
                                    color: isDark ? Colors.white : Colors.black,
                                  ),
                                ),
                                IconButton(
                                  icon: badges.Badge(
                                    showBadge:
                                        notificationList.isEmpty ? false : true,
                                    badgeStyle: const badges.BadgeStyle(),
                                    badgeAnimation:
                                        const badges.BadgeAnimation.fade(),
                                    badgeContent: notificationList.isEmpty
                                        ? null
                                        : Text(notificationLength.toString()),
                                    child: Icon(
                                      Icons.notifications_none,
                                      color: isDark
                                          ? Colors.grey.shade100
                                          : Colors.grey.shade900,
                                      size: 30,
                                    ),
                                  ),
                                  onPressed: () {
                                    notificationLength = Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                            builder: (context) =>
                                                const NotificationScreen()));
                                  },
                                ),
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
                                              builder: (context) =>
                                                  const Chat()));
                                    },
                                  ),
                                ),
                              ],
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
                                isImage:
                                    snapshot.data![index].media?.mediatype ==
                                            'image'
                                        ? true
                                        : false,
                                isVideo:
                                    snapshot.data![index].media?.mediatype ==
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
              ),
            );
          } else {
            return Scaffold(
                backgroundColor:
                    isDark ? Colors.grey.shade900 : Colors.grey.shade100,
                body: const Center(child: CustomLoader()));
          }
        });
  }
}
