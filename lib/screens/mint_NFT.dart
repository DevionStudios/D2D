import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class mintNFT extends StatefulWidget {
  const mintNFT({super.key});

  @override
  State<mintNFT> createState() => mintNFTState();
}

class mintNFTState extends State<mintNFT> {
  void initState() {
    super.initState();
    imagePicker = ImagePicker();
  }

  var imagePicker;
  var imageNFT;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  "Options",
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 30),
                ),
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  'Adjust these settings according to your needs',
                  style: TextStyle(
                    fontFamily: 'InstagramSans',
                    fontSize: 15,
                  ),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Padding(
                          padding: EdgeInsets.only(left: 8),
                          child: Text(
                            'Contact us to Claim Free Tokens',
                            style: TextStyle(
                              fontFamily: 'InstagramSans',
                              fontSize: 15,
                            ),
                          ),
                        ),
                        Padding(
                          padding: EdgeInsets.only(left: 8),
                          child: Text(
                            'Claim free tokens',
                            style: TextStyle(
                              fontFamily: 'InstagramSans',
                              fontSize: 15,
                            ),
                          ),
                        ),
                      ]),
                  Container(
                    // alignment: Alignment.bottomRight,
                    padding: const EdgeInsets.all(8.0),
                    child: ElevatedButton(
                      style: ButtonStyle(
                        foregroundColor:
                            MaterialStateProperty.all<Color>(Colors.white),
                        backgroundColor:
                            MaterialStateProperty.all<Color>(Colors.blue),
                      ),
                      onPressed: () {},
                      child: const Text('Claim Token'),
                    ),
                  ),
                ],
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  "Generate NFT",
                  style: TextStyle(
                    fontFamily: 'InstagramSans',
                    fontSize: 15,
                  ),
                ),
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  'Upload a picture to mint a NFT and set it as your profile image',
                  style: TextStyle(
                    fontFamily: 'InstagramSans',
                    fontSize: 15,
                  ),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Padding(
                    padding: EdgeInsets.all(8.0),
                    child: Text(
                      'Image',
                      style: TextStyle(
                        fontFamily: 'InstagramSans',
                        fontSize: 15,
                      ),
                    ),
                  ),
                ],
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  GestureDetector(
                    onTap: () async {
                      XFile? image = await imagePicker.pickImage(
                          source: ImageSource.gallery);
                      setState(() {
                        imageNFT = File(image!.path);
                      });
                    },
                    child: Container(
                      decoration: BoxDecoration(
                          border: Border.all(
                              color: Colors.grey.shade500,
                              style: BorderStyle.solid,
                              width: 3)),
                      // alignment: Alignment.center,
                      width: (MediaQuery.of(context).size.width / 3) - 40,
                      height: 100,
                      child: imageNFT != null
                          ? Image.file(
                              imageNFT,
                              fit: BoxFit.cover,
                            )
                          : Icon(
                              Icons.file_upload_rounded,
                              color: Colors.grey[800],
                            ),
                    ),
                  ),
                ],
              ),
              Container(
                alignment: Alignment.center,
                padding: const EdgeInsets.all(8.0),
                child: ElevatedButton(
                  style: ButtonStyle(
                    foregroundColor:
                        MaterialStateProperty.all<Color>(Colors.white),
                    backgroundColor:
                        MaterialStateProperty.all<Color>(Colors.blue),
                  ),
                  onPressed: () {},
                  child: const Text('Mint'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
