import 'package:animated_notch_bottom_bar/animated_notch_bottom_bar/animated_notch_bottom_bar.dart';
import 'package:flutter/material.dart';
import 'package:foxxi/screens/mint_NFT.dart';
// import 'package:foxxi/screens/news_screen.dart';
// // import 'package:flutter_svg/flutter_svg.dart';
// import 'package:foxxi/screens/profile_screen.dart';
// import 'package:bottom_bar_with_sheet/bottom_bar_with_sheet.dart';
// import 'package:foxxi/widgets/add_post.dart';
// import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
// import 'package:foxxi/screens/chat_screen.dart';
// import 'package:foxxi/screens/post_Home_Screen.dart';
import 'package:foxxi/screens/profile_settings.dart';
// import 'package:foxxi/screens/profile_screen.dart';

class BottomNavBar2 extends StatefulWidget {
  const BottomNavBar2({Key? key}) : super(key: key);

  @override
  State<BottomNavBar2> createState() => _bottomNavBar2State();
}

class _bottomNavBar2State extends State<BottomNavBar2> {
  final _pageController = PageController(initialPage: 0);

  int maxCount = 4;

  /// widget list
  final List<Widget> bottomBarPages = [ProfileSettings(), mintNFT()];

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
              bottomBarItems: const [
                BottomBarItem(
                  inActiveItem: Icon(
                    Icons.settings,
                    color: Colors.blueGrey,
                  ),
                  activeItem: Icon(
                    Icons.settings,
                    color: Colors.blueAccent,
                  ),
                ),

                BottomBarItem(
                  inActiveItem: Icon(
                    Icons.photo_album_rounded,
                    color: Colors.blueGrey,
                  ),
                  activeItem: Icon(
                    Icons.photo_album_rounded,
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
                  curve: Curves.easeInOutSine,
                );
              },
            )
          : null,
    );
  }
}
