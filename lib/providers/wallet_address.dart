import 'package:flutter/material.dart';

class WalletAddressProvider extends ChangeNotifier {
  String? _privateKey;
  String? _walletAddress;
  String? get privateAddress => _privateKey;

  String? get walletAddress => _walletAddress;
  void setAddress(String address) {
    _walletAddress = address;
    notifyListeners();
  }

  void setPrivateKey(String privateKey) {
    _privateKey = privateKey;
    notifyListeners();
  }
}
