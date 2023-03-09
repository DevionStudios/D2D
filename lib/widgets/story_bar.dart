import 'package:flutter/material.dart';
import 'package:foxxi/models/story.dart';
import 'package:foxxi/models/user.dart';
import 'package:foxxi/providers/user_provider.dart';
import 'package:foxxi/screens/story_screen.dart';
import 'package:foxxi/services/story_service.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
import 'package:provider/provider.dart';

// import '../screen/post_story.dart';
import 'add_story.dart';

class StoryBar extends StatefulWidget {
  const StoryBar({super.key});

  @override
  State<StoryBar> createState() => _StoryBarState();
}

class _StoryBarState extends State<StoryBar> with TickerProviderStateMixin {
  Animation? gap;
  Animation<double>? base;
  Animation<double>? reverse;
  AnimationController? controller;
  StoryService storyService = StoryService();
  List<User>? userWithStoryList;

  /// Init
  @override
  void initState() {
    super.initState();
    getFollowingUserStories();
    controller =
        AnimationController(vsync: this, duration: const Duration(seconds: 6));
    base = CurvedAnimation(parent: controller!, curve: Curves.easeOut);
    reverse = Tween<double>(begin: 0.0, end: -1.0).animate(base!);
    gap = Tween<double>(begin: 3.0, end: 0.0).animate(base!)
      ..addListener(() {
        setState(() {});
      });
    controller!.forward();
  }

  void getFollowingUserStories() async {
    userWithStoryList =
        await storyService.getFollowingUserWithStories(context: context);
  }

