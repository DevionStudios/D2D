import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:foxxi/screens/profile_screen.dart';
import 'package:foxxi/screens/trending_posts_screen.dart';
import 'package:foxxi/services/auth_service.dart';
import 'package:foxxi/screens/feed_screen.dart';
import 'package:foxxi/routing_constants.dart';
import 'package:foxxi/services/post_service.dart';
import 'package:foxxi/services/story_service.dart';

class MainScreen extends StatefulWidget {
  static const String routeName = mainScreenRoute;

  const MainScreen({Key? key}) : super(key: key);

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  AuthService authService = AuthService();
  PostService postService = PostService();
  StoryService storyService = StoryService();
  late PageController pageController;
  int _page = 0;

  @override
  void initState() {
    // getCurrentUser();
    pageController = PageController();
    getData();
    super.initState();
  }

  void getData() {
    authService.getCurrentUser(context: context);
    postService.getAllPost(context: context);
    postService.getTrendingPosts(context: context);
    storyService.getFollowingUserStories(context: context);
  }

  @override
  void dispose() {
    pageController.dispose();
    super.dispose();
  }

  void navigationTapped(int page) {
    pageController.jumpToPage(page);
  }

  void onPageChanged(int page) {
    setState(() {
      _page = page;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color.fromARGB(255, 210, 210, 210),
      body: PageView(
        onPageChanged: onPageChanged,
        physics: const NeverScrollableScrollPhysics(),
        controller: pageController,
        children: [
          FeedScreen(),
          // TrendingPostScreen(),
          const ProfileWidget(),
        ],
      ),
      bottomNavigationBar: CupertinoTabBar(
        items: [
          BottomNavigationBarItem(
              icon: Icon(
                Icons.home,
                color: _page == 0 ? Colors.black : Colors.grey,
              ),
              label: ''),
          BottomNavigationBarItem(
              icon: Icon(
                Icons.search,
                color: _page == 1 ? Colors.black : Colors.grey,
              ),
              label: ''),
          BottomNavigationBarItem(
              icon: Icon(
                Icons.add,
                color: _page == 2 ? Colors.black : Colors.grey,
              ),
              label: ''),
          BottomNavigationBarItem(
              icon: Icon(
                Icons.trending_up_sharp,
                color: _page == 3 ? Colors.black : Colors.grey,
              ),
              label: ''),
          BottomNavigationBarItem(
              icon: Icon(
                Icons.newspaper,
                color: _page == 4 ? Colors.black : Colors.grey,
              ),
              label: ''),
        ],
        onTap: navigationTapped,
      ),
    );
  }
}
