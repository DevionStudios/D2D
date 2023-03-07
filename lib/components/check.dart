import 'package:animated_notch_bottom_bar/animated_notch_bottom_bar/animated_notch_bottom_bar.dart';
import 'package:flutter/material.dart';
import 'package:foxxi/routing_constants.dart';
import 'package:foxxi/screens/feed_screen.dart';
import 'package:foxxi/screens/news_screen.dart';
// import 'package:flutter_svg/flutter_svg.dart';
import 'package:foxxi/screens/profile_screen.dart';
import 'package:foxxi/services/auth_service.dart';
import 'package:foxxi/services/message_service.dart';
import 'package:foxxi/services/post_service.dart';
import 'package:foxxi/services/story_service.dart';
import 'package:foxxi/widgets/add_post.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';

import '../screens/mint_NFT.dart';
import '../screens/wallet_screen.dart';

class BottomNavBar extends StatefulWidget {
  const BottomNavBar({Key? key}) : super(key: key);

  static const String routeName = bottomNavBarScreenRoute;

  @override
  State<BottomNavBar> createState() => _BottomNavBar();
}

class _BottomNavBar extends State<BottomNavBar> {
  final _pageController = PageController(initialPage: 0);
  AuthService authService = AuthService();
  PostService postService = PostService();
  StoryService storyService = StoryService();
  MessageService messageService = MessageService();

  int maxCount = 5;

  /// widget list
  final List<Widget> bottomBarPages = [
    FeedScreen(),
    const SizedBox.shrink(),
    NewsScreen(),
    const ProfileWidget(),
    mintNFT(),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    getData();
    super.initState();
  }

