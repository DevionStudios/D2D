import 'dart:math';
import 'dart:ui';
import 'dart:developer' as dev;
import 'package:flutter/material.dart';
import 'package:foxxi/providers/theme_provider.dart';
import 'package:foxxi/screens/follower_following_screen.dart';
import 'package:foxxi/services/user_service.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';
import 'package:provider/provider.dart';
import 'package:rive/rive.dart';

import 'package:foxxi/models/user.dart';
import 'package:foxxi/providers/user_provider.dart';
import 'package:foxxi/services/post_service.dart';

import '../models/feed_post_model.dart';
import '../widgets/feed_post_card.dart';
import '../widgets/flutter_choice_chips.dart';
import '../widgets/menu_button.dart';
import '../widgets/side_menu.dart';

class ProfileWidget extends StatefulWidget {
  final bool isMe;
  final User user;
  const ProfileWidget({
    Key? key,
    required this.isMe,
    required this.user,
  }) : super(key: key);

  @override
  _ProfileWidgetState createState() => _ProfileWidgetState();
}

class _ProfileWidgetState extends State<ProfileWidget>
    with SingleTickerProviderStateMixin {
  bool isSideBarOpen = false;
  late SMIBool isMenuOpenInput;
  late AnimationController _animationController;
  late Animation<double> scalAnimation;
  late Animation<double> animation;
  Future<List<FeedPostModel>?>? _userPost;
  List<FeedPostModel>? awaitedUserpost;
  final postService = PostService();
  final userService = UserService();
  int statusCodeForFollow = 0;
  bool isFollowed = false;
  String followAndUnfollow = 'Unfollow';

  String? choiceChipsValue;
  final _unfocusNode = FocusNode();
  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void dispose() {
    _animationController.dispose();
    _unfocusNode.dispose();
    super.dispose();
  }

  @override
  void initState() {
    getUserPosts();
    isFollowedByUser();
    _animationController = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 200))
      ..addListener(
        () {
          setState(() {});
        },
      );
    scalAnimation = Tween<double>(begin: 1, end: 0.8).animate(CurvedAnimation(
        parent: _animationController, curve: Curves.fastOutSlowIn));
    animation = Tween<double>(begin: 0, end: 1).animate(CurvedAnimation(
        parent: _animationController, curve: Curves.fastOutSlowIn));
    super.initState();
  }

  void getUserPosts() async {
    if (awaitedUserpost?.length == null) {
      _userPost = postService.getUserPosts(
          context: context, username: widget.user.username.toString());

      awaitedUserpost = await _userPost;
      setState(() {});
    }
  }

  void isFollowedByUser() {
    for (var following
        in Provider.of<UserProvider>(context, listen: false).user.following!) {
      if (following['username'] == widget.user.username) {
        setState(() {
          isFollowed = true;
        });
        break;
      }
    }
  }
// Future<void> refresh (){
//   getUserPosts();
//   isFollowedByUser();

