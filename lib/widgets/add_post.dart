import 'dart:io';

import 'package:flutter/material.dart';
import 'package:foxxi/utils.dart';
import 'package:image_picker/image_picker.dart';
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
  final TextEditingController _captionTextEditingController =
      TextEditingController();
  var _image;
  XFile? image;
  XFile? pickedFile;
  File? _video;
  final picker = ImagePicker();
  VideoPlayerController? _videoPlayerController;

// This funcion will helps you to pick a Video File
  _pickVideo() async {
    // ignore: deprecated_member_use

    if (selectedMenu != null) {
      pickedFile = await picker
          .pickVideo(
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
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
      ),
      resizeToAvoidBottomInset: false,
      body: (widget.IsImage == true)
          ? Column(
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
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: GestureDetector(
                    onTap: () async {
                      if (selectedMenu != null && image == null) {
                        image = await imagePicker
                            .pickImage(
                                source: (selectedMenu == Items.camera)
                                    ? ImageSource.camera
                                    : ImageSource.gallery);
                                    setState(() {
                                      selectedMenu =null;
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
                                  child: Icon(Icons.upload),
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
                                      ])
                              : selectedMenu == Items.camera
                                  ? Icon(Icons.camera)
                                  : Icon(Icons.file_copy_rounded),
                    ),
                  ),
                ),
                Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Container(
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
                                          Colors.lightBlue.shade100
                                              .withOpacity(0.4),
                                          Colors.purpleAccent.shade100
                                              .withOpacity(0.4),
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
                                    if (_captionTextEditingController
                                        .text.isNotEmpty) {
                                      postService.createPost(
                                          context: context,
                                          caption: _captionTextEditingController
                                              .text,
                                          imageFilePath: image!.path);
                                    } else {
                                      showSnackBar(
                                          context, "Field can't be empty");
                                    }
                                    Navigator.pop(context);
                                  },
                                  child: const Text('Upload'),
                                ),
                              ]),
                            ],
                          ),
                        )
                      ],
                    ))
              ],
            )
          : Column(
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
                Padding(
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
                                  child: Icon(Icons.upload),
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
                                      ])
                              : selectedMenu == Items.camera
                                  ? Icon(Icons.camera)
                                  : Icon(Icons.file_copy_rounded),
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
                                  videoFilePath: pickedFile!.path);
                              Navigator.pop(context);
                            } else {
                              showSnackBar(context, "Field can't be empty");
                            }
                          },
                          child: const Text('Upload'),
                        ),
                      ]),
                    ],
                  ),
                )
              ],
            ),
    );
  }
}
