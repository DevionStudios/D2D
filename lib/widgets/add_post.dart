import 'dart:io';

import 'package:flutter/material.dart';

import 'package:foxxi/providers/user_provider.dart';
import 'package:foxxi/services/notification_service.dart';
import 'package:foxxi/utils.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:video_player/video_player.dart';

import 'package:foxxi/services/post_service.dart';

enum Items { gallery, camera }

class AddPost extends StatefulWidget {
  // const AddPost({super.key});
  //Photo -- true Video -- false
  bool IsImage;
  AddPost({
    Key? key,
    required this.IsImage,
  }) : super(key: key);

  @override
  State<AddPost> createState() => _AddPostState();
}

class _AddPostState extends State<AddPost> {
  Items? selectedMenu;

  PostService postService = PostService();
  NotificationService notificationService = NotificationService();
  final TextEditingController _captionTextEditingController =
      TextEditingController();
  var _image;
  XFile? image;
  XFile? pickedFile;
  File? _video;
  final picker = ImagePicker();
  VideoPlayerController? _videoPlayerController;
  List<String> words = [];
  List<String> mentionedUsers = [];
  // List<String> searchResult = [];
  // bool showSuggestion = false;
  // String currentWord = '';
  // List<String> userList = [];

// This funcion will helps you to pick a Video File
  _pickVideo() async {
    // ignore: deprecated_member_use

    if (selectedMenu != null) {
      pickedFile = await picker.pickVideo(
          source: (selectedMenu == Items.camera)
              ? ImageSource.camera
              : ImageSource.gallery);
      setState(() {
        selectedMenu = null;
      });

      if (pickedFile?.path != null) {
        selectedMenu = null;
        _video = File(pickedFile!.path);
        _videoPlayerController = VideoPlayerController.file(_video!)
          ..initialize().then((_) {
            setState(() {});
            _videoPlayerController!.play();
          });
      }
    }
  }

  var imagePicker;
  @override
  void initState() {
    imagePicker = ImagePicker();

    super.initState();
  }

  @override
  void dispose() {
    _captionTextEditingController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context, listen: true).user;