  void getData() {
    authService.getCurrentUser(context: context);
    postService.getAllPost(context: context);
    postService.getTrendingPosts(context: context);
    storyService.getFollowingUserStories(context: context);
    messageService.getAssociatedUsers();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(),
        children: List.generate(bottomBarPages.length, (index) {
          {
            return bottomBarPages[index];
          }
        }),
      ),
      extendBody: true,
      bottomNavigationBar: (bottomBarPages.length <= maxCount)
          ? AnimatedNotchBottomBar(
              pageController: _pageController,
              color: Colors.white,
              showLabel: false,
              notchColor: Colors.white,
              bottomBarItems: [
                const BottomBarItem(
                  inActiveItem: Icon(
                    Icons.home_rounded,
                    color: Colors.blueGrey,
                  ),
                  activeItem: Icon(
                    Icons.home_rounded,
                    color: Colors.blueAccent,
                  ),
                ),
                BottomBarItem(
                  inActiveItem: IconButton(
                    padding: const EdgeInsets.all(0),
                    onPressed: () {
                      showMaterialModalBottomSheet(
                          shape: RoundedRectangleBorder(
                              side: BorderSide(
                                  width: 1.0, color: Colors.lightBlue.shade50),
                              borderRadius: const BorderRadius.vertical(
                                  top: Radius.circular(25))),
                          context: context,
                          builder: (context) => SizedBox(
                                  child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Padding(
                                    padding: EdgeInsets.symmetric(
                                        horizontal: 8.0, vertical: 20),
                                    child: Text(
                                      'Upload Post',
                                      style: TextStyle(
                                          fontFamily: 'InstagramSans',
                                          fontSize: 20),
                                    ),
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.all(8.0),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.max,
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceEvenly,
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.all(10),
                                          decoration: BoxDecoration(
                                              borderRadius:
                                                  const BorderRadius.all(
                                                      Radius.circular(30)),
                                              border: Border.all(
                                                  width: 5,
                                                  color: Colors
                                                      .purpleAccent.shade100
                                                      .withOpacity(0.5))),
                                          child: Column(
                                            mainAxisSize: MainAxisSize.min,
                                            mainAxisAlignment:
                                                MainAxisAlignment.center,
                                            crossAxisAlignment:
                                                CrossAxisAlignment.center,
                                            children: [
                                              IconButton(
                                                onPressed: () {
                                                  Navigator.push(
                                                    context,
                                                    MaterialPageRoute(
                                                      builder: (context) =>
                                                          AddPost(
                                                              IsImage: true),
                                                    ),
                                                  );
                                                },
                                                icon: Icon(
                                                  Icons.photo,
                                                  color:
                                                      Colors.lightBlue.shade100,
                                                  size: 35,
                                                ),
                                              ),
                                              const Text(
                                                'Image',
                                                style: TextStyle(
                                                    fontFamily:
                                                        'InstagramSans'),
                                              ),
                                            ],
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.all(10),
                                          decoration: BoxDecoration(
                                              borderRadius:
                                                  const BorderRadius.all(
                                                      Radius.circular(30)),
                                              border: Border.all(
                                                  width: 5,
                                                  color: Colors
                                                      .purpleAccent.shade100
                                                      .withOpacity(0.5))),
                                          child: Column(
                                            mainAxisSize: MainAxisSize.min,
                                            mainAxisAlignment:
                                                MainAxisAlignment.center,
                                            crossAxisAlignment:
                                                CrossAxisAlignment.center,
                                            children: [
                                              IconButton(
                                                onPressed: () {
                                                  Navigator.push(
                                                    context,
                                                    MaterialPageRoute(
                                                      builder: (context) =>
                                                          AddPost(
                                                              IsImage: false),
                                                    ),
                                                  );
                                                },
                                                icon: Icon(
                                                  Icons
                                                      .video_collection_rounded,
                                                  color:
                                                      Colors.lightBlue.shade100,
                                                  size: 35,
                                                ),
                                              ),
                                              const Text(
                                                'Video',
                                                style: TextStyle(
                                                    fontFamily:
                                                        'InstagramSans'),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  )
                                ],
                              )));
                    },
                    icon: const Icon(Icons.add),
                    color: Colors.blueGrey,
                  ),
                  activeItem: const Icon(
                    Icons.add,
                    color: Colors.blueAccent,
                  ),
                  itemLabel: 'Page 1',
                ),

                const BottomBarItem(
                  inActiveItem: Icon(
                    Icons.newspaper_rounded,
                    color: Colors.blueGrey,
                  ),
                  activeItem: Icon(
                    Icons.newspaper_rounded,
                    color: Colors.blueAccent,
                  ),
                  itemLabel: 'Page 2',
                ),
                const BottomBarItem(
                  inActiveItem: Icon(
                    Icons.account_circle_outlined,
                    color: Colors.blueGrey,
                  ),
                  activeItem: Icon(
                    Icons.account_circle,
                    color: Colors.blueAccent,
                  ),
                  itemLabel: 'Page 1',
                ),
                const BottomBarItem(
                  inActiveItem: Icon(
                    Icons.settings,
                    color: Colors.blueGrey,
                  ),
                  activeItem: Icon(
                    Icons.settings,
                    color: Colors.blueAccent,
                  ),
                  itemLabel: 'Page 1',
                )

                ///svg example
                // BottomBarItem(
                //   inActiveItem: SvgPicture.asset(
                //     'assets/search_icon.svg',
                //     color: Colors.blueGrey,
                //   ),
                //   activeItem: SvgPicture.asset(
                //     'assets/search_icon.svg',
                //     color: Colors.white,
                //   ),
                //   itemLabel: 'Page 3',
                // ),
                // const BottomBarItem(
                //   inActiveItem: Icon(
                //     Icons.settings,
                //     color: Colors.blueGrey,
                //   ),
                //   activeItem: Icon(
                //     Icons.settings,
                //     color: Colors.pink,
                //   ),
                //   itemLabel: 'Page 4',
                // ),
                // const BottomBarItem(
                //   inActiveItem: Icon(
                //     Icons.person,
                //     color: Colors.blueGrey,
                //   ),
                //   activeItem: Icon(
                //     Icons.person,
                //     color: Colors.yellow,
                //   ),
                //   itemLabel: 'Page 5',
                // ),
              ],
              onTap: (index) {
                /// control your animation using page controller
                _pageController.animateToPage(
                  index,
                  duration: const Duration(milliseconds: 300),
                  curve: Curves.easeIn,
                );
              },
            )
          : null,
    );
  }
}
