import 'dart:io';
import 'package:circular_reveal_animation/circular_reveal_animation.dart';
import 'package:flutter/services.dart';
import 'package:local_auth/error_codes.dart' as auth_error;
import 'package:local_auth/local_auth.dart';

import '../providers/wallet_address.dart';

import 'package:flutter/material.dart';
import 'package:web3auth_flutter/web3auth_flutter.dart';
import 'package:web3auth_flutter/enums.dart';
import 'package:web3auth_flutter/input.dart';
import 'package:web3auth_flutter/output.dart';
import 'package:provider/provider.dart' as prov;
import 'package:http/http.dart';
import 'package:web3dart/web3dart.dart';
import 'package:shared_preferences/shared_preferences.dart';

class WalletWeb extends StatefulWidget {
  @override
  _WalletWebState createState() => _WalletWebState();
}

class _WalletWebState extends State<WalletWeb>
    with SingleTickerProviderStateMixin {
  late AnimationController animationController;
  bool isAuth = false;
  late Animation<double> animation;
  String rpcUrl = 'https://rpc.ankr.com/eth';

  @override
  void initState() {
    initPlatformState();
    animationController = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 1000),
    );
    animation = CurvedAnimation(
      parent: animationController,
      curve: Curves.easeIn,
    );

    super.initState();
  }

  Future<void> initPlatformState() async {
    Uri redirectUrl;
    if (Platform.isAndroid) {
      redirectUrl = Uri.parse('w3a://com.example.foxxi/auth');

      print(redirectUrl.toString());
    } else if (Platform.isIOS) {
      redirectUrl = Uri.parse('{bundleId}://openlogin');

      // com.example.w3aflutter://openlogin
    } else {
      throw UnKnownException('Unknown platform');
    }

    await Web3AuthFlutter.init(Web3AuthOptions(
        clientId:
            'BEEIC0Lz9CJDCy3FzjMgzZ6HduXn76CiG3qUxh_Xzqqa8XRIOPMOW_8Eck76GG8_Fpr8cq86C39eSCcwc7__APk',
        network: Network.testnet,
        redirectUrl: redirectUrl));
  }

  @override
  Widget build(BuildContext context) {
    final walletAddressProvider =
        prov.Provider.of<WalletAddressProvider>(context, listen: true);
    return Scaffold(
      body: (walletAddressProvider.walletAddress == null)
          ? Padding(
              padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top),
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
                        'Connect Wallet',
                        style: TextStyle(
                            fontFamily: 'InstagramSans',
                            fontSize: 30,
                            fontWeight: FontWeight.bold),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text(
                        'Note - Use only one Google Account to Sign Up the Wallet',
                        style: TextStyle(
                          fontFamily: 'InstagramSans',
                          fontSize: 15,
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
                                  onPressed: () async {
                                    final response =
                                        await Web3AuthFlutter.login(LoginParams(
                                            loginProvider: Provider.google));
                                    print('XXX');
                                    print(response.privKey);
                                    print('XXX');

                                    Credentials _credentials =
                                        EthPrivateKey.fromHex(
                                            response.privKey!);
                                    walletAddressProvider.setPrivateKey(
                                        response.privKey.toString());
                                    walletAddressProvider.setAddress(
                                        _credentials.address.toString());
                                  },
                                  child: const Text('Connect'),
                                ),
                              ]),
                            ],
                          ),
                        )
                      ],
                    ),
                  ]),
            )
          : Padding(
              padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
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
                      'Connect Wallet',
                      style: TextStyle(
                          fontFamily: 'InstagramSans',
                          fontSize: 30,
                          fontWeight: FontWeight.bold),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Text(
                      'You are about to see your Private Key\nMake sure you are Alone !!!',
                      style: TextStyle(
                        fontFamily: 'InstagramSans',
                        fontSize: 15,
                      ),
                    ),
                  ),
                  CircularRevealAnimation(
                    centerAlignment: Alignment.bottomRight,
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text(
                        walletAddressProvider.privateAddress.toString(),
                        style: TextStyle(fontSize: 20),
                      ),
                    ),
                    animation: animation,
                  ),
                ],
              ),
            ),
      floatingActionButton: (walletAddressProvider.walletAddress != null)
          ? FloatingActionButton(
              child: const Icon(Icons.warning),
              backgroundColor: Colors.purpleAccent.shade100.withOpacity(0.4),
              onPressed: () async {
                final LocalAuthentication auth = LocalAuthentication();
                if (isAuth == false) {
                  try {
                    final bool didAuthenticate = await auth.authenticate(
                        localizedReason: 'Please authenticate',
                        options: const AuthenticationOptions(
                            useErrorDialogs: false));
                    isAuth = didAuthenticate;
                    if (isAuth == true) {
                      if (animationController.status ==
                              AnimationStatus.forward ||
                          animationController.status ==
                              AnimationStatus.completed) {
                        animationController.reverse();
                      } else {
                        animationController.forward();
                      }
                    }
                  } on PlatformException catch (e) {
                    if (e.code == auth_error.notAvailable) {
                    } else if (e.code == auth_error.notEnrolled) {
                    } else {
                      // ...
                    }
                  }
                } else if (animationController.status ==
                        AnimationStatus.forward ||
                    animationController.status == AnimationStatus.completed) {
                  animationController.reverse();
                  isAuth = false;
                }
              })
          : null,
    );
    // Your page
  }
}
