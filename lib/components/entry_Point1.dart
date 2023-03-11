import 'package:animated_notch_bottom_bar/animated_notch_bottom_bar/animated_notch_bottom_bar.dart';
import 'package:flutter/material.dart';
import 'package:foxxi/providers/theme_provider.dart';
import 'package:foxxi/providers/user_provider.dart';
import 'package:foxxi/screens/chatbot_screen.dart';
import 'package:foxxi/screens/news_screen.dart';
// import 'package:flutter_svg/flutter_svg.dart';

import 'package:foxxi/widgets/add_post.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
import '../screens/feed_screen.dart';
import '../screens/profile_screen.dart';
import 'package:provider/provider.dart';
import 'package:foxxi/routing_constants.dart';

class BottomNavBar extends StatefulWidget {
  const BottomNavBar({Key? key}) : super(key: key);
  static const String routeName = bottomNavBarScreenRoute;
  @override
  State<BottomNavBar> createState() => _BottomNavBarState();
}

class _BottomNavBarState extends State<BottomNavBar> {
  final _pageController = PageController(initialPage: 0);

  int maxCount = 5;

  /// widget list

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context, listen: true).user;

    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;

    final List<Widget> bottomBarPages = [
      FeedScreen(),
      const SizedBox.shrink(),
      const ChatBotScreen(),
      ProfileWidget(
        user: userProvider,
        isMe: true,
      ),
      NewsScreen(),
    ];
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
              color: isDark ? Colors.black : Colors.white,
              notchColor: isDark ? Colors.black54 : Colors.white,
              showLabel: false,
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
                                          margin: const EdgeInsets.all(8),
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
                                          margin: const EdgeInsets.all(8),
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
                    Icons.connect_without_contact_rounded,
                    color: Colors.blueGrey,
                  ),
                  activeItem: Icon(
                    Icons.connect_without_contact_rounded,
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
                    Icons.newspaper_rounded,
                    color: Colors.blueGrey,
                  ),
                  activeItem: Icon(
                    Icons.newspaper_rounded,
                    color: Colors.blueAccent,
                  ),
                  itemLabel: 'Page 2',
                ),

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
          : CircularProgressIndicator(),
    );
  }
}
