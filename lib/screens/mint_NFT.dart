import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_ipfs/flutter_ipfs.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:foxxi/models/NFT_mint_controller.dart';
// import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../components/ipfsService.dart' as ipfs_service;

import '../providers/theme_provider.dart';
import '../providers/wallet_address.dart';
import '../services/auth_service.dart';

// import '../provider/theme_provider.dart';

class mintNFT extends StatefulWidget {
  bool haveNFT = false;

  mintNFT({super.key});
  @override
  State<mintNFT> createState() => mintNFTState();
}

class mintNFTState extends State<mintNFT> {
  final TextEditingController _controller = TextEditingController();
  AuthService authService = AuthService();

  void initState() {
    super.initState();
    // imagePicker = ImagePicker();
  }

  String? uri = 'https://ipfs.io/ipfs/';
  String? image;

  var imagePicker;
  var imageNFT;
  @override
  Widget build(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;

    final walletAddressProvider =
        Provider.of<WalletAddressProvider>(context, listen: true);
    return Scaffold(
      body: Padding(
        padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                  padding: EdgeInsets.all(16),
                  height: 100,
                  // width: MediaQuery.of(context).size.width * 0.1,
                  child: CircleAvatar(
                    backgroundColor:
                        Colors.purpleAccent.shade100.withOpacity(0.4),
                    child: IconButton(
                      // iconSize: 20,
                      icon: Icon(
                        Icons.arrow_back_ios_new_rounded,
                        color: Colors.white,
                        // size: 15,
                      ),
                      onPressed: () {
                        Navigator.pop(context);
                      },
                    ),
                  )),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(
                  "Options",
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 30),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
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
                      children: [
                        Padding(
                          padding: const EdgeInsets.only(left: 8),
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
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
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
                                      stops: [0, 1],
                                      begin: AlignmentDirectional(1, 0),
                                      end: AlignmentDirectional(-1, 0),
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
                                child: const Text('Claim'),
                              ),
                            ]),
                          ],
                        ),
                      )
                    ],
                  )
                ],
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Text(
                      "have NFT?",
                      style: TextStyle(
                        fontFamily: 'InstagramSans',
                        fontSize: 15,
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: CupertinoSwitch(
                      activeColor: Colors.grey.shade300,
                      thumbColor:
                          isDark ? Colors.grey.shade900 : Colors.grey.shade400,
                      value: widget.haveNFT,
                      onChanged: (bool value) {
                        setState(() {
                          widget.haveNFT = value;
                        });
                      },
                    ),
                  ),
                ],
              ),
              !widget.haveNFT
                  ? const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Text(
                        'Upload a picture to mint a NFT and set it as your profile image',
                        style: TextStyle(
                          fontFamily: 'InstagramSans',
                          fontSize: 15,
                        ),
                      ),
                    )
                  : const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Text(
                        'Set your NFT as profile image here',
                        style: TextStyle(
                          fontFamily: 'InstagramSans',
                          fontSize: 15,
                        ),
                      ),
                    ),
              !widget.haveNFT
                  ? Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Text(
                            'Image',
                            style: TextStyle(
                              fontFamily: 'InstagramSans',
                              fontSize: 15,
                            ),
                          ),
                        ),
                      ],
                    )
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Text(
                            'IPFS CID',
                            style: TextStyle(
                              fontFamily: 'InstagramSans',
                              fontSize: 15,
                            ),
                          ),
                        ),
                      ],
                    ),
              !widget.haveNFT
                  ? Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        GestureDetector(
                          onTap: () async {
                            image =
                                await ipfs_service.ImagePickerService.pickImage(
                                    context);
                            uri = uri.toString() + image.toString();
                            setState(() {
                              imageNFT = uri;
                              uri = 'https://ipfs.io/ipfs/';
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
                                ? Image.network(
                                    imageNFT,
                                    fit: BoxFit.cover,
                                  )
                                : Icon(
                                    Icons.file_upload_rounded,
                                    color: isDark
                                        ? Colors.grey.shade200
                                        : Colors.grey[800],
                                    // color: Colors.grey.shade800
                                  ),
                          ),
                        ),
                      ],
                    )
                  : Padding(
                      padding: EdgeInsets.all(8.0),
                      child: TextField(
                        controller: _controller,
                        decoration: InputDecoration(
                          border: OutlineInputBorder(),
                        ),
                      ),
                    ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
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
                                    Colors.lightBlue.shade100.withOpacity(0.4),
                                    Colors.purpleAccent.shade100
                                        .withOpacity(0.4),
                                  ],
                                  stops: [0, 1],
                                  begin: AlignmentDirectional(1, 0),
                                  end: AlignmentDirectional(-1, 0),
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
                              if (!widget.haveNFT) {
                                if (walletAddressProvider.privateAddress !=
                                    null) {
                                  showDialog(
                                    barrierDismissible: false,
                                    context: context,
                                    builder: (BuildContext context) =>
                                        const ProgressDialog(
                                      status: 'Minting NFT',
                                    ),
                                  );
                                  try {
                                    MintController()
                                        .mint(
                                            walletAddressProvider.privateAddress
                                                .toString(),
                                            image!,
                                            image!)
                                        .then(
                                      (value) {
                                        Navigator.pop(context);
                                      },
                                    );
                                    authService.updateProfileImage(
                                        context: context, image: imageNFT);
                                  } catch (e) {
                                    print(e);
                                  }
                                } else {
                                  Fluttertoast.showToast(
                                    msg: 'Connect Wallet First',
                                  );
                                }
                              } else {
                                String text = _controller.text;
                                text = 'https://ipfs.io/ipfs/' + text;

                                authService.updateProfileImage(
                                    context: context, image: text);
                              }
                            },
                            child: const Text('Import'),
                          ),
                        ]),
                      ],
                    ),
                  )
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