// }
  @override
  Widget build(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;

    final userProvider = Provider.of<UserProvider>(context, listen: true).user;
    return Scaffold(
      extendBody: true,
      resizeToAvoidBottomInset: false,
      backgroundColor: isDark
          ? Colors.grey.shade900
          : const Color.fromARGB(255, 206, 239, 247),
      body: Stack(
        children: [
          AnimatedPositioned(
            width: 288,
            height: MediaQuery.of(context).size.height,
            duration: const Duration(milliseconds: 200),
            curve: Curves.fastOutSlowIn,
            left: isSideBarOpen ? 0 : -288,
            top: 0,
            child: const SideMenu(),
          ),
          Transform(
            alignment: Alignment.center,
            transform: Matrix4.identity()
              ..setEntry(3, 2, 0.001)
              ..rotateY(
                  1 * animation.value - 30 * (animation.value) * pi / 180),
            child: Transform.translate(
              offset: Offset(animation.value * 265, 0),
              child: Transform.scale(
                scale: scalAnimation.value,
                child: ClipRRect(
                  borderRadius: const BorderRadius.all(
                    Radius.circular(24),
                  ),
                  child: GestureDetector(
                    onTap: () =>
                        FocusScope.of(context).requestFocus(_unfocusNode),
                    child: Column(
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        Expanded(
                          child: Stack(
                            children: [
                              Column(
                                mainAxisSize: MainAxisSize.max,
                                children: [
                                  InkWell(
                                    onTap: () async {
                                      await Future.delayed(
                                          const Duration(milliseconds: 1000));
                                    },
                                    child: ClipRRect(
                                      child: BackdropFilter(
                                        filter: ImageFilter.blur(
                                          sigmaX: 2,
                                          sigmaY: 2,
                                        ),
                                        child: Align(
                                          alignment:
                                              const AlignmentDirectional(0, 0),
                                          child: Image.network(
                                            widget.isMe
                                                ? userProvider.coverImage
                                                    .toString()
                                                : widget.user.coverImage
                                                    .toString(),
                                            width: double.infinity,
                                            height: 200,
                                            fit: BoxFit.cover,
                                            loadingBuilder: (context, child,
                                                loadingProgress) {
                                              if (loadingProgress == null) {
                                                return child;
                                              } else {
                                                return const Center(
                                                    child:
                                                        CircularProgressIndicator());
                                              }
                                            },
                                            errorBuilder:
                                                (context, error, stackTrace) {
                                              return Column(
                                                children: const [
                                                  SizedBox(
                                                    height: 40,
                                                  ),
                                                  Center(
                                                      child: Icon(
                                                    Icons.image,
                                                    size: 100,
                                                  ))
                                                ],
                                              );
                                            },
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              ListView(
                                padding: EdgeInsets.zero,
                                scrollDirection: Axis.vertical,
                                children: [
                                  Padding(
                                    padding:
                                        const EdgeInsetsDirectional.fromSTEB(
                                            0, 150, 0, 0),
                                    child: Container(
                                      width: double.infinity,
                                      decoration: BoxDecoration(
                                        color: isDark
                                            ? Colors.grey.shade900
                                            : Colors.white,
                                        borderRadius: const BorderRadius.only(
                                          bottomLeft: Radius.circular(0),
                                          bottomRight: Radius.circular(0),
                                          topLeft: Radius.circular(30),
                                          topRight: Radius.circular(30),
                                        ),
                                      ),
                                      child: Column(
                                        mainAxisSize: MainAxisSize.max,
                                        children: [
                                          Padding(
                                            padding: const EdgeInsetsDirectional
                                                .fromSTEB(20, 20, 20, 0),
                                            child: Row(
                                              mainAxisSize: MainAxisSize.max,
                                              mainAxisAlignment:
                                                  MainAxisAlignment
                                                      .spaceBetween,
                                              children: [
                                                Stack(
                                                  children: [
                                                    Container(
                                                      width: 70,
                                                      height: 70,
                                                      clipBehavior:
                                                          Clip.antiAlias,
                                                      decoration:
                                                          const BoxDecoration(
                                                        shape: BoxShape.circle,
                                                      ),
                                                      child: GestureDetector(
                                                        onTap: () {},
                                                        child: Image.network(
                                                          widget.isMe
                                                              ? userProvider
                                                                  .image
                                                              : widget
                                                                  .user.image
                                                                  .toString(),
                                                          loadingBuilder: (context,
                                                              child,
                                                              loadingProgress) {
                                                            if (loadingProgress ==
                                                                null) {
                                                              return child;
                                                            }
                                                            return LoadingAnimationWidget
                                                                .hexagonDots(
                                                                    color: isDark
                                                                        ? Colors
                                                                            .white
                                                                        : Colors
                                                                            .black,
                                                                    size: 30);
                                                          },
                                                          fit: BoxFit.cover,
                                                        ),
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                Expanded(
                                                  child: Row(
                                                    mainAxisSize:
                                                        MainAxisSize.max,
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .spaceEvenly,
                                                    children: [
                                                      Row(
                                                        mainAxisSize:
                                                            MainAxisSize.max,
                                                        children: [
                                                          Padding(
                                                            padding:
                                                                const EdgeInsetsDirectional
                                                                        .fromSTEB(
                                                                    5, 0, 0, 0),
                                                            child: Container(
                                                              width: 70,
                                                              height: 50,
                                                              decoration:
                                                                  BoxDecoration(
                                                                color: isDark
                                                                    ? Colors
                                                                        .grey
                                                                        .shade600
                                                                    : Colors
                                                                        .white,
                                                                borderRadius:
                                                                    BorderRadius
                                                                        .circular(
                                                                            10),
                                                              ),
                                                              child: Column(
                                                                mainAxisSize:
                                                                    MainAxisSize
                                                                        .max,
                                                                mainAxisAlignment:
                                                                    MainAxisAlignment
                                                                        .center,
                                                                children: [
                                                                  Text(
                                                                    awaitedUserpost?.length ==
                                                                            null
                                                                        ? '0'
                                                                        : awaitedUserpost!
                                                                            .length
                                                                            .toString(),

                                                                    textAlign:
                                                                        TextAlign
                                                                            .center,
                                                                    // style: FlutterFlowTheme
                                                                    //         .of(context)
                                                                    //     .bodyText1,
                                                                  ),
                                                                  const Text(
                                                                    'Posts',
                                                                    textAlign:
                                                                        TextAlign
                                                                            .center,
                                                                  ),
                                                                ],
                                                              ),
                                                            ),
                                                          ),
                                                          GestureDetector(
                                                            onTap: () {
                                                              Navigator.push(
                                                                  context,
                                                                  MaterialPageRoute(
                                                                    builder: (context) => FollowerFollowingScreen(
                                                                        isMe: widget
                                                                            .isMe,
                                                                        username: widget
                                                                            .user
                                                                            .username),
                                                                  ));
                                                            },
                                                            child: Padding(
                                                              padding:
                                                                  const EdgeInsetsDirectional
                                                                          .fromSTEB(
                                                                      5,
                                                                      0,
                                                                      0,
                                                                      0),
                                                              child: Container(
                                                                width: 70,
                                                                height: 50,
                                                                decoration:
                                                                    BoxDecoration(
                                                                  color: isDark
                                                                      ? Colors
                                                                          .grey
                                                                          .shade600
                                                                      : Colors
                                                                          .white,
                                                                  borderRadius:
                                                                      BorderRadius
                                                                          .circular(
                                                                              10),
                                                                ),
                                                                child: Column(
                                                                  mainAxisSize:
                                                                      MainAxisSize
                                                                          .max,
                                                                  mainAxisAlignment:
                                                                      MainAxisAlignment
                                                                          .center,
                                                                  children: [
                                                                    Text(
                                                                      widget.isMe
                                                                          ? userProvider.followers!.isEmpty
                                                                              ? '0'
                                                                              : userProvider.followers!.length.toString()
                                                                          : widget.user.followers!.isEmpty
                                                                              ? '0'
                                                                              : widget.user.followers!.length.toString(),
                                                                      textAlign:
                                                                          TextAlign
                                                                              .center,
                                                                    ),
                                                                    const Text(
                                                                      'Followers',
                                                                      textAlign:
                                                                          TextAlign
                                                                              .center,
                                                                    ),
                                                                  ],
                                                                ),
                                                              ),
                                                            ),
                                                          ),
                                                          GestureDetector(
                                                            onTap: () {
                                                              Navigator.push(
                                                                  context,
                                                                  MaterialPageRoute(
                                                                    builder: (context) => FollowerFollowingScreen(
                                                                        isMe: widget
                                                                            .isMe,
                                                                        username: widget
                                                                            .user
                                                                            .username),
                                                                  ));
                                                            },
                                                            child: Padding(
                                                              padding:
                                                                  const EdgeInsetsDirectional
                                                                          .fromSTEB(
                                                                      5,
                                                                      0,
                                                                      0,
                                                                      0),
                                                              child: Container(
                                                                width: 70,
                                                                height: 50,
                                                                decoration:
                                                                    BoxDecoration(
                                                                  color: isDark
                                                                      ? Colors
                                                                          .grey
                                                                          .shade600
                                                                      : Colors
                                                                          .white,
                                                                  borderRadius:
                                                                      BorderRadius
                                                                          .circular(
                                                                              10),
                                                                ),
                                                                child: Column(
                                                                  mainAxisSize:
                                                                      MainAxisSize
                                                                          .max,
                                                                  mainAxisAlignment:
                                                                      MainAxisAlignment
                                                                          .center,
                                                                  children: [
                                                                    Text(
                                                                      widget.isMe
                                                                          ? userProvider.following!.isEmpty
                                                                              ? '0'
                                                                              : userProvider.following!.length.toString()
                                                                          : widget.user.following!.isEmpty
                                                                              ? '0'
                                                                              : widget.user.following!.length.toString(),
                                                                      textAlign:
                                                                          TextAlign
                                                                              .center,
                                                                    ),
                                                                    const Text(
                                                                      'Following',
                                                                      textAlign:
                                                                          TextAlign
                                                                              .center,
                                                                    ),
                                                                  ],
                                                                ),
                                                              ),
                                                            ),
                                                          ),
                                                        ],
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                          Padding(
                                            padding: const EdgeInsetsDirectional
                                                .fromSTEB(20, 20, 20, 0),
                                            child: Row(
                                              mainAxisSize: MainAxisSize.max,
                                              children: [
                                                Text(
                                                  widget.isMe
                                                      ? userProvider.name
                                                          .toString()
                                                      : widget.user.name
                                                          .toString(),
                                                ),
                                                const Padding(
                                                  padding: EdgeInsetsDirectional
                                                      .fromSTEB(5, 0, 0, 0),
                                                  child: Icon(
                                                    Icons.verified_rounded,
                                                    size: 16,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Padding(
                                                padding:
                                                    const EdgeInsetsDirectional
                                                        .fromSTEB(20, 0, 20, 0),
                                                child: Row(
                                                  mainAxisSize:
                                                      MainAxisSize.max,
                                                  children: [
                                                    Text(
                                                      widget.isMe
                                                          ? '@${userProvider.username}'
                                                          : '@${widget.user.username}'
                                                              .toString(),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                              widget.isMe
                                                  ? const SizedBox()
                                                  : InkWell(
                                                      onTap: () {},
                                                      child: Padding(
                                                        padding:
                                                            const EdgeInsets
                                                                    .only(
                                                                right: 50),
                                                        child:
                                                            FloatingActionButton(
                                                          backgroundColor:
                                                              Colors.blue,
                                                          child: Text(
                                                            isFollowed
                                                                ? statusCodeForFollow ==
                                                                        200
                                                                    ? 'Follow'
                                                                    : 'Unfollow'
                                                                : statusCodeForFollow ==
                                                                        201
                                                                    ? 'Unfollow'
                                                                    : 'Follow',
                                                            style: TextStyle(
                                                                color: isDark
                                                                    ? Colors
                                                                        .white
                                                                    : Colors
                                                                        .black),
                                                          ),
                                                          onPressed: () async {
                                                            // if (followAndUnfollow ==
                                                            //     'Unfollow') {
                                                            //   setState(() {
                                                            //     followAndUnfollow =
                                                            //         'Follow';
                                                            //   });
                                                            // } else {
                                                            //   setState(() {
                                                            //     followAndUnfollow =
                                                            //         'UnFollow';
                                                            //   });
                                                            // }
                                                            await userService
                                                                .followUser(
                                                                    context:
                                                                        context,
                                                                    username: widget
                                                                        .user
                                                                        .username)
                                                                .then((value) {
                                                              setState(() {
                                                                statusCodeForFollow =
                                                                    value;
                                                              });
                                                            });
                                                          },
                                                        ),
                                                      ),
                                                    )
                                            ],
                                          ),
                                          FutureBuilder<List<FeedPostModel>?>(
                                            future: _userPost,
                                            builder: (context, snapshot) {
                                              if (snapshot.hasData) {
                                                return Column(
                                                  children: [
                                                    MediaQuery.removePadding(
                                                      context: context,
                                                      removeTop: true,
                                                      child: ListView.builder(
                                                        reverse: true,
                                                        primary: false,
                                                        shrinkWrap: true,
                                                        itemCount: snapshot
                                                            .data!.length,
                                                        itemBuilder:
                                                            ((context, index) {
                                                          return FeedCard(
                                                            post: snapshot
                                                                .data![index],
                                                            isImage: snapshot
                                                                        .data![
                                                                            index]
                                                                        .media
                                                                        ?.mediatype ==
                                                                    'image'
                                                                ? true
                                                                : false,
                                                            isVideo: snapshot
                                                                        .data![
                                                                            index]
                                                                        .media
                                                                        ?.mediatype ==
                                                                    'video'
                                                                ? true
                                                                : false,
                                                          );
                                                        }),
                                                      ),
                                                    ),
                                                  ],
                                                );
                                              } else {
                                                return const Center(
                                                    child:
                                                        CircularProgressIndicator());
                                              }
                                            },
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
          AnimatedPositioned(
            duration: const Duration(milliseconds: 200),
            curve: Curves.fastOutSlowIn,
            left: isSideBarOpen ? 220 : 0,
            top: 16,
            child: MenuBtn(
              press: () {
                isMenuOpenInput.value = !isMenuOpenInput.value;

                if (_animationController.value == 0) {
                  _animationController.forward();
                } else {
                  _animationController.reverse();
                }

                setState(
                  () {
                    isSideBarOpen = !isSideBarOpen;
                  },
                );
              },
              riveOnInit: (artboard) {
                final controller = StateMachineController.fromArtboard(
                    artboard, "State Machine");

                artboard.addController(controller!);

                isMenuOpenInput =
                    controller.findInput<bool>("isOpen") as SMIBool;
                isMenuOpenInput.value = true;
              },
            ),
          ),
        ],
      ),
      // bottomNavigationBar: Transform.translate(
      //   offset: Offset(0, 100 * animation.value),
      //   child: SafeArea(
      //     child: Container(
      //       padding:
      //           const EdgeInsets.only(left: 12, top: 12, right: 12, bottom: 12),
      //       margin: const EdgeInsets.symmetric(horizontal: 24),
      //       decoration: BoxDecoration(
      //         gradient: gradient.LinearGradient(
      //           colors: [
      //             Colors.lightBlue.shade700.withOpacity(0.4),
      //             Colors.purpleAccent.shade700.withOpacity(0.4),
      //           ],
      //           stops: [0, 1],
      //           begin: AlignmentDirectional(1, 0),
      //           end: AlignmentDirectional(-1, 0),
      //           // color: Colors.purpleAccent.shade100.withOpacity(
      //           // 0.3,
      //         ),
      //         // color: Colors.lightBlue.withOpacity(0.8),
      //         borderRadius: const BorderRadius.all(Radius.circular(24)),
      //         boxShadow: const [
      //           BoxShadow(
      //             color: Colors.lightBlue,
      //             offset: const Offset(0, 20),
      //             blurRadius: 20,
      //           ),
      //         ],
      //       ),
      //       child: Row(
      //         mainAxisAlignment: MainAxisAlignment.spaceBetween,
      //         children: [
      //           ...List.generate(
      //             bottomNavItems.length,
      //             (index) {
      //               Menu navBar = bottomNavItems[index];
      //               return BtmNavItem(
      //                 navBar: navBar,
      //                 press: () {
      //                   RiveUtils.changeSMIBoolState(navBar.rive.status!);
      //                   updateSelectedBtmNav(navBar);
      //                 },
      //                 riveOnInit: (artboard) {
      //                   navBar.rive.status = RiveUtils.getRiveInput(artboard,
      //                       stateMachineName: navBar.rive.stateMachineName);
      //                 },
      //                 selectedNav: selectedBottonNav,
      //               );
      //             },
      //           ),
      //         ],
      //       ),
      //     ),
      //   ),
      // ),
      // bottomNavigationBar: AnimatedNotchBottomBar(
      //   pageController: _pageController,
      //   bottomBarItems: [
      //     const BottomBarItem(
      //       inActiveItem: Icon(
      //         Icons.home_filled,
      //         color: Colors.blueGrey,
      //       ),
      //       activeItem: Icon(
      //         Icons.home_filled,
      //         color: Colors.blueAccent,
      //       ),
      //       itemLabel: 'Page 1',
      //     ),
      //     const BottomBarItem(
      //       inActiveItem: Icon(
      //         Icons.star,
      //         color: Colors.blueGrey,
      //       ),
      //       activeItem: Icon(
      //         Icons.star,
      //         color: Colors.blueAccent,
      //       ),
      //       itemLabel: 'Page 2',
      //     ),
      //   ],
      //   onTap: (int value) {
      //     _pageController.animateToPage(
      //       value,
      //       duration: const Duration(milliseconds: 500),
      //       curve: Curves.easeIn,
      //     );
      //   },

      ///svg item
      // ),
    );
  }
}
