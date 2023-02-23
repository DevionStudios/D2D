import 'dart:io';

import 'package:flutter/material.dart';
import 'package:foxxi/services/post_service.dart';
import 'package:image_picker/image_picker.dart';
import 'package:video_player/video_player.dart';

class AddPost extends StatefulWidget {
  // const AddPost({super.key});
  //Photo -- true Video -- false
  bool IsImage;
  AddPost({required this.IsImage});

  @override
  State<AddPost> createState() => _AddPostState();
}

class _AddPostState extends State<AddPost> {
  PostService postService = PostService();
  TextEditingController _captionTextEditingController = TextEditingController();
  var _image;
  File? _video;
  final picker = ImagePicker();
  var _videoPlayerController;

// This funcion will helps you to pick a Video File
  _pickVideo() async {
    // ignore: deprecated_member_use
    PickedFile? pickedFile = await picker.getVideo(source: ImageSource.gallery);
    _video = File(pickedFile!.path);
    _videoPlayerController = VideoPlayerController.file(_video!)
      ..initialize().then((_) {
        setState(() {});
        _videoPlayerController.play();
      });
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
      body: (widget.IsImage == true)
          ? Padding(
              padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top),
              child: Column(
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
                        XFile? image = await imagePicker.pickImage(
                            source: ImageSource.gallery);

                        if (image?.path != null) {
                          setState(() {
                            _image = File(image!.path);
                          });
                        }
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
                        child: _image != null
                            ? Image.file(
                                _image,
                                fit: BoxFit.cover,
                              )
                            : Icon(
                                Icons.file_upload_rounded,
                                color: Colors.grey[800],
                                size: 50,
                              ),
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
                                gradient: LinearGradient(
                                  colors: [
                                    Colors.lightBlue.shade100.withOpacity(0.4),
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
                              postService.createPost(
                                  caption: _captionTextEditingController.text,
                                  filePath: _image);
                            },
                            child: const Text('Upload'),
                          ),
                        ]),
                      ],
                    ),
                  )
                ],
              ),
            )
          : Padding(
              padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top),
              child: Column(
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
                  const Padding(
                    padding: EdgeInsets.all(8.0),
                    child: TextField(
                      decoration: InputDecoration(
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
                              ? _videoPlayerController.value.initialized
                                  ? AspectRatio(
                                      aspectRatio: _videoPlayerController
                                          .value.aspectRatio,
                                      child:
                                          VideoPlayer(_videoPlayerController),
                                    )
                                  : Container()
                              : Icon(
                                  Icons.file_upload_rounded,
                                  color: Colors.grey[800],
                                  size: 50,
                                )),
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
                                gradient: LinearGradient(
                                  colors: [
                                    Colors.lightBlue.shade100.withOpacity(0.4),
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
                            onPressed: () {},
                            child: const Text('Upload'),
                          ),
                        ]),
                      ],
                    ),
                  )
                ],
              ),
            ),
    );
  }
}
