import 'dart:io';
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

class _WalletWebState extends State<WalletWeb> {
  String rpcUrl = 'https://rpc.ankr.com/eth';

  @override
  void initState() {
    initPlatformState();

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
        body: Center(
            child:
                Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      // Get Account
      ElevatedButton(
        onPressed: () async {
          final response = await Web3AuthFlutter.login(
              LoginParams(loginProvider: Provider.google));
          print('XXX');
          print(response.privKey);
          print('XXX');

          Credentials _credentials = EthPrivateKey.fromHex(response.privKey!);
          walletAddressProvider.setPrivateKey(response.privKey.toString());
          walletAddressProvider.setAddress(_credentials.address.toString());
        },
        child: const Text('Connect'),
      ),
    ])));
    // Your page
  }
}
