import 'package:flutter/material.dart';
import 'package:foxxi/models/story.dart';
import 'package:video_player/video_player.dart';
import 'package:flutter_carousel_slider/carousel_slider.dart';

class StoryScreen extends StatefulWidget {
  List<Story> stories;
  bool isVideo;
  String? video;
  StoryScreen({required this.isVideo, this.video, required this.stories});

  @override
  State<StoryScreen> createState() => _storyScreenState();
}

class _storyScreenState extends State<StoryScreen> {
  late VideoPlayerController _controller;

  late CarouselSliderController _sliderController;

  @override
  void initState() {
    _sliderController = CarouselSliderController();
    if (widget.isVideo) {
      _controller = VideoPlayerController.network(widget.video.toString())
        ..initialize().then((_) {
          _controller.setLooping(true);
          // Ensure the first frame is shown after the video is initialized, even before the play button has been pressed.
          setState(() {});
        });
    }

    super.initState();
  }

  @override
  void dispose() {
    _controller.dispose();
    _sliderController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: ListView(children: <Widget>[
      Padding(
        padding: const EdgeInsets.all(8.0),
        child: SizedBox(
          height: MediaQuery.of(context).size.height,
          width: MediaQuery.of(context).size.width,
          child: CarouselSlider.builder(
            enableAutoSlider: false,

            unlimitedMode: true,
            controller: _sliderController,
            slideBuilder: (index) {
              return ClipRRect(
                borderRadius: BorderRadius.circular(30),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.max,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(16),
                          height: 100,
                          // width: MediaQuery.of(context).size.width * 0.1,
                          child: CircleAvatar(
                            backgroundColor:
                                Colors.purpleAccent.shade100.withOpacity(0.4),
                            child: IconButton(
                              // iconSize: 20,
                              icon: const Icon(
                                Icons.arrow_back_ios_new_rounded,
                                color: Colors.white,
                                // size: 15,
                              ),
                              onPressed: () {
                                Navigator.pop(context);
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        vertical: 4,
                        horizontal: 16,
                      ).copyWith(right: 0),
                      child: Row(
                        children: <Widget>[
                          Card(
                            shape: const CircleBorder(),
                            elevation: 5,
                            child: CircleAvatar(
                              radius: 16,
                              backgroundImage: NetworkImage(widget
                                  .stories[index].author.image
                                  .toString()),
                            ),
                          ),
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsets.only(
                                left: 8,
                              ),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: <Widget>[
                                  Text(
                                    widget.stories[index].author.name
                                        .toString(),
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Text(
                                    widget.stories[index].author.username
                                        .toString(),
                                    style: const TextStyle(color: Colors.grey),
                                  )
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Text('Caption'),
                    ),
                    !widget.isVideo
                        ? Container(
                            height: MediaQuery.of(context).size.height - 100,
                            width: MediaQuery.of(context).size.width,
                            decoration: BoxDecoration(
                              borderRadius:
                                  const BorderRadius.all(Radius.circular(30)),
                              // border: Border(
                              //     bottom:
                              //         BorderSide(color: Colors.black.withOpacity(1))),
                              image: DecorationImage(
                                image: NetworkImage(widget
                                    .stories[index].media!.url
                                    .toString()),
                                fit: BoxFit.cover,
                              ),
                            ),
                          )
                        : Container(
                            height: 400,
                            width: MediaQuery.of(context).size.width - 20,
                            decoration: const BoxDecoration(
                              borderRadius:
                                  BorderRadius.all(Radius.circular(30)),
                              // border: Border(
                              //     bottom: BorderSide(color: Colors.black.withOpacity(1))),
                            ),
                            child: Stack(
                              children: [
                                _controller.value.isInitialized
                                    ? Container(
                                        decoration: const BoxDecoration(
                                            borderRadius: BorderRadius.all(
                                                Radius.circular(30))),
                                        height: 330,
                                        width: 400,
                                        child: VideoPlayer(_controller))
                                    : Container(),
                                Positioned(
                                  top: 270,
                                  left: 10,
                                  child: FloatingActionButton(
                                    onPressed: () {
                                      setState(
                                        () {
                                          _controller.value.isPlaying
                                              ? _controller.pause()
                                              : _controller.play();
                                        },
                                      );
                                    },
                                    child: Icon(
                                      _controller.value.isPlaying
                                          ? Icons.pause
                                          : Icons.play_arrow,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                  ],
                ),
              );
            },
            slideTransform: const CubeTransform(),
            // slideIndicator: CircularSlideIndicator(
            //     // padding: EdgeInsets.only(bottom: 32),
            //     // indicatorBorderColor: Colors.black,
            //     ),
            // enableAutoSlider: true,
            itemCount: widget.stories.length,
          ),
        ),
      )
    ]));
  }
}
