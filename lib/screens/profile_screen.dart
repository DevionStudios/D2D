import 'dart:math';

import 'package:foxxi/providers/user_provider.dart';
import 'package:provider/provider.dart';
import 'package:rive/rive.dart';

import '../widgets/flutter_choice_chips.dart';

import 'dart:ui';
import 'package:flutter/material.dart';

import '../widgets/menu_button.dart';
import '../widgets/side_menu.dart';

class ProfileWidget extends StatefulWidget {
  const ProfileWidget({Key? key}) : super(key: key);

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

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context, listen: true).user;
    return Scaffold(
      extendBody: true,
      resizeToAvoidBottomInset: false,
      backgroundColor: const Color.fromARGB(255, 206, 239, 247),
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
                                            userProvider.coverImage.toString(),
                                            width: double.infinity,
                                            height: 200,
                                            fit: BoxFit.cover,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              ListView(
                                padding: EdgeInsets.zero,
                                shrinkWrap: true,
                                scrollDirection: Axis.vertical,
                                children: [
                                  Padding(
                                    padding:
                                        const EdgeInsetsDirectional.fromSTEB(
                                            0, 150, 0, 0),
                                    child: Container(
                                      width: double.infinity,
                                      decoration: const BoxDecoration(
                                        color: Color(0xFFF9F9F9),
                                        borderRadius: BorderRadius.only(
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
                                                      child: Image.network(
                                                        userProvider.image
                                                            .toString(),
                                                        fit: BoxFit.cover,
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
                                                                color: Colors
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
                                                                    userProvider
                                                                            .posts!
                                                                            .isEmpty
                                                                        ? '0'
                                                                        : userProvider
                                                                            .posts!
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
                                                                color: Colors
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
                                                                    userProvider
                                                                            .followers!
                                                                            .isEmpty
                                                                        ? '0'
                                                                        : userProvider
                                                                            .followers!
                                                                            .length
                                                                            .toString(),
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
                                                                color: Colors
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
                                                                    userProvider
                                                                            .following!
                                                                            .isEmpty
                                                                        ? '0'
                                                                        : userProvider
                                                                            .following!
                                                                            .length
                                                                            .toString(),
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
                                                  userProvider.name.toString(),
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
                                          Padding(
                                            padding: const EdgeInsetsDirectional
                                                .fromSTEB(20, 0, 20, 0),
                                            child: Row(
                                              mainAxisSize: MainAxisSize.max,
                                              children: [
                                                Text(
                                                  userProvider.username
                                                      .toString(),
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
                                                Expanded(
                                                  child: FlutterFlowChoiceChips(
                                                    initiallySelected: const [
                                                      'Posts'
                                                    ],
                                                    options: const [
                                                      ChipData('Posts'),
                                                      ChipData('Bio')
                                                    ],
                                                    onChanged: (val) =>
                                                        setState(() =>
                                                            choiceChipsValue =
                                                                val?.first),
                                                    selectedChipStyle:
                                                        const ChipStyle(
                                                      backgroundColor:
                                                          Color(0xFF4B39EF),
                                                      textStyle: TextStyle(
                                                          color: Colors.white),
                                                      iconColor: Colors.white,
                                                      iconSize: 0,
                                                      elevation: 0,
                                                    ),
                                                    unselectedChipStyle:
                                                        const ChipStyle(
                                                      backgroundColor:
                                                          Colors.white,
                                                      textStyle: TextStyle(
                                                          color: Colors.grey),
                                                      iconColor:
                                                          Color(0xFFB3B3B3),
                                                      iconSize: 18,
                                                      elevation: 0,
                                                    ),
                                                    chipSpacing: 20,
                                                    multiselect: false,
                                                    initialized:
                                                        choiceChipsValue !=
                                                            null,
                                                    alignment:
                                                        WrapAlignment.start,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                          Padding(
                                            padding: const EdgeInsetsDirectional
                                                .fromSTEB(10, 10, 10, 50),
                                            child: ListView(
                                              padding: EdgeInsets.zero,
                                              primary: false,
                                              shrinkWrap: true,
                                              scrollDirection: Axis.vertical,
                                              children: const [],
                                            ),
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