  /// Dispose
  @override
  void dispose() {
    controller!.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context, listen: true).user;
    return SizedBox(
        height: MediaQuery.of(context).size.height * 0.15,
        // color: Colors.grey.withOpacity(0.30),
        child: Row(
          mainAxisSize: MainAxisSize.max,
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container(
              // decoration: BoxDecoration(border: Border.all()),
              padding: const EdgeInsets.all(7),
              alignment: Alignment.center,
              child: SingleChildScrollView(
                child: Column(
                  // mainAxisSize: MainAxisSize.min,
                  children: [
                    Stack(
                      children: [
                        Card(
                          elevation: 20,
                          shape: const CircleBorder(),
                          // clipBehavior: Clip.antiAlias,
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(10),
                            child: Container(
                              padding: const EdgeInsets.all(2),
                              // decoration: BoxDecoration(borderRadius: BorderRadius.circular(15),),
                              color: Colors.white,
                              child: GestureDetector(
                                onTap: (() {
                                  showMaterialModalBottomSheet(
                                      elevation: 2,
                                      shape: RoundedRectangleBorder(
                                          side: BorderSide(
                                              width: 1.0,
                                              color: Colors.lightBlue.shade50),
                                          borderRadius:
                                              const BorderRadius.vertical(
                                                  top: Radius.circular(30))),
                                      context: context,
                                      builder: (context) => SizedBox(
                                              child: Column(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              const Padding(
                                                padding: EdgeInsets.symmetric(
                                                    horizontal: 8.0,
                                                    vertical: 20),
                                                child: Text(
                                                  'Add Story',
                                                  style: TextStyle(
                                                      fontFamily:
                                                          'InstagramSans',
                                                      fontSize: 20),
                                                ),
                                              ),
                                              Padding(
                                                padding:
                                                    const EdgeInsets.all(8.0),
                                                child: Row(
                                                  mainAxisSize:
                                                      MainAxisSize.max,
                                                  mainAxisAlignment:
                                                      MainAxisAlignment
                                                          .spaceEvenly,
                                                  children: [
                                                    Container(
                                                      margin:
                                                          const EdgeInsets.all(
                                                              8),
                                                      padding:
                                                          const EdgeInsets.all(
                                                              10),
                                                      decoration: BoxDecoration(
                                                          borderRadius:
                                                              const BorderRadius
                                                                      .all(
                                                                  Radius
                                                                      .circular(
                                                                          30)),
                                                          border: Border.all(
                                                              width: 5,
                                                              color: Colors
                                                                  .purpleAccent
                                                                  .shade100
                                                                  .withOpacity(
                                                                      0.5))),
                                                      child: Column(
                                                        mainAxisSize:
                                                            MainAxisSize.min,
                                                        mainAxisAlignment:
                                                            MainAxisAlignment
                                                                .center,
                                                        crossAxisAlignment:
                                                            CrossAxisAlignment
                                                                .center,
                                                        children: [
                                                          IconButton(
                                                            onPressed: () {
                                                              Navigator.push(
                                                                context,
                                                                MaterialPageRoute(
                                                                  builder: (context) =>
                                                                      const AddStory(
                                                                          isImage:
                                                                              true),
                                                                ),
                                                              );
                                                            },
                                                            icon: Icon(
                                                              Icons.photo,
                                                              color: Colors
                                                                  .lightBlue
                                                                  .shade100,
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
                                                      margin:
                                                          const EdgeInsets.all(
                                                              8),
                                                      padding:
                                                          const EdgeInsets.all(
                                                              10),
                                                      decoration: BoxDecoration(
                                                          borderRadius:
                                                              const BorderRadius
                                                                      .all(
                                                                  Radius
                                                                      .circular(
                                                                          30)),
                                                          border: Border.all(
                                                              width: 5,
                                                              color: Colors
                                                                  .purpleAccent
                                                                  .shade100
                                                                  .withOpacity(
                                                                      0.5))),
                                                      child: Column(
                                                        mainAxisSize:
                                                            MainAxisSize.min,
                                                        mainAxisAlignment:
                                                            MainAxisAlignment
                                                                .center,
                                                        crossAxisAlignment:
                                                            CrossAxisAlignment
                                                                .center,
                                                        children: [
                                                          IconButton(
                                                            onPressed: () {
                                                              Navigator.push(
                                                                context,
                                                                MaterialPageRoute(
                                                                  builder: (context) =>
                                                                      const AddStory(
                                                                          isImage:
                                                                              false),
                                                                ),
                                                              );
                                                            },
                                                            icon: Icon(
                                                              Icons
                                                                  .video_collection_rounded,
                                                              color: Colors
                                                                  .lightBlue
                                                                  .shade100,
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
                                }),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(10),
                                  child: Image.network(
                                    userProvider.image.toString(),
                                    errorBuilder:
                                        (context, error, stackTrace) =>
                                            const Text('Error Widget'),
                                    fit: BoxFit.cover,
                                    width: 50,
                                    height: 50,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                        Positioned(
                          bottom: 0,
                          right: 0,
                          child: Container(
                            padding: const EdgeInsets.all(5),
                            decoration: const BoxDecoration(
                                color: Colors.blue, shape: BoxShape.circle),
                            child: const Text(
                              "+",
                              style: TextStyle(color: Colors.white),
                            ),
                          ),
                        )
                      ],
                    ),
                    const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Text('Your Story'),
                    )
                  ],
                ),
              ),
            ),
            MediaQuery.removePadding(
              context: context,
              removeTop: true,
              child: Expanded(
                child: ListView.builder(
                  shrinkWrap: true,
                  physics: const ScrollPhysics(),
                  scrollDirection: Axis.horizontal,
                  itemCount: userWithStoryList?.length == null
                      ? 0
                      : userWithStoryList!.length,
                  itemBuilder: (context, index) {
                    return Container(
                      // decoration: BoxDecoration(border: Border.all()),
                      padding: const EdgeInsets.all(7),
                      alignment: Alignment.center,
                      child: SingleChildScrollView(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              // padding: EdgeInsets.all(5),
                              decoration: BoxDecoration(
                                borderRadius:
                                    const BorderRadius.all(Radius.circular(10)),
                                gradient: LinearGradient(
                                  colors: [
                                    Colors.purpleAccent.shade200
                                        .withOpacity(0.7),
                                    Colors.lightBlue.shade200.withOpacity(0.7),
                                  ],
                                  stops: const [0, 1],
                                  begin: const AlignmentDirectional(1, 0),
                                  end: const AlignmentDirectional(-1, 0),
                                  // color: Colors.purpleAccent.shade100.withOpacity(
                                  // 0.3,
                                ),
                              ),
                              child: InkWell(
                                onTap: (() async {
                                  setState(() {
                                    // userWithStoryList![index].isSeen = true;
                                  });

                                  List<Story>? userStories =
                                      await storyService.getUserStory(
                                          context: context,
                                          username: userWithStoryList![index]
                                              .username
                                              .toString());

                                  if (userWithStoryList?.length != null &&
                                      userStories?.length != null) {
                                    if (context.mounted) {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                            builder: (context) => StoryScreen(
                                                  stories: userStories!,
                                                  isVideo: userStories[index]
                                                              .media!
                                                              .mediatype ==
                                                          'Video'
                                                      ? true
                                                      : false,
                                                  video: userStories[index]
                                                      .media
                                                      ?.url,
                                                )),
                                      );
                                    }
                                  }
                                }),
                                child: Card(
                                  elevation: 20,
                                  shape: const CircleBorder(),
                                  // clipBehavior: Clip.antiAlias,
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(10),
                                    child: Container(
                                      padding: const EdgeInsets.all(2),
                                      // decoration: BoxDecoration(borderRadius: BorderRadius.circular(15),),
                                      color: Colors.white,
                                      child: ClipRRect(
                                        borderRadius: BorderRadius.circular(10),
                                        child: Image.network(
                                          userWithStoryList![index]
                                              .image
                                              .toString(),
                                          width: 50,
                                          height: 50,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Text(userWithStoryList![index]
                                  .username
                                  .toString()),
                            )
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
          ],
        ));
  }
}

class StoryPage extends StatelessWidget {
  final int? index;
  final String? storyImage;
  final String? profileImage;
  final String? userName;
  const StoryPage(
      {super.key,
      this.index,
      this.userName,
      this.storyImage,
      this.profileImage});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: Row(
          children: [
            CircleAvatar(
              child: ClipOval(
                child: Image.network(
                  profileImage.toString(),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            Column(
              children: [
                Container(
                  padding: const EdgeInsets.only(left: 5),
                  child: Text(
                    userName.toString(),
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.only(left: 5),
                  child: const Text(
                    "2023 Jan 23",
                    style: TextStyle(
                      fontWeight: FontWeight.w200,
                    ),
                  ),
                )
              ],
            )
          ],
        ),
      ),
      body: SizedBox(
        width: double.infinity,
        height: double.infinity,
        child: FittedBox(
          fit: BoxFit.cover,
          child: Image.network(
            storyImage.toString(),
            // fit: BoxFit.fill,
          ),
        ),
      ),
    );
  }
}