    // if (userProvider.following != null) {
    //   for (var user in userProvider.following!) {
    //     userList.add(user['username'].toString());
    //   }
    // }

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
      ),
      resizeToAvoidBottomInset: false,
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.all(8.0),
            child: Text(
              'Create Post',
              style: TextStyle(fontSize: 20),
            ),
          ),
          const Padding(
            padding: EdgeInsets.all(8.0),
            child: Text('Caption'),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              onSubmitted: (value) {
                setState(() {
                  words = value.split(' ');

                  for (String element in words) {
                    if (element.startsWith('@')) {
                      mentionedUsers.add(element);
                    }
                  }
                });
              },
              controller: _captionTextEditingController,
              decoration: const InputDecoration(
                // labelText: 'Caption',
                border: OutlineInputBorder(),
                hintText: 'Include body for your post.',
              ),
            ),
          ),
          const Padding(
            padding: EdgeInsets.all(8.0),
            child: Text('Media'),
          ),
          (widget.IsImage == true)
              ? Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: GestureDetector(
                    onTap: () async {
                      if (selectedMenu != null) {
                        image = await imagePicker.pickImage(
                            source: (selectedMenu == Items.camera)
                                ? ImageSource.camera
                                : ImageSource.gallery);
                        setState(() {
                          selectedMenu = null;
                        });

                        if (image != null) {
                          setState(() {
                            _image = File(image!.path);
                            selectedMenu = null;
                          });
                        }
                      }
                    },
                    child: Container(
                      // padding: EdgeInsets.only(left: 8),
                      decoration: BoxDecoration(
                        border: Border.all(
                            color: Colors.grey.shade500,
                            style: BorderStyle.solid,
                            width: 3),
                      ),
                      width: double.infinity,
                      height: MediaQuery.of(context).size.height * 0.4,
                      child: _image != null
                          ? Image.file(
                              _image,
                              fit: BoxFit.cover,
                            )
                          : selectedMenu == null
                              ? PopupMenuButton<Items>(
                                  initialValue: selectedMenu,
                                  onSelected: (Items item) {
                                    setState(() {
                                      selectedMenu = item;
                                    });
                                  },
                                  itemBuilder: (BuildContext ctx) =>
                                      <PopupMenuEntry<Items>>[
                                        const PopupMenuItem<Items>(
                                          value: Items.gallery,
                                          child: Text('Choose from Gallery'),
                                        ),
                                        const PopupMenuItem<Items>(
                                          value: Items.camera,
                                          child: Text('Choose from camera'),
                                        ),
                                      ],
                                  child: const Icon(Icons.upload))
                              : selectedMenu == Items.camera
                                  ? const Icon(Icons.camera)
                                  : const Icon(Icons.file_copy_rounded),
                    ),
                  ),
                )
              : Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: GestureDetector(
                    onTap: () {
                      _pickVideo();
                    },
                    child: Container(
                      // padding: EdgeInsets.only(left: 8),
                      decoration: BoxDecoration(
                          border: Border.all(
                              color: Colors.grey.shade500,
                              style: BorderStyle.solid,
                              width: 3)),
                      width: double.infinity,
                      height: MediaQuery.of(context).size.height * 0.4,
                      child: _video != null
                          ? _videoPlayerController!.value.isInitialized
                              ? AspectRatio(
                                  aspectRatio:
                                      _videoPlayerController!.value.aspectRatio,
                                  child: VideoPlayer(_videoPlayerController!),
                                )
                              : Container()
                          : selectedMenu == null
                              ? PopupMenuButton<Items>(
                                  initialValue: selectedMenu,
                                  onSelected: (Items item) {
                                    setState(() {
                                      selectedMenu = item;
                                    });
                                  },
                                  itemBuilder: (BuildContext ctx) =>
                                      <PopupMenuEntry<Items>>[
                                        const PopupMenuItem<Items>(
                                          value: Items.gallery,
                                          child: Text('Choose from Gallery'),
                                        ),
                                        const PopupMenuItem<Items>(
                                          value: Items.camera,
                                          child: Text('Choose from camera'),
                                        ),
                                      ],
                                  child: const Icon(Icons.upload))
                              : selectedMenu == Items.camera
                                  ? const Icon(Icons.camera)
                                  : const Icon(Icons.file_copy_rounded),
                    ),
                  ),
                ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Stack(children: <Widget>[
                  Positioned.fill(
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(15),
                        gradient: LinearGradient(
                          colors: [
                            Colors.lightBlue.shade100.withOpacity(0.4),
                            Colors.purpleAccent.shade100.withOpacity(0.4),
                          ],
                          stops: const [0, 1],
                          begin: const AlignmentDirectional(1, 0),
                          end: const AlignmentDirectional(-1, 0),
                          // color: Colors.purpleAccent.shade100.withOpacity(
                          // 0.3,
                        ),
                      ),
                    ),
                  ),
                  TextButton(
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.all(16.0),
                      textStyle: const TextStyle(fontSize: 20),
                    ),
                    onPressed: () {
                      if (_captionTextEditingController.text.isNotEmpty) {
                        postService.createPost(
                            context: context,
                            caption: _captionTextEditingController.text,
                            imageFilePath: (widget.IsImage == true)
                                ? image?.path == null
                                    ? null
                                    : image!.path
                                : null,
                            videoFilePath: (widget.IsImage == true)
                                ? null
                                : pickedFile?.path == null
                                    ? null
                                    : pickedFile!.path);
                      } else {
                        showSnackBar(context, "Field can't be empty");
                      }
                      Navigator.pop(context);
                    },
                    child: const Text('Upload'),
                  )
                ]),
              ],
            ),
          )
        ],
      ),
    );
  }
}
